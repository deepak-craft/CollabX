from __future__ import annotations

import hashlib
import hmac
import json
import secrets
import urllib.error
import urllib.request
from collections import deque
from datetime import datetime, timedelta, timezone
import logging
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.routes.reports import get_db
from app.core.config import settings
from app.core.security import create_access_token, get_current_user
from app.schemas.auth import OTPRequest, OTPVerifyRequest, OTPResponse, TokenResponse
from app.models.normalized import User
from app.models.otp_challenge import OtpChallenge

router = APIRouter()
_otp_request_history: dict[str, deque[datetime]] = {}
logger = logging.getLogger(__name__)


def _otp_secret() -> bytes:
    secret = settings.jwt_secret_key or settings.secret_key
    if not secret:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OTP signing secret is not configured")
    return secret.encode("utf-8")


def _hash_otp(challenge_id: str, otp: str) -> str:
    return hmac.new(_otp_secret(), f"{challenge_id}:{otp}".encode("utf-8"), hashlib.sha256).hexdigest()


def _rate_limit_key(identifier: str, role: str) -> str:
    return f"{role}:{identifier.strip().lower()}"


def _check_request_rate_limit(identifier: str, role: str, now: datetime) -> None:
    key = _rate_limit_key(identifier, role)
    history = _otp_request_history.setdefault(key, deque())
    cutoff = now - timedelta(seconds=settings.auth_otp_rate_limit_window_seconds)
    while history and history[0] <= cutoff:
        history.popleft()
    if len(history) >= settings.auth_otp_rate_limit_max_requests:
        retry_after = max(1, int((history[0] - cutoff).total_seconds()))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP requests. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )
    history.append(now)


def _deliver_otp(identifier: str, otp: str, expires_at: datetime) -> None:
    if settings.auth_mode == "demo":
        logger.warning(
            "[DEMO OTP] recipient=%s otp=%s expires_at=%s",
            identifier,
            otp,
            expires_at.isoformat(),
        )
        return
    if settings.auth_mode != "sms":
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Unsupported OTP authentication mode")
    if not settings.auth_otp_provider_url or not settings.auth_otp_provider_api_key or not settings.auth_otp_sender:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SMS OTP provider URL, API key, and sender are required for SMS mode",
        )

    body = json.dumps({
        "recipient": identifier,
        "otp": otp,
        "expires_at": expires_at.isoformat(),
        "sender": settings.auth_otp_sender,
    }).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if settings.auth_otp_provider_api_key:
        headers["Authorization"] = f"Bearer {settings.auth_otp_provider_api_key}"
    request = urllib.request.Request(settings.auth_otp_provider_url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=settings.auth_otp_timeout_seconds) as response:
            if response.status < 200 or response.status >= 300:
                raise RuntimeError("OTP provider rejected the delivery request")
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, OSError) as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="OTP delivery provider is unavailable") from exc


@router.post("/request-otp", response_model=OTPResponse)
async def request_otp(payload: OTPRequest, db: Session = Depends(get_db)) -> OTPResponse:
    requested_at = datetime.now(timezone.utc)
    _check_request_rate_limit(payload.identifier, payload.role, requested_at)
    user = db.scalar(select(User).where(User.email == payload.identifier, User.role == payload.role))
    if user is None:
        timestamp = datetime.now(timezone.utc)
        user = User(
            id=f"user-{uuid4().hex}",
            name=payload.name or payload.identifier,
            email=payload.identifier,
            role=payload.role,
            created_at=timestamp,
            updated_at=timestamp,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    challenge_id = secrets.token_urlsafe(24)
    # Generate OTP: use dev OTP if enabled, otherwise random 6‑digit
    otp = f"{secrets.randbelow(1_000_000):06d}"
    expires_at = requested_at + timedelta(seconds=settings.auth_otp_expire_seconds)
    _deliver_otp(payload.identifier, otp, expires_at)
    # Store OTP challenge in database
    otp_challenge = OtpChallenge(
        challenge_id=challenge_id,
        phone_number=payload.identifier,
        otp_hash=_hash_otp(challenge_id, otp),
        created_at=requested_at,
        expires_at=expires_at,
        attempts=0,
        is_used=False,
        user_id=user.id,
    )
    db.add(otp_challenge)
    db.commit()
    # Return challenge info
    return OTPResponse(
        challenge_id=challenge_id,
        expires_at=expires_at,
        delivery_configured=settings.auth_mode == "demo" or bool(settings.auth_otp_provider_url),
    )


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(payload: OTPVerifyRequest, db: Session = Depends(get_db)) -> TokenResponse:
    # Retrieve OTP challenge from DB
    otp_challenge = db.get(OtpChallenge, payload.challenge_id)
    now = datetime.now(timezone.utc)
    if otp_challenge is None or otp_challenge.expires_at < now or otp_challenge.is_used:
        if otp_challenge:
            db.delete(otp_challenge)
            db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")
    if otp_challenge.attempts >= settings.auth_otp_max_attempts:
        db.delete(otp_challenge)
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")
    # Increment attempts
    otp_challenge.attempts += 1
    db.add(otp_challenge)
    db.commit()
    # Verify OTP
    if not secrets.compare_digest(str(otp_challenge.otp_hash), _hash_otp(payload.challenge_id, payload.otp)):
        if otp_challenge.attempts >= settings.auth_otp_max_attempts:
            db.delete(otp_challenge)
            db.commit()
        else:
            db.add(otp_challenge)
            db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")
    # Successful verification: mark used and generate JWT
    otp_challenge.is_used = True
    db.add(otp_challenge)
    db.commit()
    user = db.get(User, otp_challenge.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return TokenResponse(access_token=create_access_token(user), user_id=user.id, role=user.role)


@router.get("/me")
async def current_user(user: User = Depends(get_current_user)) -> dict[str, object]:
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}