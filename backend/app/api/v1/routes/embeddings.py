from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.v1.routes.reports import get_db
from app.core.config import settings
from app.core.security import require_roles
from app.services.embedding_service import EMBEDDING_MODEL_NAME, EMBEDDING_MODEL_VERSION, upsert_embedding

router = APIRouter()


class EmbeddingRequest(BaseModel):
    source_type: Literal[
        "problem_report",
        "open_challenge",
        "university_expertise",
        "industry_expertise",
        "submitted_idea",
    ]
    source_id: str = Field(..., min_length=1, max_length=128)
    text: str = Field(..., min_length=1)


@router.post("")
async def create_embedding(payload: EmbeddingRequest, db: Session = Depends(get_db), _user = Depends(require_roles("government", "expert"))) -> dict[str, object]:
    record = upsert_embedding(db, payload.source_type, payload.source_id, payload.text)
    storage = "pgvector" if db.bind and db.bind.dialect.name == "postgresql" and settings.enable_pgvector else "json_fallback"
    return {
        "stored": record is not None,
        "source_type": payload.source_type,
        "source_id": payload.source_id,
        "model_name": EMBEDDING_MODEL_NAME,
        "model_version": EMBEDDING_MODEL_VERSION,
        "dimensions": 256,
        "storage": storage,
    }