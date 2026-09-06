"""Create legacy runtime tables when PostgreSQL is initialized without init_db.sql."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect
from sqlalchemy.exc import DBAPIError

from app.core.config import settings

revision = "20260906_0003"
down_revision = "20260906_0002"
branch_labels = None
depends_on = None


def _tables(bind):
    return set(inspect(bind).get_table_names())


def upgrade() -> None:
    bind = op.get_bind()
    tables = _tables(bind)

    use_pgvector = bind.dialect.name == "postgresql" and settings.enable_pgvector
    if use_pgvector:
        try:
            op.execute("CREATE EXTENSION IF NOT EXISTS vector")
        except DBAPIError as exc:
            raise RuntimeError(
                "PostgreSQL extension 'vector' is required when ENABLE_PGVECTOR=true. "
                "Install pgvector for this PostgreSQL 18 server and grant CREATE privilege, "
                "or explicitly set ENABLE_PGVECTOR=false to use JSON embedding storage. "
                "The Python pgvector package alone does not install the server extension."
            ) from exc

    if "reports" not in tables:
        op.create_table(
            "reports",
            sa.Column("id", sa.String(64), primary_key=True),
            sa.Column("citizen_id", sa.String(128), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("location_id", sa.String(128), sa.ForeignKey("locations.id"), nullable=True),
            sa.Column("title", sa.String(255), nullable=False),
            sa.Column("description", sa.Text, nullable=False),
            sa.Column("citizen_name", sa.String(150), nullable=True),
            sa.Column("citizen_phone", sa.String(32), nullable=True),
            sa.Column("district", sa.String(120), nullable=False),
            sa.Column("locality", sa.String(150), nullable=False),
            sa.Column("latitude", sa.Float, nullable=True),
            sa.Column("longitude", sa.Float, nullable=True),
            sa.Column("affected_population", sa.Integer, nullable=True),
            sa.Column("frequency", sa.String(255), nullable=True),
            sa.Column("evidence_urls", sa.Text, nullable=True),
            sa.Column("audio_transcript", sa.Text, nullable=True),
            sa.Column("has_voice_note", sa.Boolean, nullable=False, server_default=sa.false()),
            sa.Column("community_confirmations", sa.Integer, nullable=False, server_default="0"),
            sa.Column("status", sa.String(50), nullable=False, server_default="submitted"),
            sa.Column("category", sa.String(120), nullable=True),
            sa.Column("severity", sa.Integer, nullable=True),
            sa.Column("priority", sa.String(20), nullable=True),
            sa.Column("duplicate_similarity", sa.Float, nullable=True),
            sa.Column("duplicate_candidate_id", sa.String(64), nullable=True),
            sa.Column("duplicate_status", sa.String(40), nullable=True),
            sa.Column("duplicate_of", sa.String(64), nullable=True),
            sa.Column("ai_analysis", sa.Text, nullable=True),
            sa.Column("ai_analysis_json", sa.Text, nullable=True),
            sa.Column("workflow_stage", sa.String(50), nullable=False, server_default="submitted"),
            sa.Column("department", sa.String(120), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        )
        op.create_index("idx_reports_status", "reports", ["status"])
        op.create_index("idx_reports_district", "reports", ["district"])
        op.create_index("ix_reports_citizen_id", "reports", ["citizen_id"])
        op.create_index("ix_reports_location_id", "reports", ["location_id"])
        op.create_index("ix_reports_duplicate_status", "reports", ["duplicate_status"])

    if "semantic_embeddings" not in tables:
        if use_pgvector:
            from pgvector.sqlalchemy import Vector

            embedding_type = Vector(256)
        else:
            embedding_type = sa.Text
        op.create_table(
            "semantic_embeddings",
            sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
            sa.Column("source_type", sa.String(40), nullable=False),
            sa.Column("source_id", sa.String(128), nullable=False),
            sa.Column("content_hash", sa.String(64), nullable=False),
            sa.Column("model_name", sa.String(120), nullable=False),
            sa.Column("model_version", sa.String(40), nullable=False),
            sa.Column("dimensions", sa.Integer, nullable=False),
            sa.Column("embedding", embedding_type, nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.UniqueConstraint("source_type", "source_id", name="uq_embedding_source"),
        )
        op.create_index("idx_embeddings_source_type", "semantic_embeddings", ["source_type"])
        op.create_index("ix_semantic_embeddings_source_id", "semantic_embeddings", ["source_id"])

    if "university_profiles" not in tables:
        op.create_table(
            "university_profiles",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("name", sa.String(180), nullable=False),
            sa.Column("domain", sa.String(180), nullable=False),
            sa.Column("technologies", sa.Text, nullable=False),
            sa.Column("expertise", sa.Text, nullable=False),
            sa.Column("student_team_skills", sa.Text, nullable=False),
            sa.Column("previous_project_areas", sa.Text, nullable=False),
            sa.Column("location", sa.String(180), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )

    if "industry_profiles" not in tables:
        op.create_table(
            "industry_profiles",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("name", sa.String(180), nullable=False),
            sa.Column("domain", sa.String(180), nullable=False),
            sa.Column("technologies", sa.Text, nullable=False),
            sa.Column("support_capabilities", sa.Text, nullable=False),
            sa.Column("mentorship_capability", sa.Text, nullable=False),
            sa.Column("funding_csr_capability", sa.Text, nullable=False),
            sa.Column("location", sa.String(180), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )

    if "open_challenges" not in tables:
        op.create_table(
            "open_challenges",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("title", sa.String(255), nullable=False),
            sa.Column("description", sa.Text, nullable=False),
            sa.Column("domain", sa.String(180), nullable=False),
            sa.Column("technologies", sa.Text, nullable=False),
            sa.Column("location", sa.String(180), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )

    if "match_recommendations" not in tables:
        op.create_table(
            "match_recommendations",
            sa.Column("id", sa.String(220), primary_key=True),
            sa.Column("challenge_id", sa.String(128), nullable=False),
            sa.Column("candidate_type", sa.String(40), nullable=False),
            sa.Column("candidate_id", sa.String(128), nullable=False),
            sa.Column("score", sa.Float, nullable=False),
            sa.Column("explanation", sa.Text, nullable=False),
            sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
            sa.Column("reviewed_by", sa.String(128), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.UniqueConstraint("challenge_id", "candidate_type", "candidate_id", name="uq_match_candidate"),
        )
        op.create_index("idx_matches_challenge", "match_recommendations", ["challenge_id"])


def downgrade() -> None:
    # Existing data must not be removed by this migration.
    pass
