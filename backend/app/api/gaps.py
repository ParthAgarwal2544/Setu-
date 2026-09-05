from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.competency import CompetencyGap

router = APIRouter(prefix="/officers", tags=["Gaps"])


class CompetencyGapOut(BaseModel):
    id: int
    officer_id: int
    domain: str
    description: str
    severity: str
    reason_text: str
    status: str


@router.get("/{officer_id}/gaps", response_model=List[CompetencyGapOut])
async def get_officer_gaps(
    officer_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    FR2: Retrieve ranked list of open competency gaps with explainable reason strings.
    """
    stmt = (
        select(CompetencyGap)
        .where(CompetencyGap.officer_id == officer_id)
        .where(CompetencyGap.status == "OPEN")
    )
    result = await db.execute(stmt)
    gaps = result.scalars().all()

    severity_order = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}
    sorted_gaps = sorted(gaps, key=lambda g: severity_order.get(g.severity, 0), reverse=True)

    return [
        CompetencyGapOut(
            id=g.id,
            officer_id=g.officer_id,
            domain=g.domain,
            description=g.description,
            severity=g.severity,
            reason_text=g.reason_text,
            status=g.status,
        )
        for g in sorted_gaps
    ]
