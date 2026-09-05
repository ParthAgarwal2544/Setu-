from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.officer import Officer
from app.models.competency import CompetencyProfile, CompetencyGap
from app.services.scoring import calculate_domain_scores
from app.services.gap_engine import evaluate_officer_gaps

router = APIRouter(prefix="/officers", tags=["Profile"])


class ProfilePayload(BaseModel):
    role: str
    department: str
    experience: float
    education: str
    past_training: Any


class CompetencyProfileOut(BaseModel):
    id: int
    officer_id: int
    domain_scores: Dict[str, float]
    version: int
    updated_at: str


class OfficerOut(BaseModel):
    id: int
    role: str
    department: str
    experience: float
    education: str
    past_training: Any


class OfficerProfileResponse(BaseModel):
    officer: OfficerOut
    current_profile: Optional[CompetencyProfileOut]
    history: List[CompetencyProfileOut]


def format_profile_out(profile: CompetencyProfile) -> CompetencyProfileOut:
    return CompetencyProfileOut(
        id=profile.id,
        officer_id=profile.officer_id,
        domain_scores=profile.domain_scores,
        version=profile.version,
        updated_at=profile.updated_at.isoformat() if profile.updated_at else "",
    )


@router.post("/{officer_id}/profile", response_model=OfficerProfileResponse)
async def create_or_update_profile(
    officer_id: int,
    payload: ProfilePayload,
    db: AsyncSession = Depends(get_db),
):
    """
    FR1 + FR2: Create/update officer profile, compute domain scores,
    and AUTO-TRIGGER the deterministic Gap Engine to update CompetencyGaps.
    """
    # 1. Fetch or create Officer record
    stmt = select(Officer).where(Officer.id == officer_id)
    result = await db.execute(stmt)
    officer = result.scalar_one_or_none()

    if not officer:
        officer = Officer(
            id=officer_id,
            role=payload.role,
            department=payload.department,
            experience=int(payload.experience),
            education=payload.education,
            past_training=payload.past_training,
        )
        db.add(officer)
    else:
        officer.role = payload.role
        officer.department = payload.department
        officer.experience = int(payload.experience)
        officer.education = payload.education
        officer.past_training = payload.past_training

    await db.flush()

    # 2. Compute domain scores using rule-based scoring engine
    raw_data = payload.model_dump()
    domain_scores = calculate_domain_scores(raw_data)

    # 3. Determine next version number & insert CompetencyProfile record
    version_stmt = (
        select(CompetencyProfile)
        .where(CompetencyProfile.officer_id == officer_id)
        .order_by(CompetencyProfile.version.desc())
    )
    v_res = await db.execute(version_stmt)
    profiles_list = v_res.scalars().all()
    next_version = (profiles_list[0].version + 1) if profiles_list else 1

    new_profile = CompetencyProfile(
        officer_id=officer_id,
        domain_scores=domain_scores,
        version=next_version,
    )
    db.add(new_profile)
    await db.flush()

    # 4. AUTO-TRIGGER FR2: Detect Skill Gaps
    target_role = payload.role
    if isinstance(payload.past_training, dict) and payload.past_training.get("targetRole"):
        target_role = payload.past_training.get("targetRole")

    detected_gaps = evaluate_officer_gaps(target_role, domain_scores)

    # Clear previous open gaps for this officer to reflect current evaluation
    existing_gaps_stmt = select(CompetencyGap).where(CompetencyGap.officer_id == officer_id)
    e_res = await db.execute(existing_gaps_stmt)
    existing_gaps = e_res.scalars().all()
    for eg in existing_gaps:
        await db.delete(eg)

    # Insert newly detected open gaps
    for gap_info in detected_gaps:
        new_gap = CompetencyGap(
            officer_id=officer_id,
            domain=gap_info["domain"],
            description=gap_info["description"],
            severity=gap_info["severity"],
            reason_text=gap_info["reason_text"],
            status=gap_info["status"],
        )
        db.add(new_gap)

    await db.commit()
    await db.refresh(officer)
    await db.refresh(new_profile)

    # 5. Fetch complete profile history
    all_profiles_stmt = (
        select(CompetencyProfile)
        .where(CompetencyProfile.officer_id == officer_id)
        .order_by(CompetencyProfile.version.desc())
    )
    hist_res = await db.execute(all_profiles_stmt)
    history_list = hist_res.scalars().all()

    formatted_history = [format_profile_out(p) for p in history_list]
    current_prof = formatted_history[0] if formatted_history else None

    return OfficerProfileResponse(
        officer=OfficerOut(
            id=officer.id,
            role=officer.role,
            department=officer.department,
            experience=officer.experience,
            education=officer.education,
            past_training=officer.past_training,
        ),
        current_profile=current_prof,
        history=formatted_history,
    )


@router.get("/{officer_id}/profile", response_model=OfficerProfileResponse)
async def get_officer_profile(
    officer_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    FR1: Retrieve officer details, current domain scores, and score history.
    """
    stmt = select(Officer).where(Officer.id == officer_id)
    result = await db.execute(stmt)
    officer = result.scalar_one_or_none()

    if not officer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Officer with ID {officer_id} not found.",
        )

    all_profiles_stmt = (
        select(CompetencyProfile)
        .where(CompetencyProfile.officer_id == officer_id)
        .order_by(CompetencyProfile.version.desc())
    )
    hist_res = await db.execute(all_profiles_stmt)
    history_list = hist_res.scalars().all()

    formatted_history = [format_profile_out(p) for p in history_list]
    current_prof = formatted_history[0] if formatted_history else None

    return OfficerProfileResponse(
        officer=OfficerOut(
            id=officer.id,
            role=officer.role,
            department=officer.department,
            experience=officer.experience,
            education=officer.education,
            past_training=officer.past_training,
        ),
        current_profile=current_prof,
        history=formatted_history,
    )
