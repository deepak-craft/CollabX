from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class OtpChallenge(Base):
    __tablename__ = "otp_challenges"

    # Primary key – challenge identifier
    challenge_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    # Phone number (or identifier) used for OTP delivery
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    # Hash of the OTP combined with challenge_id
    otp_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    # Verification state
    attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # Reference to the user that the OTP is for
    user_id: Mapped[str] = mapped_column(String(128), ForeignKey("users.id"), nullable=False)
