from __future__ import annotations

from datetime import datetime, timezone
import json
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.core.config import settings
from app.models.report import Report
from app.models.normalized import User
from app.core.security import get_current_user, require_roles
from app.services.duplicate_detection import find_duplicate_candidates
from app.services.embedding_service import build_embedding, cosine_similarity, find_similar_reports, upsert_embedding
from app.services.problem_structuring import structure_problem

router = APIRouter()


class ReportCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    citizen_id: str | None = Field(None, max_length=128)
    district: str
    locality: str
    citizen_name: str | None = None
    citizen_phone: str | None = None
    coordinates: dict[str, float] | None = None
    affected_population: int | None = None
    frequency: str | None = None
    evidence_urls: list[str] = []
    audio_transcript: str | None = None
    has_voice_note: bool = False


class ReportAIOverrideRequest(BaseModel):
    category: str | None = Field(None, min_length=1, max_length=120)
    priority: Literal["Low", "Medium", "High", "Critical"] | None = None
    severity: int | None = Field(None, ge=0, le=100)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def serialize_report(row: Report) -> dict[str, object]:
    recommendation = json.loads(row.ai_analysis_json) if row.ai_analysis_json else {}
    return {
        "id": row.id,
        "title": row.title,
        "description": row.description,
        "district": row.district,
        "locality": row.locality,
        "citizen_name": row.citizen_name,
        "citizen_phone": row.citizen_phone,
        "coordinates": {"lat": row.latitude, "lng": row.longitude} if row.latitude is not None and row.longitude is not None else None,
        "affected_population": row.affected_population,
        "frequency": row.frequency,
        "evidence_urls": row.evidence_urls.split("||") if row.evidence_urls else [],
        "audio_transcript": row.audio_transcript,
        "has_voice_note": row.has_voice_note,
        "status": row.status,
        "workflow_stage": row.workflow_stage,
        "department": row.department,
        "duplicate_similarity": row.duplicate_similarity,
        "summary": recommendation.get("summary", ""),
        "category": row.category or recommendation.get("category", ""),
        "problem_type": recommendation.get("problem_type", ""),
        "severity": row.severity if row.severity is not None else recommendation.get("severity", 0),
        "recurrence": recommendation.get("recurrence", 0),
        "priority_score": recommendation.get("priority_score", 0),
        "priority_level": row.priority or recommendation.get("priority_level", "Low"),
        "keywords": recommendation.get("keywords", []),
        "ai_recommendation": recommendation,
        "created_at": row.created_at.isoformat() if row.created_at else None,
        "updated_at": row.updated_at.isoformat() if row.updated_at else None,
    }


@router.get("")
async def list_reports(db: Session = Depends(get_db), _user: User = Depends(require_roles("government", "expert"))) -> list[dict[str, object]]:
    rows = db.scalars(select(Report).order_by(Report.created_at.desc())).all()
    return [serialize_report(row) for row in rows]


@router.post("")
async def create_report(payload: ReportCreateRequest, db: Session = Depends(get_db)) -> dict[str, object]:
    if not payload.title.strip() or not payload.description.strip():
        raise HTTPException(status_code=400, detail="Title and description are required.")
    if payload.citizen_id and db.get(User, payload.citizen_id) is None:
        raise HTTPException(status_code=404, detail="Citizen user not found")

    existing = db.scalars(select(Report)).all()
    existing_text = [f"{row.title} {row.description} {row.locality} {row.district}" for row in existing]
    duplicate_similarity = max(find_duplicate_candidates(f"{payload.title} {payload.description} {payload.locality} {payload.district}", existing_text).values(), default=0.0)
    duplicate_candidate_id = None

    candidate_text = f"{payload.title} {payload.description} {payload.locality} {payload.district}"
    candidate_embedding = build_embedding(candidate_text)
    for previous in existing:
        previous_text = f"{previous.title} {previous.description} {previous.locality} {previous.district}"
        similarity = cosine_similarity(candidate_embedding, build_embedding(previous_text))
        if similarity > duplicate_similarity:
            duplicate_similarity = similarity
            duplicate_candidate_id = previous.id

    try:
        context = "\n".join(filter(None, (payload.audio_transcript or "", payload.district, payload.locality)))
        recommendation = await structure_problem(payload.description, context)
    except Exception:
        recommendation = None

    report_id = f"JH-RC-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    created_at = datetime.now(timezone.utc)
    row = Report(
        id=report_id,
        citizen_id=payload.citizen_id,
        title=payload.title,
        description=payload.description,
        citizen_name=payload.citizen_name,
        citizen_phone=payload.citizen_phone,
        district=payload.district,
        locality=payload.locality,
            latitude=payload.coordinates.get("lat") if payload.coordinates else None,
            longitude=payload.coordinates.get("lng") if payload.coordinates else None,
        affected_population=payload.affected_population,
        frequency=payload.frequency,
        evidence_urls="||".join(payload.evidence_urls) if payload.evidence_urls else None,
        audio_transcript=payload.audio_transcript,
        has_voice_note=payload.has_voice_note,
        community_confirmations=1,
        status="submitted",
        category=recommendation.category if recommendation else None,
        severity=recommendation.severity if recommendation else None,
        priority=recommendation.priority_level if recommendation else None,
        duplicate_similarity=duplicate_similarity,
        duplicate_candidate_id=duplicate_candidate_id if duplicate_similarity >= settings.duplicate_similarity_threshold else None,
        duplicate_status="possible_duplicate" if duplicate_similarity >= settings.duplicate_similarity_threshold else "new_report",
        ai_analysis_json=recommendation.model_dump_json() if recommendation else None,
        created_at=created_at,
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    try:
        upsert_embedding(
            db,
            source_type="problem_report",
            source_id=row.id,
            text=f"{row.title}\n{row.description}",
        )
    except Exception:
        # Embedding availability must never block a citizen report.
        pass

    return serialize_report(row)


@router.get("/{report_id}/similar")
async def similar_reports(report_id: str, db: Session = Depends(get_db), _user: User = Depends(require_roles("government", "expert"))) -> dict[str, object]:
    if db.get(Report, report_id) is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return {
        "report_id": report_id,
        "threshold": settings.duplicate_similarity_threshold,
        "matches": find_similar_reports(db, report_id),
        "note": "Similarity results are advisory. Government confirmation is required before any merge or workflow decision.",
    }


@router.patch("/{report_id}/ai-overrides")
async def override_ai_recommendation(report_id: str, payload: ReportAIOverrideRequest, db: Session = Depends(get_db), _user: User = Depends(require_roles("government"))) -> dict[str, object]:
    row = db.get(Report, report_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if payload.category is None and payload.priority is None and payload.severity is None:
        raise HTTPException(status_code=400, detail="At least one AI recommendation override is required.")

    if payload.category is not None:
        row.category = payload.category
    if payload.priority is not None:
        row.priority = payload.priority
    if payload.severity is not None:
        row.severity = payload.severity
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return serialize_report(row)


@router.get("/{report_id}")
async def get_report(report_id: str, db: Session = Depends(get_db), _user: User = Depends(get_current_user)) -> dict[str, object]:
    row = db.get(Report, report_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return serialize_report(row)
