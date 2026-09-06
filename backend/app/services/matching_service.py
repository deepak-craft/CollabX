from __future__ import annotations

import json
import re
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.embedding import SemanticEmbedding
from app.models.matching import IndustryProfile, MatchRecommendation, OpenChallenge, UniversityProfile
from app.services.embedding_service import cosine_similarity

MATCH_CANDIDATE_TYPES = ("university", "industry")
STOP_WORDS = {"about", "after", "also", "because", "challenge", "their", "there", "these", "with", "from", "that", "this"}


def _tokens(text: str) -> set[str]:
    return {token for token in re.findall(r"[a-z0-9]{4,}", text.lower()) if token not in STOP_WORDS}


def _explanation(challenge_text: str, profile_text: str, score: float) -> str:
    shared = list(_tokens(challenge_text) & _tokens(profile_text))[:3]
    reason = " + ".join(shared) if shared else "related domain and expertise"
    strength = "Strong match" if score >= 70 else "Good match" if score >= 45 else "Potential match"
    return f"{strength} because of {reason} expertise. This is a recommendation for authorized review, not an assignment or funding guarantee."


def _profile_text(profile: UniversityProfile | IndustryProfile) -> str:
    if isinstance(profile, UniversityProfile):
        return "\n".join((profile.domain, profile.technologies, profile.expertise, profile.student_team_skills, profile.previous_project_areas, profile.location or ""))
    return "\n".join((profile.domain, profile.technologies, profile.support_capabilities, profile.mentorship_capability, profile.funding_csr_capability, profile.location or ""))


def _challenge_text(challenge: OpenChallenge) -> str:
    return "\n".join((challenge.title, challenge.description, challenge.domain, challenge.technologies, challenge.location or ""))


def _embedding_map(db: Session, source_type: str, source_ids: list[str]) -> dict[str, SemanticEmbedding]:
    rows = db.scalars(select(SemanticEmbedding).where(SemanticEmbedding.source_type == source_type, SemanticEmbedding.source_id.in_(source_ids))).all()
    return {row.source_id: row for row in rows}


def refresh_challenge_matches(db: Session, challenge: OpenChallenge) -> list[MatchRecommendation]:
    challenge_embedding = db.scalar(select(SemanticEmbedding).where(SemanticEmbedding.source_type == "open_challenge", SemanticEmbedding.source_id == challenge.id))
    if challenge_embedding is None:
        return []

    candidates: list[tuple[str, UniversityProfile | IndustryProfile, SemanticEmbedding | None]] = []
    universities = db.scalars(select(UniversityProfile)).all()
    industries = db.scalars(select(IndustryProfile)).all()
    university_embeddings = _embedding_map(db, "university_expertise", [profile.id for profile in universities])
    industry_embeddings = _embedding_map(db, "industry_expertise", [profile.id for profile in industries])
    candidates.extend(("university", profile, university_embeddings.get(profile.id)) for profile in universities)
    candidates.extend(("industry", profile, industry_embeddings.get(profile.id)) for profile in industries)

    recommendations: list[MatchRecommendation] = []
    now = datetime.now(timezone.utc)
    challenge_text = _challenge_text(challenge)
    for candidate_type, profile, profile_embedding in candidates:
        if profile_embedding is None:
            continue
        score = round(cosine_similarity(challenge_embedding.embedding, profile_embedding.embedding), 2)
        match_id = f"MATCH-{challenge.id}-{candidate_type}-{profile.id}"
        recommendation = db.get(MatchRecommendation, match_id)
        if recommendation is None:
            recommendation = MatchRecommendation(
                id=match_id,
                challenge_id=challenge.id,
                candidate_type=candidate_type,
                candidate_id=profile.id,
                status="pending",
                created_at=now,
                updated_at=now,
            )
            db.add(recommendation)
        recommendation.score = score
        recommendation.explanation = _explanation(challenge_text, _profile_text(profile), score)
        recommendation.updated_at = now
        recommendations.append(recommendation)
    db.commit()
    return sorted(recommendations, key=lambda recommendation: recommendation.score, reverse=True)