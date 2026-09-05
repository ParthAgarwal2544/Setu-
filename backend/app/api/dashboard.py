from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.auth import require_roles, AuthenticatedUser
from app.services.dashboard_service import get_officer_dashboard, get_admin_dashboard

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/officer/{officer_id}")
async def officer_dashboard(
    officer_id: int,
    db: AsyncSession = Depends(get_db),
    _user: AuthenticatedUser = Depends(require_roles(["Officer", "Trainer", "Admin"])),
):
    """FR7: personal dashboard — profile, open gaps, quiz history, recent nudges."""
    return await get_officer_dashboard(db, officer_id)


@router.get("/admin")
async def admin_dashboard(
    db: AsyncSession = Depends(get_db),
    _user: AuthenticatedUser = Depends(require_roles(["Admin"])),
):
    """FR7: org-wide aggregate view. Admin-role only, enforced server-side."""
    return await get_admin_dashboard(db)
