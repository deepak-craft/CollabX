"""Persist pilot metrics and citizen feedback fields."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260906_0004"
down_revision = "20260906_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    tables = set(inspect(bind).get_table_names())
    if "projects" in tables:
        columns = {column["name"] for column in inspect(bind).get_columns("projects")}
        if "pilot_metrics_json" not in columns:
            op.add_column("projects", sa.Column("pilot_metrics_json", sa.Text(), nullable=True))
    if "feedback" in tables:
        columns = {column["name"] for column in inspect(bind).get_columns("feedback")}
        for name, column_type in (
            ("solved_status", sa.String(20)),
            ("locality", sa.String(180)),
            ("photo_proof_url", sa.Text()),
        ):
            if name not in columns:
                op.add_column("feedback", sa.Column(name, column_type, nullable=True))


def downgrade() -> None:
    pass