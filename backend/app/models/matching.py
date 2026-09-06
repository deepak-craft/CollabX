from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UniversityProfile(Base):
    __tablename__ = "university_profiles"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    domain: Mapped[str] = mapped_column(String(180), nullable=False)
    technologies: Mapped[str] = mapped_column(Text, nullable=False)
    expertise: Mapped[str] = mapped_column(Text, nullable=False)
    student_team_skills: Mapped[str] = mapped_column(Text, nullable=False)
    previous_project_areas: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str | None] = mapped_column(String(180), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class IndustryProfile(Base):
    __tablename__ = "industry_profiles"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    domain: Mapped[str] = mapped_column(String(180), nullable=False)
    technologies: Mapped[str] = mapped_column(Text, nullable=False)
    support_capabilities: Mapped[str] = mapped_column(Text, nullable=False)
    mentorship_capability: Mapped[str] = mapped_column(Text, nullable=False)
    funding_csr_capability: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str | None] = mapped_column(String(180), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class OpenChallenge(Base):
    __tablename__ = "open_challenges"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    domain: Mapped[str] = mapped_column(String(180), nullable=False)
    technologies: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str | None] = mapped_column(String(180), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class MatchRecommendation(Base):
    __tablename__ = "match_recommendations"
    __table_args__ = (UniqueConstraint("challenge_id", "candidate_type", "candidate_id", name="uq_match_candidate"),)

    id: Mapped[str] = mapped_column(String(220), primary_key=True)
    challenge_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    candidate_type: Mapped[str] = mapped_column(String(40), nullable=False)
    candidate_id: Mapped[str] = mapped_column(String(128), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    reviewed_by: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)