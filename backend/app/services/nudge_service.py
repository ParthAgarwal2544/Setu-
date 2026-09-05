"""
Nudge Service for Setu AI Competency Copilot (FR6: Receive Proactive Nudge).

Fulfills PRD FR6 requirements:
1. Periodically checks officer open competency gaps against training catalog updates.
2. Uses Gemini 1.5 Flash as a decision engine to decide whether to 'sent' or 'skipped', with plain-language reason_text.
3. Persists both 'sent' and 'skipped' decisions to the Nudge database table for auditability and jury defensibility.
4. Prevents unconditional notify loops by suppressing repetitive nudges for the same gap-course pair.
"""

import json
import os
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

import google.generativeai as genai

from app.models.nudge import Nudge
from app.models.officer import Officer
from app.models.competency import CompetencyGap
from app.models.course import Course
from app.adapters.course_catalog import SeededMockProvider

logger = logging.getLogger(__name__)

GEMINI_FLASH_MODEL = "gemini-1.5-flash"
catalog_provider = SeededMockProvider()


def get_api_key() -> Optional[str]:
    """Retrieve Gemini API Key from environment variables."""
    return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")


async def ensure_courses_seeded(db: AsyncSession):
    """
    Ensure all courses from CourseCatalogProvider exist in the database 'courses' table.
    Satisfies Foreign Key constraints for Nudge table records.
    """
    courses_data = await catalog_provider.get_courses()
    for c_data in courses_data:
        c_id = c_data["id"]
        stmt = select(Course).where(Course.id == c_id)
        res = await db.execute(stmt)
        existing = res.scalar_one_or_none()

        if not existing:
            sched_date = None
            if c_data.get("schedule_date"):
                try:
                    sched_date = datetime.fromisoformat(c_data["schedule_date"].replace("Z", "+00:00"))
                except Exception:
                    sched_date = None

            course_db = Course(
                id=c_id,
                source=c_data["source"],
                title=c_data["title"],
                description=c_data["description"],
                embedding=c_data.get("embedding"),
                nomination_required=c_data.get("nomination_required", False),
                schedule_date=sched_date,
            )
            db.add(course_db)

    await db.commit()


async def evaluate_nudge_decision_with_gemini(
    officer_role: str,
    gap_domain: str,
    gap_description: str,
    gap_severity: str,
    gap_reason: str,
    course: Dict[str, Any],
    history_records: List[Dict[str, Any]],
) -> Dict[str, str]:
    """
    Genuine decision step using Gemini 1.5 Flash to decide:
    - decision: "sent" or "skipped"
    - reason_text: Plain-language rationale explaining why this match was sent or skipped.

    Fulfills PRD NFR: Must be able to output 'skipped' as well as 'sent' with a reason_text either way.
    """
    api_key = get_api_key()

    # Pre-check: If course has already been sent for this officer/gap pair, skip to avoid notification spam
    has_been_sent_before = any(r.get("decision") == "sent" for r in history_records)

    if not api_key:
        logger.info("GEMINI_API_KEY not set; using heuristic nudge decision engine.")
        return evaluate_nudge_decision_heuristic(
            gap_domain, gap_severity, course, has_been_sent_before
        )

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(GEMINI_FLASH_MODEL)

        history_summary = "None (first time evaluation)."
        if history_records:
            history_summary = "; ".join([
                f"Previous decision='{r.get('decision')}' at {r.get('timestamp')}: {r.get('reason_text')}"
                for r in history_records[-3:]
            ])

        prompt = f"""
You are Setu AI Nudge Evaluator for the Indian Statistical Service (ISS) competency management system (MoSPI / NSSTA).
Your task is to determine whether to issue a proactive nudge notification to an officer about an available training course matching their open competency gap.

CRITICAL INSTRUCTIONS:
1. You MUST act as a genuine decision step. You can output EITHER "sent" OR "skipped".
2. Do NOT blindly approve every match. If the course was already notified recently, if the match is weak, or if the officer doesn't need urgent notification, output "skipped".
3. Return a clear, audit-defensible "reason_text" for either decision ("why Setu chose to send or skip").

OFFICER CONTEXT:
- Role: {officer_role}

OPEN COMPETENCY GAP:
- Domain: {gap_domain}
- Description: {gap_description}
- Severity: {gap_severity}
- Underlying Reason: {gap_reason}

AVAILABLE COURSE:
- ID: {course.get('id')}
- Source: {course.get('source', '').upper()}
- Title: {course.get('title')}
- Description: {course.get('description')}
- Target Domain: {course.get('domain')}
- Skills Taught: {', '.join(course.get('skills', []))}
- Schedule / Duration: {course.get('schedule_date') or course.get('duration')}

NUDGE HISTORY FOR THIS GAP & COURSE:
{history_summary}

DECISION RULES:
- Output "sent" IF: The course directly targets the officer's open gap domain/skills, the gap severity is MEDIUM or HIGH, and the officer has not already received a 'sent' nudge for this exact course.
- Output "skipped" IF: The course was already sent previously (prevent notification fatigue/spam), OR the domain/skills match is weak, OR gap severity is LOW.

Respond ONLY with valid JSON in this exact structure:
{{
  "decision": "sent" | "skipped",
  "reason_text": "Clear 1-2 sentence justification for auditability."
}}
"""

        response = model.generate_content(prompt)
        resp_text = response.text.strip()

        if resp_text.startswith("```"):
            lines = resp_text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            resp_text = "\n".join(lines).strip()

        parsed = json.loads(resp_text)
        dec = str(parsed.get("decision", "")).lower()

        if dec not in ["sent", "skipped"]:
            dec = "skipped" if has_been_sent_before else ("sent" if dec == "send" else "skipped")

        reason = str(parsed.get("reason_text", "")).strip()
        if not reason:
            reason = f"Decision '{dec}' calculated based on competency domain alignment and nudge history audit."

        return {"decision": dec, "reason_text": reason}

    except Exception as e:
        logger.warning(f"Gemini Flash nudge decision call failed: {e}. Using heuristic decision fallback.")

    return evaluate_nudge_decision_heuristic(gap_domain, gap_severity, course, has_been_sent_before)


def evaluate_nudge_decision_heuristic(
    gap_domain: str,
    gap_severity: str,
    course: Dict[str, Any],
    has_been_sent_before: bool,
) -> Dict[str, str]:
    """
    Deterministic rule-based decision fallback for offline or API-keyless execution.
    Ensures 100% resilient testing and production fallback while preserving auditability.
    """
    course_domain = (course.get("domain") or "").lower()
    course_title = course.get("title", "")
    course_source = (course.get("source") or "").upper()

    # Rule 1: Anti-Spam Defense: If already sent before, output 'skipped'
    if has_been_sent_before:
        return {
            "decision": "skipped",
            "reason_text": f"Skipped: Officer was previously nudged about '{course_title}' ({course_source}) for this gap to prevent notification fatigue."
        }

    # Rule 2: Check domain alignment
    domain_map = {
        "statistical": ["statistical", "sampling", "econometrics"],
        "technical": ["technical", "big data", "python", "r", "sql"],
        "digital_governance": ["digital_governance", "privacy", "gis", "governance"],
        "behavioural": ["behavioural", "leadership", "managerial"],
    }

    allowed_course_domains = domain_map.get(gap_domain.lower(), [gap_domain.lower()])
    domain_match = any(d in course_domain for d in allowed_course_domains) or gap_domain.lower() in course_domain

    if domain_match and gap_severity in ["HIGH", "MEDIUM"]:
        return {
            "decision": "sent",
            "reason_text": f"Sent: New catalog update '{course_title}' from {course_source} directly addresses officer's {gap_severity} severity gap in {gap_domain.replace('_', ' ').title()}."
        }
    elif not domain_match:
        return {
            "decision": "skipped",
            "reason_text": f"Skipped: Course '{course_title}' ({course_domain}) does not align with officer's active gap domain '{gap_domain}'."
        }
    else:
        return {
            "decision": "skipped",
            "reason_text": f"Skipped: Gap severity for '{gap_domain}' is {gap_severity}; immediate proactive notification deferred."
        }


async def evaluate_officer_nudges(db: AsyncSession, officer_id: int) -> List[Dict[str, Any]]:
    """
    Evaluates open gaps for a specific officer against available course catalog,
    applies Gemini decision step, and persists both 'sent' and 'skipped' nudge records.
    """
    await ensure_courses_seeded(db)

    # 1. Fetch Officer
    off_stmt = select(Officer).where(Officer.id == officer_id)
    off_res = await db.execute(off_stmt)
    officer = off_res.scalar_one_or_none()

    if not officer:
        return []

    # 2. Fetch Open Gaps
    gap_stmt = (
        select(CompetencyGap)
        .where(CompetencyGap.officer_id == officer_id)
        .where(CompetencyGap.status == "OPEN")
    )
    gap_res = await db.execute(gap_stmt)
    open_gaps = gap_res.scalars().all()

    if not open_gaps:
        return []

    # 3. Fetch Course Catalog
    all_courses = await catalog_provider.get_courses()

    created_nudges: List[Dict[str, Any]] = []

    for gap in open_gaps:
        for course in all_courses:
            # Check history for (officer_id, gap.id, course["id"])
            hist_stmt = (
                select(Nudge)
                .where(
                    and_(
                        Nudge.officer_id == officer_id,
                        Nudge.gap_id == gap.id,
                        Nudge.course_id == course["id"]
                    )
                )
                .order_by(Nudge.timestamp.asc())
            )
            hist_res = await db.execute(hist_stmt)
            history_models = hist_res.scalars().all()

            history_records = [
                {
                    "decision": h.decision,
                    "reason_text": h.reason_text,
                    "timestamp": h.timestamp.isoformat() if h.timestamp else "",
                }
                for h in history_models
            ]

            # Run decision engine step
            decision_res = await evaluate_nudge_decision_with_gemini(
                officer_role=officer.role,
                gap_domain=gap.domain,
                gap_description=gap.description,
                gap_severity=gap.severity,
                gap_reason=gap.reason_text,
                course=course,
                history_records=history_records,
            )

            decision_str = decision_res["decision"]
            reason_text_str = decision_res["reason_text"]

            # Save Nudge record to database
            nudge_entry = Nudge(
                officer_id=officer_id,
                gap_id=gap.id,
                course_id=course["id"],
                decision=decision_str,
                reason_text=reason_text_str,
            )
            db.add(nudge_entry)
            await db.flush()

            created_nudges.append({
                "id": nudge_entry.id,
                "officer_id": officer_id,
                "gap_id": gap.id,
                "course_id": course["id"],
                "decision": decision_str,
                "reason_text": reason_text_str,
                "course_title": course.get("title"),
                "course_source": course.get("source"),
                "gap_domain": gap.domain,
            })

    await db.commit()
    return created_nudges


async def evaluate_all_officers_nudges(db: AsyncSession) -> List[Dict[str, Any]]:
    """
    Evaluates open gaps for all officers in the system.
    Called by APScheduler background job.
    """
    stmt = select(Officer.id)
    res = await db.execute(stmt)
    officer_ids = res.scalars().all()

    if not officer_ids:
        # Default fallback: check officer 1
        officer_ids = [1]

    total_results = []
    for off_id in officer_ids:
        results = await evaluate_officer_nudges(db, off_id)
        total_results.extend(results)

    return total_results
