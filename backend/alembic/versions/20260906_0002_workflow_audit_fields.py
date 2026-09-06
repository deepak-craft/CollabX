"""Add workflow routing, review, and audit fields without dropping data."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260906_0002"
down_revision = "20260906_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    tables = set(inspect(bind).get_table_names())

    if "audit_logs" not in tables:
        op.create_table(
            "audit_logs",
            sa.Column("id", sa.String(128), primary_key=True),
            sa.Column("actor_id", sa.String(128), nullable=False),
            sa.Column("actor_role", sa.String(50), nullable=False),
            sa.Column("action", sa.String(100), nullable=False),
            sa.Column("entity_type", sa.String(50), nullable=False),
            sa.Column("entity_id", sa.String(128), nullable=False),
            sa.Column("details", sa.Text, nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        )
        op.create_index("ix_audit_actor_id", "audit_logs", ["actor_id"])
        op.create_index("ix_audit_action", "audit_logs", ["action"])
        op.create_index("ix_audit_entity", "audit_logs", ["entity_type", "entity_id"])

    if "reports" in tables:
        columns = {column["name"] for column in inspect(bind).get_columns("reports")}
        for name, column_type, default in (
            ("workflow_stage", sa.String(50), "submitted"),
            ("department", sa.String(120), None),
        ):
            if name not in columns:
                op.add_column("reports", sa.Column(name, column_type, nullable=default is None, server_default=default))

    if "ideas" in tables:
        columns = {column["name"] for column in inspect(bind).get_columns("ideas")}
        for name, column_type in (("ai_screening", sa.Text), ("expert_evaluation", sa.Text), ("selected_at", sa.DateTime(timezone=True))):
            if name not in columns:
                op.add_column("ideas", sa.Column(name, column_type, nullable=True))


def downgrade() -> None:
    pass