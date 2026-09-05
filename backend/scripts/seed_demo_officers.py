"""
Seeds the two demo officer personas used throughout the pitch/demo materials —
Priya Sharma (technical-gap persona) and Arjun Mehta (managerial-gap persona) —
replacing the old single generic "Officer A. Sharma" placeholder.

Run this once against your database:  python -m scripts.seed_demo_officers

Each Officer is seeded with an `email` but no `supabase_user_id` yet. The link
happens automatically the first time that person logs in via Supabase: see
app/api/auth.py's get_current_user(), which matches on email and backfills the
supabase_user_id. So: create matching Supabase Auth users (same emails, via the
Supabase dashboard or sign-up flow) with `user_metadata.role` set appropriately,
and the accounts will connect to these seeded profiles on first login.
"""

import asyncio
from sqlalchemy import select

from app.core.database import AsyncSessionLocal, engine, Base
from app.models.officer import Officer
from app.services.scoring import calculate_domain_scores
from app.services.gap_engine import evaluate_officer_gaps
from app.models.competency import CompetencyProfile, CompetencyGap

DEMO_OFFICERS = [
    {
        "id": 1,
        "email": "priya.sharma@setudemo.local",
        "full_name": "Priya Sharma",
        "role": "Senior Statistical Officer",
        "department": "Field Operations Division, NSSO",
        "experience": 3,
        "education": "M.Sc. Statistics",
        "past_training": {
            "specializations": ["Statistical Methods Foundation"],
            "tools": {"r": 55, "stata": 40, "python": 20, "sql": 25, "gis": 10, "pyspark": 5},
            "surveysConducted": ["PLFS"],
            "targetRole": "Deputy Director",
        },
    },
    {
        "id": 2,
        "email": "arjun.mehta@setudemo.local",
        "full_name": "Arjun Mehta",
        "role": "Deputy Director",
        "department": "Price Statistics Division",
        "experience": 8,
        "education": "B.A. Economics, PG Diploma in Applied Statistics",
        "past_training": {
            "specializations": ["Price Index Methodology", "National Accounts"],
            "tools": {"r": 60, "stata": 65, "python": 30, "sql": 35, "gis": 15, "pyspark": 10},
            "surveysConducted": ["CPI", "IIP"],
            "targetRole": "Director",
        },
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        for data in DEMO_OFFICERS:
            existing = await db.execute(select(Officer).where(Officer.id == data["id"]))
            officer = existing.scalar_one_or_none()

            if officer:
                officer.email = data["email"]
                officer.full_name = data["full_name"]
                officer.role = data["role"]
                officer.department = data["department"]
                officer.experience = data["experience"]
                officer.education = data["education"]
                officer.past_training = data["past_training"]
            else:
                officer = Officer(
                    id=data["id"],
                    email=data["email"],
                    full_name=data["full_name"],
                    role=data["role"],
                    department=data["department"],
                    experience=data["experience"],
                    education=data["education"],
                    past_training=data["past_training"],
                )
                db.add(officer)

            await db.flush()

            domain_scores = calculate_domain_scores({
                "role": data["role"],
                "department": data["department"],
                "education": data["education"],
                "experience": data["experience"],
                "past_training": data["past_training"],
            })
            db.add(CompetencyProfile(officer_id=officer.id, domain_scores=domain_scores, version=1))
            await db.flush()

            target_role = data["past_training"].get("targetRole", data["role"])
            gaps = evaluate_officer_gaps(target_role, domain_scores)

            old_gaps = await db.execute(select(CompetencyGap).where(CompetencyGap.officer_id == officer.id))
            for g in old_gaps.scalars().all():
                await db.delete(g)

            for gap_info in gaps:
                db.add(CompetencyGap(
                    officer_id=officer.id,
                    domain=gap_info["domain"],
                    description=gap_info["description"],
                    severity=gap_info["severity"],
                    reason_text=gap_info["reason_text"],
                    status=gap_info["status"],
                ))

            print(f"Seeded {data['full_name']} ({data['email']}) — domain scores: {domain_scores}, gaps: {len(gaps)}")

        await db.commit()

    print("\nDone. Create matching Supabase Auth users with these exact emails to link real logins.")


if __name__ == "__main__":
    asyncio.run(seed())
