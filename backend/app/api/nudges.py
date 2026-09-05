from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.database import get_db
from app.models.nudge import Nudge
from app.models.competency import CompetencyGap
from app.models.course import Course
from app.adapters.course_catalog import SeededMockProvider
from app.services.nudge_service import evaluate_officer_nudges

router = APIRouter(prefix="/officers", tags=["Proactive Nudges (FR6)"])
catalog_provider = SeededMockProvider()


class NudgeOut(BaseModel):
    id: int
    officer_id: int
    gap_id: int
    course_id: str
    decision: str
    reason_text: str
    timestamp: str
    course_title: Optional[str] = None
    course_source: Optional[str] = None
    gap_domain: Optional[str] = None
    gap_description: Optional[str] = None


class NudgeRunResponse(BaseModel):
    officer_id: int
    evaluated_count: int
    sent_count: int
    skipped_count: int
    nudges: List[NudgeOut]


@router.get("/{officer_id}/nudges", response_model=List[NudgeOut])
async def get_officer_nudges(
    officer_id: int,
    status: Optional[str] = Query("sent", description="Filter by decision: 'sent', 'skipped', or 'all'"),
    db: AsyncSession = Depends(get_db),
):
    """
    FR6: Retrieve proactive nudges for an officer, filtered by decision ('sent', 'skipped', or 'all').
    Enriched with course and gap details for frontend visualization and explainability audit.
    """
    stmt = select(Nudge).where(Nudge.officer_id == officer_id)
    if status and status.lower() != "all":
        stmt = stmt.where(Nudge.decision == status.lower())

    stmt = stmt.order_by(Nudge.timestamp.desc())
    res = await db.execute(stmt)
    nudges = res.scalars().all()

    # Load catalog lookup
    all_courses = await catalog_provider.get_courses()
    course_map = {c["id"]: c for c in all_courses}

    # Fetch gaps for lookup
    gaps_stmt = select(CompetencyGap).where(CompetencyGap.officer_id == officer_id)
    gaps_res = await db.execute(gaps_stmt)
    gap_map = {g.id: g for g in gaps_res.scalars().all()}

    output = []
    for n in nudges:
        c_info = course_map.get(n.course_id, {})
        g_info = gap_map.get(n.gap_id)

        output.append(
            NudgeOut(
                id=n.id,
                officer_id=n.officer_id,
                gap_id=n.gap_id,
                course_id=n.course_id,
                decision=n.decision,
                reason_text=n.reason_text,
                timestamp=n.timestamp.isoformat() if n.timestamp else datetime.now().isoformat(),
                course_title=c_info.get("title", n.course_id),
                course_source=c_info.get("source", "").upper(),
                gap_domain=g_info.domain if g_info else None,
                gap_description=g_info.description if g_info else None,
            )
        )

    return output


@router.post("/{officer_id}/nudges/run", response_model=NudgeRunResponse)
async def run_proactive_nudge_check(
    officer_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    FR6: Trigger manual on-demand evaluation of proactive nudges for an officer.
    Executes Gemini decision step per open gap & catalog match, persisting both 'sent' and 'skipped' decisions.
    """
    evaluated_results = await evaluate_officer_nudges(db, officer_id)

    sent_count = sum(1 for r in evaluated_results if r.get("decision") == "sent")
    skipped_count = sum(1 for r in evaluated_results if r.get("decision") == "skipped")

    all_courses = await catalog_provider.get_courses()
    course_map = {c["id"]: c for c in all_courses}

    nudges_out = [
        NudgeOut(
            id=r["id"],
            officer_id=r["officer_id"],
            gap_id=r["gap_id"],
            course_id=r["course_id"],
            decision=r["decision"],
            reason_text=r["reason_text"],
            timestamp=datetime.now().isoformat(),
            course_title=r.get("course_title") or course_map.get(r["course_id"], {}).get("title"),
            course_source=(r.get("course_source") or course_map.get(r["course_id"], {}).get("source", "")).upper(),
            gap_domain=r.get("gap_domain"),
        )
        for r in evaluated_results
    ]

    return NudgeRunResponse(
        officer_id=officer_id,
        evaluated_count=len(evaluated_results),
        sent_count=sent_count,
        skipped_count=skipped_count,
        nudges=nudges_out,
    )


@router.get("/{officer_id}/nudges/audit", response_model=List[NudgeOut])
async def get_nudge_audit_log(
    officer_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    FR6 Audit Trail: Retrieve complete audit history of all nudge decisions (both 'sent' and 'skipped')
    for jury defensibility ("why didn't Setu nudge me here?").
    """
    return await get_officer_nudges(officer_id=officer_id, status="all", db=db)
