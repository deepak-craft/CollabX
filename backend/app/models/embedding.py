from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import TypeDecorator
import json

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

EMBEDDING_DIMENSIONS = 256


class EmbeddingJSON(TypeDecorator[list[float]]):
    impl = Text
    cache_ok = True

    def process_bind_param(self, value: list[float] | None, dialect) -> str | None:
        return json.dumps(value) if value is not None else None

    def process_result_value(self, value: str | None, dialect) -> list[float] | None:
        return json.loads(value) if value else None


def _embedding_column_type():
    if engine.dialect.name == "postgresql" and settings.enable_pgvector:
        try:
            from pgvector.sqlalchemy import Vector

            return Vector(EMBEDDING_DIMENSIONS)
        except ImportError:
            pass
    return EmbeddingJSON()


class SemanticEmbedding(Base):
    __tablename__ = "semantic_embeddings"
    __table_args__ = (UniqueConstraint("source_type", "source_id", name="uq_embedding_source"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    source_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    model_name: Mapped[str] = mapped_column(String(120), nullable=False)
    model_version: Mapped[str] = mapped_column(String(40), nullable=False)
    dimensions: Mapped[int] = mapped_column(Integer, nullable=False)
    embedding: Mapped[list[float]] = mapped_column(_embedding_column_type(), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)