"""
Dashboard aggregation service — fulfills FR7.

Two distinct views, deliberately different shapes:
- Officer dashboard: one person's own profile, gaps, quiz history, active recommendations.
- Admin dashboard: an aggregate, organization-wide view. Intentionally NOT predictive —
  it reports what IS, not a forecast of what will be (that's an explicit roadmap item,
  not something to fake here).
"""

from typing import Dict, Any, List
from collections import defaultdict

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.officer import Officer
from app.models.competency import CompetencyProfile, CompetencyGap
from app.models.quiz import QuizAttempt
from app.models.nudge import Nudge


async def get_officer_dashboard(db: AsyncSession, officer_id: int) -> Dict[str, Any]:
    officer_res = await db.execute(select(Officer).where(Officer.id == officer_id))
    officer = officer_res.scalar_one_or_none()
    if not officer:
        return {}

    profile_res = await db.execute(
        select(CompetencyProfile)
        .where(CompetencyProfile.officer_id == officer_id)
        .order_by(CompetencyProfile.version.desc())
    )
    profiles = profile_res.scalars().all()
    current_scores = profiles[0].domain_scores if profiles else {}

    gaps_res = await db.execute(
        select(CompetencyGap)
        .where(CompetencyGap.officer_id == officer_id, CompetencyGap.status == "OPEN")
    )
    open_gaps = gaps_res.scalars().all()

    attempts_res = await db.execute(
        select(QuizAttempt)
        .where(QuizAttempt.officer_id == officer_id)
        .order_by(QuizAttempt.id.desc())
        .limit(10)
    )
    recent_attempts = attempts_res.scalars().all()

    nudges_res = await db.execute(
        select(Nudge)
        .where(Nudge.officer_id == officer_id, Nudge.decision == "sent")
        .order_by(Nudge.timestamp.desc())
        .limit(10)
    )
    recent_nudges = nudges_res.scalars().all()

    return {
        "officer": {
            "id": officer.id,
            "full_name": officer.full_name,
            "role": officer.role,
            "department": officer.department,
        },
        "current_domain_scores": current_scores,
        "score_history": [
            {"version": p.version, "domain_scores": p.domain_scores, "updated_at": p.updated_at.isoformat() if p.updated_at else ""}
            for p in reversed(profiles)
        ],
        "open_gaps": [
            {"id": g.id, "domain": g.domain, "severity": g.severity, "reason_text": g.reason_text}
            for g in open_gaps
        ],
        "recent_quiz_attempts": [
            {"id": a.id, "quiz_id": a.quiz_id, "score": a.score} for a in recent_attempts
        ],
        "recent_nudges": [
            {"id": n.id, "course_id": n.course_id, "reason_text": n.reason_text, "timestamp": n.timestamp.isoformat() if n.timestamp else ""}
            for n in recent_nudges
        ],
    }


async def get_admin_dashboard(db: AsyncSession) -> Dict[str, Any]:
    """
    Organization-wide aggregate. Every number here is a direct count/average over
    real rows in the database — nothing projected or predicted.
    """
    officers_res = await db.execute(select(Officer))
    officers = officers_res.scalars().all()
    total_officers = len(officers)

    # Latest CompetencyProfile per officer, for domain-score averaging
    domain_totals: Dict[str, float] = defaultdict(float)
    domain_counts: Dict[str, int] = defaultdict(int)

    for officer in officers:
        profile_res = await db.execute(
            select(CompetencyProfile)
            .where(CompetencyProfile.officer_id == officer.id)
            .order_by(CompetencyProfile.version.desc())
            .limit(1)
        )
        latest = profile_res.scalar_one_or_none()
        if latest and latest.domain_scores:
            for domain, score in latest.domain_scores.items():
                domain_totals[domain] += score
                domain_counts[domain] += 1

    avg_domain_scores = {
        domain: round(domain_totals[domain] / domain_counts[domain], 1)
        for domain in domain_totals
        if domain_counts[domain] > 0
    }

    # Gap density: open gap count by domain, and by severity
    gaps_res = await db.execute(select(CompetencyGap).where(CompetencyGap.status == "OPEN"))
    open_gaps = gaps_res.scalars().all()

    gaps_by_domain: Dict[str, int] = defaultdict(int)
    gaps_by_severity: Dict[str, int] = defaultdict(int)
    for g in open_gaps:
        gaps_by_domain[g.domain] += 1
        gaps_by_severity[g.severity] += 1

    # Gap density by department — this is the "org can see where the real weak spots
    # are" view that a static per-officer dashboard can't give you.
    dept_gap_counts: Dict[str, int] = defaultdict(int)
    officer_dept_map = {o.id: o.department for o in officers}
    for g in open_gaps:
        dept = officer_dept_map.get(g.officer_id, "Unknown")
        dept_gap_counts[dept] += 1

    # Nudge activity summary — sent vs skipped, a cheap proxy for "is the agent doing anything"
    nudges_res = await db.execute(select(Nudge.decision, func.count(Nudge.id)).group_by(Nudge.decision))
    nudge_counts = {row[0]: row[1] for row in nudges_res.all()}

    return {
        "total_officers": total_officers,
        "avg_domain_scores": avg_domain_scores,
        "open_gaps_by_domain": dict(gaps_by_domain),
        "open_gaps_by_severity": dict(gaps_by_severity),
        "open_gaps_by_department": dict(dept_gap_counts),
        "nudge_activity": {
            "sent": nudge_counts.get("sent", 0),
            "skipped": nudge_counts.get("skipped", 0),
        },
        "note": "Aggregate snapshot of current data only — not a predictive forecast.",
    }
