from __future__ import annotations

import json
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.routes.reports import get_db
from app.core.security import get_current_user, require_roles
from app.models.matching import IndustryProfile, MatchRecommendation, OpenChallenge, UniversityProfile
from app.schemas.matching import IndustryProfileCreate, MatchDecision, OpenChallengeCreate, UniversityProfileCreate
from app.services.embedding_service import upsert_embedding
from app.services.matching_service import refresh_challenge_matches
from app.services.audit_service import record_audit

router = APIRouter()


def _profile_payload(profile: UniversityProfile | IndustryProfile) -> dict[str, object]:
    payload = {column.name: getattr(profile, column.name) for column in profile.__table__.columns}
    for key in ("technologies", "previous_project_areas"):
        if key in payload:
            payload[key] = json.loads(payload[key])
    return payload


def _recommendation_payload(db: Session, recommendation: MatchRecommendation) -> dict[str, object]:
    profile = None
    if recommendation.candidate_type == "university":
        profile = db.get(UniversityProfile, recommendation.candidate_id)
    elif recommendation.candidate_type == "industry":
        profile = db.get(IndustryProfile, recommendation.candidate_id)
    return {
        "id": recommendation.id,
        "challenge_id": recommendation.challenge_id,
        "candidate_type": recommendation.candidate_type,
        "candidate_id": recommendation.candidate_id,
        "candidate": _profile_payload(profile) if profile else None,
        "matching_score": recommendation.score,
        "explanation": recommendation.explanation,
        "status": recommendation.status,
        "reviewed_by": recommendation.reviewed_by,
        "created_at": recommendation.created_at.isoformat(),
        "updated_at": recommendation.updated_at.isoformat(),
    }


@router.post("/profiles/universities")
async def create_university_profile(payload: UniversityProfileCreate, db: Session = Depends(get_db), _user = Depends(require_roles("student", "professor"))) -> dict[str, object]:
    profile = UniversityProfile(
        id=payload.id or f"university-{uuid4().hex}",
        name=payload.name,
        domain=payload.domain,
        technologies=json.dumps(payload.technologies),
        expertise=payload.expertise,
        student_team_skills=payload.student_team_skills,
        previous_project_areas=json.dumps(payload.previous_project_areas),
        location=payload.location,
        created_at=datetime.now(timezone.utc),
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    embedding = upsert_embedding(db, "university_expertise", profile.id, "\n".join((profile.domain, profile.technologies, profile.expertise, profile.student_team_skills, profile.previous_project_areas, profile.location or "")))
    return {**_profile_payload(profile), "embedding_stored": embedding is not None}


@router.post("/profiles/industries")
async def create_industry_profile(payload: IndustryProfileCreate, db: Session = Depends(get_db), _user = Depends(require_roles("industry"))) -> dict[str, object]:
    profile = IndustryProfile(
        id=payload.id or f"industry-{uuid4().hex}",
        name=payload.name,
        domain=payload.domain,
        technologies=json.dumps(payload.technologies),
        support_capabilities=payload.support_capabilities,
        mentorship_capability=payload.mentorship_capability,
        funding_csr_capability=payload.funding_csr_capability,
        location=payload.location,
        created_at=datetime.now(timezone.utc),
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    embedding = upsert_embedding(db, "industry_expertise", profile.id, "\n".join((profile.domain, profile.technologies, profile.support_capabilities, profile.mentorship_capability, profile.funding_csr_capability, profile.location or "")))
    return {**_profile_payload(profile), "embedding_stored": embedding is not None}


@router.post("")
async def create_open_challenge(payload: OpenChallengeCreate, db: Session = Depends(get_db), _user = Depends(require_roles("government"))) -> dict[str, object]:
    challenge = OpenChallenge(
        id=payload.id or f"challenge-{uuid4().hex}",
        title=payload.title,
        description=payload.description,
        domain=payload.domain,
        technologies=json.dumps(payload.technologies),
        location=payload.location,
        created_at=datetime.now(timezone.utc),
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    embedding = upsert_embedding(db, "open_challenge", challenge.id, "\n".join((challenge.title, challenge.description, challenge.domain, challenge.technologies, challenge.location or "")))
    return {
        "id": challenge.id,
        "title": challenge.title,
        "description": challenge.description,
        "domain": challenge.domain,
        "technologies": payload.technologies,
        "location": challenge.location,
        "embedding_stored": embedding is not None,
    }


@router.get("/{challenge_id}/matches")
async def get_challenge_matches(challenge_id: str, db: Session = Depends(get_db), _user = Depends(get_current_user)) -> dict[str, object]:
    challenge = db.get(OpenChallenge, challenge_id)
    if challenge is None:
        raise HTTPException(status_code=404, detail="Open challenge not found")
    recommendations = refresh_challenge_matches(db, challenge)
    return {
        "challenge_id": challenge_id,
        "recommendations": [_recommendation_payload(db, recommendation) for recommendation in recommendations],
        "note": "Recommendations require authorized review and do not guarantee assignment, funding, procurement, or a government tender.",
    }


@router.patch("/matches/{recommendation_id}/decision")
async def decide_match(recommendation_id: str, payload: MatchDecision, db: Session = Depends(get_db), actor = Depends(require_roles("government", "expert"))) -> dict[str, object]:
    recommendation = db.get(MatchRecommendation, recommendation_id)
    if recommendation is None:
        raise HTTPException(status_code=404, detail="Match recommendation not found")
    recommendation.status = payload.status
    recommendation.reviewed_by = payload.reviewed_by
    recommendation.updated_at = datetime.now(timezone.utc)
    record_audit(db, actor.id, actor.role, "DECIDE_MATCH", "match_recommendation", recommendation.id, payload.model_dump())
    db.commit()
    db.refresh(recommendation)
    return _recommendation_payload(db, recommendation)