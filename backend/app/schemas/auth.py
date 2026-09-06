from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


AuthRole = Literal["citizen", "student", "professor", "industry", "government", "expert"]


class OTPRequest(BaseModel):
    identifier: str = Field(..., min_length=3, max_length=255)
    role: AuthRole
    name: str | None = Field(None, min_length=2, max_length=180)


class OTPVerifyRequest(BaseModel):
    challenge_id: str = Field(..., min_length=10, max_length=128)
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class OTPResponse(BaseModel):
    challenge_id: str
    expires_at: datetime
    delivery_configured: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: AuthRole