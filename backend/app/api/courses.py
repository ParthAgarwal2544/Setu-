from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.adapters.course_catalog import SeededMockProvider
from app.models.competency import CompetencyGap, CompetencyProfile
from app.models.officer import Officer
from app.services.recommendation import rank_courses_for_officer_gaps
from app.services.gap_engine import evaluate_officer_gaps

router = APIRouter(tags=["Courses & Recommendations"])
catalog_provider = SeededMockProvider()


class CourseOut(BaseModel):
    id: str
    source: str
    title: str
    description: str
    nomination_required: bool
    schedule_date: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    domain: Optional[str] = None
    skills: List[str] = []
    relevance_score: Optional[float] = None
    is_gap_match: Optional[bool] = False
    matched_gap_domain: Optional[str] = None
    relevance_reason: Optional[str] = None


class EnrollPayload(BaseModel):
    officer_id: int = 1
    gap_id: Optional[int] = None
    action: Optional[str] = "ENROLL"  # "ENROLL" or "COMPLETE"


class EnrollResponse(BaseModel):
    course_id: str
    officer_id: int
    updated_domain: str
    new_domain_score: float
    closed_gaps: List[str]
    message: str


DOMAIN_MAP = {
    "statistical sampling": "statistical",
    "statistical": "statistical",
    "policy impact analysis": "statistical",
    "survey operations": "statistical",
    "big data & ml tools": "technical",
    "big data & ml": "technical",
    "technical": "technical",
    "digital governance": "digital_governance",
    "digital governance & gis": "digital_governance",
    "geospatial & gis": "digital_governance",
    "behavioural": "behavioural",
    "managerial": "behavioural",
}


@router.get("/courses", response_model=List[CourseOut])
async def list_courses():
    """
    Retrieve full course catalog from CourseCatalogProvider (SeededMockProvider).
    Fulfills PRD Adapter Isolation requirement.
    """
    courses = await catalog_provider.get_courses()
    return [
        CourseOut(
            id=c["id"],
            source=c["source"],
            title=c["title"],
            description=c["description"],
            nomination_required=c["nomination_required"],
            schedule_date=c.get("schedule_date"),
            duration=c.get("duration"),
            location=c.get("location"),
            domain=c.get("domain"),
            skills=c.get("skills", []),
            relevance_reason="Official catalog course available for enrollment.",
        )
        for c in courses
    ]


@router.get("/officers/{officer_id}/recommendations", response_model=List[CourseOut])
async def get_course_recommendations(
    officer_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    FR5: Semantic match between officer open gaps and course catalog,
    ranked by vector relevance score using Gemini text-embeddings.
    """
    stmt = (
        select(CompetencyGap)
        .where(CompetencyGap.officer_id == officer_id)
        .where(CompetencyGap.status == "OPEN")
    )
    result = await db.execute(stmt)
    open_gaps_models = result.scalars().all()

    open_gaps = [
        {
            "domain": g.domain,
            "description": g.description,
            "reason_text": g.reason_text,
            "severity": g.severity,
        }
        for g in open_gaps_models
    ]

    all_courses = await catalog_provider.get_courses()
    ranked_courses = rank_courses_for_officer_gaps(open_gaps, all_courses)

    return [
        CourseOut(
            id=c["id"],
            source=c["source"],
            title=c["title"],
            description=c["description"],
            nomination_required=c["nomination_required"],
            schedule_date=c.get("schedule_date"),
            duration=c.get("duration"),
            location=c.get("location"),
            domain=c.get("domain"),
            skills=c.get("skills", []),
            relevance_score=c.get("relevance_score"),
            is_gap_match=c.get("is_gap_match", False),
            matched_gap_domain=c.get("matched_gap_domain"),
            relevance_reason=c.get("relevance_reason"),
        )
        for c in ranked_courses
    ]


@router.post("/courses/{course_id}/enroll", response_model=EnrollResponse)
async def enroll_course(
    course_id: str,
    payload: EnrollPayload,
    db: AsyncSession = Depends(get_db),
):
    """
    FR7 Action Loop: Record course enrollment (or completion) for an officer and trigger
    a recalculation of that gap's score using Phase 2 Gap Engine logic.
    Updates CompetencyProfile scores and updates/closes CompetencyGap records in setu.db.
    """
    officer_id = payload.officer_id

    # 1. Fetch Officer
    off_stmt = select(Officer).where(Officer.id == officer_id)
    off_res = await db.execute(off_stmt)
    officer = off_res.scalar_one_or_none()

    if not officer:
        officer = Officer(
            id=officer_id,
            role="Joint Director",
            department="Field Operations Division (FOD)",
            experience=8,
            education="M.Stat, Indian Statistical Institute",
            past_training={"targetRole": "Director"},
        )
        db.add(officer)
        await db.flush()

    # 2. Determine target domain for course
    all_courses = await catalog_provider.get_courses()
    target_course = next((c for c in all_courses if c["id"] == course_id), None)

    target_domain = "statistical"
    if target_course and target_course.get("domain"):
        raw_dom = target_course.get("domain", "").lower()
        target_domain = DOMAIN_MAP.get(raw_dom, "statistical")

    if payload.gap_id:
        g_stmt = select(CompetencyGap).where(CompetencyGap.id == payload.gap_id)
        g_res = await db.execute(g_stmt)
        gap_obj = g_res.scalar_one_or_none()
        if gap_obj:
            target_domain = gap_obj.domain

    # 3. ACTION LOOP WRITE-BACK: Update officer domain scores in CompetencyProfile
    prof_stmt = (
        select(CompetencyProfile)
        .where(CompetencyProfile.officer_id == officer_id)
        .order_by(CompetencyProfile.version.desc())
    )
    prof_res = await db.execute(prof_stmt)
    latest_profile = prof_res.scalars().first()

    current_scores = {
        "statistical": 60.0,
        "technical": 55.0,
        "digital_governance": 50.0,
        "behavioural": 65.0,
    }
    current_version = 0

    if latest_profile:
        current_scores = dict(latest_profile.domain_scores)
        current_version = latest_profile.version

    # Course enrollment / completion score boost (Phase 2 Gap Engine action loop)
    score_boost = 15.0 if (payload.action and payload.action.upper() == "COMPLETE") else 12.5
    old_score = current_scores.get(target_domain, 60.0)
    new_score = round(min(100.0, old_score + score_boost), 1)
    current_scores[target_domain] = new_score

    # Insert new profile version record
    new_profile = CompetencyProfile(
        officer_id=officer_id,
        domain_scores=current_scores,
        version=current_version + 1,
    )
    db.add(new_profile)
    await db.flush()

    # 4. ACTION LOOP WRITE-BACK: Re-evaluate gaps with Phase 2 Gap Engine
    target_role = officer.role
    if isinstance(officer.past_training, dict) and officer.past_training.get("targetRole"):
        target_role = officer.past_training.get("targetRole")

    newly_evaluated = evaluate_officer_gaps(target_role, current_scores)
    new_gap_map = {g["domain"]: g for g in newly_evaluated}

    exist_g_stmt = select(CompetencyGap).where(CompetencyGap.officer_id == officer_id)
    exist_g_res = await db.execute(exist_g_stmt)
    existing_gaps = exist_g_res.scalars().all()

    closed_gaps = []

    for eg in existing_gaps:
        if eg.domain in new_gap_map:
            info = new_gap_map[eg.domain]
            eg.severity = info["severity"]
            eg.reason_text = info["reason_text"]
            eg.status = "OPEN"
        else:
            if eg.status != "CLOSED":
                eg.status = "CLOSED"
                closed_gaps.append(eg.domain)

    await db.commit()

    course_title = target_course["title"] if target_course else course_id
    msg = f"Enrolled in '{course_title}'. {target_domain.replace('_', ' ').title()} score increased from {old_score}% to {new_score}%."
    if closed_gaps:
        msg += f" Competency Gaps closed: {', '.join(closed_gaps)}."

    return EnrollResponse(
        course_id=course_id,
        officer_id=officer_id,
        updated_domain=target_domain,
        new_domain_score=new_score,
        closed_gaps=closed_gaps,
        message=msg,
    )
