"""Add is_fallback honesty flag to quiz_questions

Revision ID: b2e4d1a93f18
Revises: a1f3c9d02e77
Create Date: 2026-09-03 12:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b2e4d1a93f18'
down_revision: Union[str, None] = 'a1f3c9d02e77'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("quiz_questions") as batch_op:
        batch_op.add_column(sa.Column("is_fallback", sa.Boolean(), nullable=False, server_default="0"))


def downgrade() -> None:
    with op.batch_alter_table("quiz_questions") as batch_op:
        batch_op.drop_column("is_fallback")
