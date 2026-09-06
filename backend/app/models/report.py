from sqlalchemy import String, Float, Integer, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    citizen_id: Mapped[str | None] = mapped_column(String(128), ForeignKey("users.id"), index=True, nullable=True)
    location_id: Mapped[str | None] = mapped_column(String(128), ForeignKey("locations.id"), index=True, nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    citizen_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    citizen_phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    district: Mapped[str] = mapped_column(String(120), nullable=False)
    locality: Mapped[str] = mapped_column(String(150), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    affected_population: Mapped[int | None] = mapped_column(Integer, nullable=True)
    frequency: Mapped[str | None] = mapped_column(String(255), nullable=True)
    evidence_urls: Mapped[str | None] = mapped_column(Text, nullable=True)
    audio_transcript: Mapped[str | None] = mapped_column(Text, nullable=True)
    has_voice_note: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    community_confirmations: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="submitted", nullable=False)
    category: Mapped[str | None] = mapped_column(String(120), nullable=True)
    severity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    priority: Mapped[str | None] = mapped_column(String(20), nullable=True)
    duplicate_similarity: Mapped[float | None] = mapped_column(Float, nullable=True)
    duplicate_candidate_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    duplicate_status: Mapped[str | None] = mapped_column(String(40), index=True, nullable=True)
    duplicate_of: Mapped[str | None] = mapped_column(String(64), nullable=True)
    ai_analysis: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_analysis_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    workflow_stage: Mapped[str] = mapped_column(String(50), nullable=False, default="submitted")
    department: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[str | None] = mapped_column(DateTime(timezone=True), nullable=True)
