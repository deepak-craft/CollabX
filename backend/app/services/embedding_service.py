from __future__ import annotations

import math
import re
import hashlib
import logging
import json
from urllib.request import Request, urlopen
from collections import Counter
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.embedding import EMBEDDING_DIMENSIONS, SemanticEmbedding
from app.models.report import Report

logger = logging.getLogger(__name__)

EMBEDDING_MODEL_NAME = "collabx-hash-embedding"
EMBEDDING_MODEL_VERSION = "1"
SUPPORTED_SOURCE_TYPES = {
    "problem_report",
    "open_challenge",
    "university_expertise",
    "industry_expertise",
    "submitted_idea",
}


def normalize_text(text: str) -> str:
    return re.sub(r"[^a-z0-9\s]", " ", text.lower())


def build_embedding(text: str, dimension: int = 256) -> list[float]:
    cleaned = normalize_text(text)
    tokens = cleaned.split()
    if not tokens:
        return [0.0] * dimension

    counts = Counter(tokens)
    vector = [0.0] * dimension
    for i, token in enumerate(sorted(counts.keys())):
        index = (sum(ord(ch) for ch in token) + i) % dimension
        vector[index] += float(counts[token])
    norm = math.sqrt(sum(value * value for value in vector))
    if norm > 0:
        vector = [value / norm for value in vector]
    return vector


def _provider_embedding(text: str) -> list[float]:
    if not settings.ai_embedding_provider_url:
        raise RuntimeError("AI embedding provider is not configured")
    request_body = {"model": settings.ai_embedding_model, "input": text}
    headers = {"Content-Type": "application/json"}
    if settings.ai_api_key:
        headers["Authorization"] = f"Bearer {settings.ai_api_key}"
    request = Request(settings.ai_embedding_provider_url, data=json.dumps(request_body).encode("utf-8"), headers=headers, method="POST")
    with urlopen(request, timeout=settings.ai_timeout_seconds) as response:
        response_data = json.loads(response.read().decode("utf-8"))
    vector = response_data.get("data", [{}])[0].get("embedding")
    if not isinstance(vector, list) or len(vector) != EMBEDDING_DIMENSIONS:
        raise ValueError(f"AI embedding provider must return {EMBEDDING_DIMENSIONS} dimensions")
    return [float(value) for value in vector]


def _build_embedding(text: str) -> list[float]:
    if settings.ai_embedding_enabled:
        try:
            return _provider_embedding(text)
        except Exception:
            logger.warning("AI embedding provider failed; using local embedding")
    return build_embedding(text, EMBEDDING_DIMENSIONS)


def _content_hash(text: str) -> str:
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()


def upsert_embedding(db: Session, source_type: str, source_id: str, text: str) -> SemanticEmbedding | None:
    """Store an embedding only when the source content or model metadata changed."""
    if source_type not in SUPPORTED_SOURCE_TYPES:
        raise ValueError(f"Unsupported embedding source type: {source_type}")
    if not source_id.strip() or not text.strip():
        raise ValueError("Embedding source_id and text are required")

    content_hash = _content_hash(text)
    existing = db.scalar(
        select(SemanticEmbedding).where(
            SemanticEmbedding.source_type == source_type,
            SemanticEmbedding.source_id == source_id,
        )
    )
    if (
        existing
        and existing.content_hash == content_hash
        and existing.model_name == EMBEDDING_MODEL_NAME
        and existing.model_version == EMBEDDING_MODEL_VERSION
        and existing.dimensions == EMBEDDING_DIMENSIONS
    ):
        return existing

    try:
        now = datetime.now(timezone.utc)
        values = {
            "content_hash": content_hash,
            "model_name": EMBEDDING_MODEL_NAME,
            "model_version": EMBEDDING_MODEL_VERSION,
            "dimensions": EMBEDDING_DIMENSIONS,
            "embedding": _build_embedding(text),
            "updated_at": now,
        }
        if existing:
            for key, value in values.items():
                setattr(existing, key, value)
            record = existing
        else:
            record = SemanticEmbedding(
                source_type=source_type,
                source_id=source_id,
                created_at=now,
                **values,
            )
            db.add(record)
        db.commit()
        db.refresh(record)
        return record
    except Exception:
        db.rollback()
        logger.exception("Embedding generation or persistence failed for %s/%s", source_type, source_id)
        return None


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    if len(vec_a) != len(vec_b):
        raise ValueError("Embedding dimensions must match")

    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a * a for a in vec_a))
    mag_b = math.sqrt(sum(b * b for b in vec_b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return max(0.0, min(1.0, dot / (mag_a * mag_b))) * 100.0


def find_similar_reports(db: Session, report_id: str, threshold: float | None = None, limit: int | None = None) -> list[dict[str, object]]:
    source = db.scalar(select(SemanticEmbedding).where(SemanticEmbedding.source_type == "problem_report", SemanticEmbedding.source_id == report_id))
    if source is None:
        return []
    rows = db.scalars(select(SemanticEmbedding).where(SemanticEmbedding.source_type == "problem_report", SemanticEmbedding.source_id != report_id)).all()
    minimum = settings.duplicate_similarity_threshold if threshold is None else threshold
    maximum = settings.duplicate_similarity_limit if limit is None else limit
    matches: list[dict[str, object]] = []
    for candidate in rows:
        score = round(cosine_similarity(source.embedding, candidate.embedding), 2)
        if score >= minimum:
            report = db.get(Report, candidate.source_id)
            if report is not None:
                matches.append({
                    "report_id": report.id,
                    "title": report.title,
                    "similarity": score,
                    "status": "possible_duplicate" if score >= minimum else "similar_report",
                })
    return sorted(matches, key=lambda match: float(match["similarity"]), reverse=True)[:maximum]
