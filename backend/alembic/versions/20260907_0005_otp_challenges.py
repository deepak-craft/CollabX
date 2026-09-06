"""Persist OTP challenges for secure verification."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision = "20260907_0005"
down_revision = "20260906_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if "otp_challenges" not in set(inspect(bind).get_table_names()):
        op.create_table(
            "otp_challenges",
            sa.Column("challenge_id", sa.String(64), primary_key=True),
            sa.Column("phone_number", sa.String(20), nullable=False),
            sa.Column("otp_hash", sa.String(256), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("attempts", sa.Integer, nullable=False, server_default="0"),
            sa.Column("is_used", sa.Boolean, nullable=False, server_default=sa.false()),
            sa.Column("user_id", sa.String(128), sa.ForeignKey("users.id"), nullable=False),
        )
        op.create_index("ix_otp_challenges_expires_at", "otp_challenges", ["expires_at"])


def downgrade() -> None:
    pass