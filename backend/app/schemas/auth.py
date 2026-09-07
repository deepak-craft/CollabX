from datetime import datetime
from typing import Any, Literal
from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator


AuthRole = Literal["citizen", "student", "professor", "industry", "government", "expert"]


class OTPRequest(BaseModel):
    identifier: str = Field(..., min_length=3, max_length=255)
    role: AuthRole
    name: str | None = Field(None, min_length=2, max_length=180)


class OTPVerifyRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    challenge_id: str = Field(
        ...,
        min_length=10,
        max_length=128,
        validation_alias=AliasChoices("challenge_id", "challengeId"),
    )
    otp: str = Field(
        ...,
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$",
        validation_alias=AliasChoices("otp", "code"),
    )

    @field_validator("challenge_id", mode="before")
    @classmethod
    def normalize_challenge_id(cls, value: Any) -> str:
        if isinstance(value, str):
            return value.strip()
        return str(value) if value is not None else ""

    @field_validator("otp", mode="before")
    @classmethod
    def normalize_otp(cls, value: Any) -> str:
        if isinstance(value, int):
            return f"{value:06d}"
        if isinstance(value, str):
            return value.strip()
        return str(value) if value is not None else ""


class OTPResponse(BaseModel):
    challenge_id: str
    expires_at: datetime
    delivery_configured: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: AuthRole