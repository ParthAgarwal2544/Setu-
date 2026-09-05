"""
Authentication module for Setu — backed by Supabase Auth.

Replaces the earlier self-issued JWT + in-memory DEMO_USERS_DB approach.
Login itself happens on the frontend via the Supabase client SDK (email/password,
magic link, or OAuth — whatever the frontend enables). This backend never issues
its own tokens; it only VERIFIES the JWT that Supabase already issued, and maps
that verified identity onto a local Officer record.

Setup required (see backend/.env.example):
  SUPABASE_URL              - your project's URL, e.g. https://xxxx.supabase.co
  SUPABASE_JWT_SECRET        - Project Settings -> API -> JWT Secret in the Supabase dashboard

Role assignment: set a `role` field ("Officer" | "Trainer" | "Admin") in the
Supabase user's `user_metadata` (Authentication -> Users -> edit user -> Raw User
Meta Data, in the Supabase dashboard). Officers with no role set default to "Officer".
"""

import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.officer import Officer

logger = logging.getLogger(__name__)

security_bearer = HTTPBearer(auto_error=False)
router = APIRouter(prefix="/auth", tags=["Authentication (Supabase)"])


class AuthenticatedUser(BaseModel):
    supabase_user_id: str
    email: Optional[str] = None
    role: str
    officer_id: Optional[int] = None
    full_name: Optional[str] = None
    department: Optional[str] = None


def _decode_supabase_jwt(token: str) -> dict:
    """
    Verify and decode a Supabase-issued JWT using the project's JWT secret.
    Supabase signs access tokens with HS256 by default.
    """
    if not settings.SUPABASE_JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "SUPABASE_JWT_SECRET is not configured on the backend. "
                "Set it in backend/.env (see .env.example) before authenticated "
                "routes can work."
            ),
        )
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Supabase session token: {e}",
        )


async def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: AsyncSession = Depends(get_db),
) -> AuthenticatedUser:
    """
    FastAPI dependency: verifies the Supabase JWT sent by the frontend and resolves
    it to a local Officer record. No silent "no token = default user" fallback —
    a missing or invalid token is a real 401, not a free pass.
    """
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token. Log in via Supabase on the frontend first.",
        )

    payload = _decode_supabase_jwt(auth.credentials)

    supabase_user_id: str = payload.get("sub", "")
    email: Optional[str] = payload.get("email")
    user_metadata = payload.get("user_metadata", {}) or {}
    role = user_metadata.get("role", "Officer")

    if not supabase_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token did not contain a valid subject (user id).",
        )

    # Resolve to a local Officer record: first by supabase_user_id, then by email
    # (covers the case where an Officer row was seeded before the person's first
    # Supabase login), backfilling the link once found.
    stmt = select(Officer).where(Officer.supabase_user_id == supabase_user_id)
    result = await db.execute(stmt)
    officer = result.scalar_one_or_none()

    if not officer and email:
        stmt2 = select(Officer).where(Officer.email == email)
        result2 = await db.execute(stmt2)
        officer = result2.scalar_one_or_none()
        if officer and not officer.supabase_user_id:
            officer.supabase_user_id = supabase_user_id
            await db.commit()
            await db.refresh(officer)

    return AuthenticatedUser(
        supabase_user_id=supabase_user_id,
        email=email,
        role=role,
        officer_id=officer.id if officer else None,
        full_name=officer.full_name if officer else user_metadata.get("full_name"),
        department=officer.department if officer else None,
    )


def require_roles(allowed_roles: List[str]):
    """FastAPI dependency factory enforcing role-based access control (RBAC)."""

    async def role_checker(current_user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' is not authorized. Allowed: {allowed_roles}.",
            )
        return current_user

    return role_checker


@router.get("/me", response_model=AuthenticatedUser)
async def get_me(current_user: AuthenticatedUser = Depends(get_current_user)):
    """Validate the current Supabase session and return the resolved local identity."""
    return current_user
