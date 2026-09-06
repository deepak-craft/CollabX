"""Add normalized CollabX relational schema without replacing existing data."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260906_0001"
down_revision = None
branch_labels = None
depends_on = None


def _tables(bind):
    return set(inspect(bind).get_table_names())


def _columns(bind, table_name):
    return {column["name"] for column in inspect(bind).get_columns(table_name)}


def upgrade() -> None:
    bind = op.get_bind()
    tables = _tables(bind)

    if "users" not in tables:
        op.create_table(
            "users",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("name", sa.String(180), nullable=False),
            sa.Column("email", sa.String(255), nullable=True),
            sa.Column("role", sa.String(50), nullable=False, server_default="citizen"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_users_email", "users", ["email"])

    if "locations" not in tables:
        op.create_table(
            "locations",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("district", sa.String(120), nullable=False),
            sa.Column("locality", sa.String(180), nullable=True),
            sa.Column("latitude", sa.Float, nullable=True),
            sa.Column("longitude", sa.Float, nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_locations_district", "locations", ["district"])

    if "reports" not in tables:
        op.create_table(
            "reports",
            sa.Column("id", sa.String(64), primary_key=True),
            sa.Column("citizen_id", sa.String(128), nullable=True),
            sa.Column("location_id", sa.String(128), nullable=True),
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
            sa.ForeignKeyConstraint(["citizen_id"], ["users.id"], name="fk_reports_citizen"),
            sa.ForeignKeyConstraint(["location_id"], ["locations.id"], name="fk_reports_location"),
        )
        op.create_index("idx_reports_status", "reports", ["status"])
        op.create_index("idx_reports_district", "reports", ["district"])
        op.create_index("ix_reports_citizen_id", "reports", ["citizen_id"])
        op.create_index("ix_reports_location_id", "reports", ["location_id"])
        op.create_index("ix_reports_duplicate_status", "reports", ["duplicate_status"])

    if "challenges" not in tables:
        op.create_table(
            "challenges",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("problem_report_id", sa.String(64), sa.ForeignKey("reports.id"), nullable=True),
            sa.Column("title", sa.String(255), nullable=False),
            sa.Column("description", sa.Text, nullable=False),
            sa.Column("domain", sa.String(180), nullable=False),
            sa.Column("technologies", sa.Text, nullable=False),
            sa.Column("status", sa.String(40), nullable=False, server_default="open"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_challenges_status", "challenges", ["status"])
        op.create_index("ix_challenges_domain", "challenges", ["domain"])

    if "ideas" not in tables:
        op.create_table(
            "ideas",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("challenge_id", sa.String(128), sa.ForeignKey("challenges.id"), nullable=False),
            sa.Column("submitted_by", sa.String(128), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("title", sa.String(255), nullable=False),
            sa.Column("description", sa.Text, nullable=False),
            sa.Column("status", sa.String(40), nullable=False, server_default="submitted"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_ideas_challenge_id", "ideas", ["challenge_id"])

    if "projects" not in tables:
        op.create_table(
            "projects",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("idea_id", sa.String(128), sa.ForeignKey("ideas.id"), nullable=False),
            sa.Column("name", sa.String(255), nullable=False),
            sa.Column("description", sa.Text, nullable=True),
            sa.Column("status", sa.String(40), nullable=False, server_default="planned"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_projects_idea_id", "projects", ["idea_id"])

    if "milestones" not in tables:
        op.create_table(
            "milestones",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("project_id", sa.String(128), sa.ForeignKey("projects.id"), nullable=False),
            sa.Column("title", sa.String(255), nullable=False),
            sa.Column("description", sa.Text, nullable=True),
            sa.Column("status", sa.String(40), nullable=False, server_default="pending"),
            sa.Column("due_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_milestones_project_id", "milestones", ["project_id"])

    if "feedback" not in tables:
        op.create_table(
            "feedback",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("project_id", sa.String(128), sa.ForeignKey("projects.id"), nullable=False),
            sa.Column("submitted_by", sa.String(128), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("rating", sa.Integer, nullable=True),
            sa.Column("comments", sa.Text, nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_feedback_project_id", "feedback", ["project_id"])

    if "reports" in tables:
        columns = _columns(bind, "reports")
        additions = [
            ("citizen_id", sa.String(128)),
            ("location_id", sa.String(128)),
            ("duplicate_status", sa.String(40)),
            ("duplicate_of", sa.String(64)),
            ("ai_analysis", sa.Text),
        ]
        for name, column_type in additions:
            if name not in columns:
                op.add_column("reports", sa.Column(name, column_type, nullable=True))
        if bind.dialect.name != "sqlite":
            inspector = inspect(bind)
            existing_fks = {fk.get("constrained_columns", [None])[0] for fk in inspector.get_foreign_keys("reports")}
            if "citizen_id" not in existing_fks:
                op.create_foreign_key("fk_reports_citizen", "reports", "users", ["citizen_id"], ["id"])
            if "location_id" not in existing_fks:
                op.create_foreign_key("fk_reports_location", "reports", "locations", ["location_id"], ["id"])
        op.create_index("ix_reports_citizen_id", "reports", ["citizen_id"], if_not_exists=True)
        op.create_index("ix_reports_duplicate_status", "reports", ["duplicate_status"], if_not_exists=True)


def downgrade() -> None:
    # Existing data must not be removed by this migration.
    pass