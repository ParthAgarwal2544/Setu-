"""Add Supabase identity fields to officers

Revision ID: a1f3c9d02e77
Revises: 65d07c359cdb
Create Date: 2026-09-03 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a1f3c9d02e77'
down_revision: Union[str, None] = '65d07c359cdb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("officers") as batch_op:
        batch_op.add_column(sa.Column("supabase_user_id", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("email", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("full_name", sa.String(), nullable=False, server_default=""))
        batch_op.create_index("ix_officers_supabase_user_id", ["supabase_user_id"], unique=True)
        batch_op.create_index("ix_officers_email", ["email"], unique=True)


def downgrade() -> None:
    with op.batch_alter_table("officers") as batch_op:
        batch_op.drop_index("ix_officers_email")
        batch_op.drop_index("ix_officers_supabase_user_id")
        batch_op.drop_column("full_name")
        batch_op.drop_column("email")
        batch_op.drop_column("supabase_user_id")
