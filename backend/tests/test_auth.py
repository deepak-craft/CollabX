from datetime import datetime, timedelta, timezone
import asyncio

import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.api.v1.routes import auth
from app.core.config import settings
from app.core.security import get_current_user, require_roles
from app.models.normalized import User
from app.models.otp_challenge import OtpChallenge
from app.schemas.auth import OTPRequest, OTPVerifyRequest


class FakeDb:
    def __init__(self):
        self.user = None
        self.objects = {}

    def scalar(self, _query):
        return self.user

    def add(self, user):
        if isinstance(user, User):
            self.user = user
        else:
            self.objects[(type(user), user.challenge_id)] = user

    def commit(self):
        return None

    def refresh(self, _user):
        return None

    def get(self, model, item_id):
        if model is User:
            return self.user
        return self.objects.get((model, item_id))

    def delete(self, item):
        self.objects.pop((type(item), item.challenge_id), None)


class FakeDbWithUser:
    def __init__(self, user):
        self.user = user

    def get(self, _model, _user_id):
        return self.user


@pytest.fixture
def auth_state(monkeypatch):
    auth._otp_request_history.clear()
    monkeypatch.setattr(settings, "auth_mode", "demo")
    monkeypatch.setattr(settings, "auth_otp_expire_seconds", 300)
    monkeypatch.setattr(settings, "auth_otp_max_attempts", 3)
    monkeypatch.setattr(settings, "auth_otp_rate_limit_max_requests", 3)
    monkeypatch.setattr(settings, "auth_otp_rate_limit_window_seconds", 600)
    monkeypatch.setattr(settings, "jwt_secret_key", "test-jwt-secret")
    monkeypatch.setattr(auth, "_deliver_otp", lambda *_args: None)
    yield
    auth._otp_request_history.clear()


def _run(awaitable):
    return asyncio.run(awaitable)


def test_otp_verification_creates_jwt_and_is_one_time(auth_state, monkeypatch):
    db = FakeDb()
    generated = []
    monkeypatch.setattr(auth, "_deliver_otp", lambda _identifier, otp, _expires_at: generated.append(otp))
    response = _run(auth.request_otp(OTPRequest(identifier="user@example.com", role="government"), db))

    assert len(generated) == 1 and generated[0].isdigit() and len(generated[0]) == 6
    token = _run(auth.verify_otp(OTPVerifyRequest(challenge_id=response.challenge_id, otp=generated[0]), db))

    assert token.role == "government"
    assert token.access_token
    with pytest.raises(HTTPException) as reused:
        _run(auth.verify_otp(OTPVerifyRequest(challenge_id=response.challenge_id, otp=generated[0]), db))
    assert reused.value.status_code == 401


def test_invalid_otp_is_rejected_and_attempt_limit_expires_challenge(auth_state):
    db = FakeDb()
    response = _run(auth.request_otp(OTPRequest(identifier="invalid@example.com", role="citizen"), db))

    for _ in range(3):
        with pytest.raises(HTTPException) as invalid:
            _run(auth.verify_otp(OTPVerifyRequest(challenge_id=response.challenge_id, otp="000000"), db))
        assert invalid.value.status_code == 401

    with pytest.raises(HTTPException) as expired:
        _run(auth.verify_otp(OTPVerifyRequest(challenge_id=response.challenge_id, otp="123456"), db))
    assert expired.value.status_code == 401


def test_expired_otp_is_rejected(auth_state):
    db = FakeDb()
    response = _run(auth.request_otp(OTPRequest(identifier="expired@example.com", role="citizen"), db))
    db.get(OtpChallenge, response.challenge_id).expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)

    with pytest.raises(HTTPException) as expired:
        _run(auth.verify_otp(OTPVerifyRequest(challenge_id=response.challenge_id, otp="123456"), db))
    assert expired.value.status_code == 401


def test_otp_requests_are_rate_limited(auth_state, monkeypatch):
    monkeypatch.setattr(settings, "auth_otp_rate_limit_max_requests", 2)
    db = FakeDb()
    payload = OTPRequest(identifier="limited@example.com", role="citizen")

    _run(auth.request_otp(payload, db))
    _run(auth.request_otp(payload, db))
    with pytest.raises(HTTPException) as limited:
        _run(auth.request_otp(payload, db))
    assert limited.value.status_code == 429


def test_demo_mode_ignores_legacy_universal_dev_otp(auth_state, monkeypatch):
    monkeypatch.setattr(settings, "auth_dev_mode", True)
    monkeypatch.setattr(settings, "auth_dev_otp", "123456")
    generated = []
    monkeypatch.setattr(auth, "_deliver_otp", lambda _identifier, otp, _expires_at: generated.append(otp))
    db = FakeDb()

    _run(auth.request_otp(OTPRequest(identifier="demo-one@example.com", role="citizen"), db))
    _run(auth.request_otp(OTPRequest(identifier="demo-two@example.com", role="citizen"), db))

    assert all(len(otp) == 6 and otp.isdigit() for otp in generated)
    assert all(otp != "123456" for otp in generated)
    assert generated[0] != generated[1]


def test_unauthorized_and_authorized_government_access():
    with pytest.raises(HTTPException) as unauthorized:
        get_current_user(None, FakeDb())
    assert unauthorized.value.status_code == 401

    government = User(id="government-1", name="Government", email="gov@example.com", role="government", created_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    assert require_roles("government")(government) is government


def test_verified_jwt_reaches_government_rbac_dependency(monkeypatch):
    monkeypatch.setattr(settings, "jwt_secret_key", "test-jwt-secret")
    government = User(id="government-2", name="Government", email="gov2@example.com", role="government", created_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    from app.core.security import create_access_token

    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=create_access_token(government))
    authenticated = get_current_user(credentials, FakeDbWithUser(government))
    assert require_roles("government")(authenticated) is government


def test_production_requires_otp_provider(monkeypatch):
    auth._otp_request_history.clear()
    monkeypatch.setattr(settings, "auth_mode", "sms")
    monkeypatch.setattr(settings, "auth_otp_provider_url", None)
    monkeypatch.setattr(settings, "auth_otp_provider_api_key", None)
    monkeypatch.setattr(settings, "auth_otp_sender", None)
    monkeypatch.setattr(settings, "jwt_secret_key", "test-jwt-secret")

    with pytest.raises(HTTPException) as missing_provider:
        _run(auth.request_otp(OTPRequest(identifier="prod@example.com", role="citizen"), FakeDb()))
    assert missing_provider.value.status_code == 503
