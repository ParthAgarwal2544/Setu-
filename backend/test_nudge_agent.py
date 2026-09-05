import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import engine, Base

async def run_nudge_agent_test():
    print("--- Initializing test database tables ---")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        print("\n1. Creating Officer profile to initialize open competency gaps...")
        prof_res = await client.post(
            "/officers/1/profile",
            json={
                "role": "Joint Director",
                "department": "Field Operations Division (FOD)",
                "experience": 8,
                "education": "M.Stat, ISI",
                "past_training": {"targetRole": "Director"}
            }
        )
        assert prof_res.status_code == 200, f"Profile error: {prof_res.text}"

        gaps_res = await client.get("/officers/1/gaps")
        assert gaps_res.status_code == 200
        gaps = gaps_res.json()
        print(f"Officer 1 initial open gaps count: {len(gaps)}")
        for g in gaps:
            print(f"  - Gap ID {g['id']}: Domain={g['domain']}, Severity={g['severity']}")

        print("\n2. Executing Proactive Nudge Agent evaluation (`POST /officers/1/nudges/run`)...")
        run_res = await client.post("/officers/1/nudges/run")
        assert run_res.status_code == 200, f"Run error: {run_res.text}"
        run_data = run_res.json()

        print(f"Evaluated candidates count: {run_data['evaluated_count']}")
        print(f"  - Sent nudges: {run_data['sent_count']}")
        print(f"  - Skipped nudges: {run_data['skipped_count']}")
        assert run_data['evaluated_count'] > 0, "No candidates evaluated!"
        assert run_data['sent_count'] > 0, "Expected at least one sent nudge!"
        assert run_data['skipped_count'] > 0, "Expected at least one skipped nudge decision for defensible audit trail!"

        print("\n3. Verifying Sent Nudges via API (`GET /officers/1/nudges?status=sent`)...")
        sent_res = await client.get("/officers/1/nudges?status=sent")
        assert sent_res.status_code == 200
        sent_nudges = sent_res.json()
        print(f"Sent Nudges count: {len(sent_nudges)}")
        for sn in sent_nudges:
            print(f"  [SENT] Nudge ID {sn['id']}: Course='{sn['course_title']}' ({sn['course_source']})")
            print(f"         Gap Domain={sn['gap_domain']}")
            print(f"         Reason={sn['reason_text']}")

        print("\n4. Verifying Audit Trail for Skipped Decisions (`GET /officers/1/nudges/audit`)...")
        audit_res = await client.get("/officers/1/nudges/audit")
        assert audit_res.status_code == 200
        audit_nudges = audit_res.json()
        skipped_nudges = [n for n in audit_nudges if n['decision'] == 'skipped']
        print(f"Audit Log total records: {len(audit_nudges)} ({len(skipped_nudges)} skipped)")
        for sk in skipped_nudges[:3]:
            print(f"  [SKIPPED] Course='{sk['course_title']}' | Reason={sk['reason_text']}")

        print("\n5. Testing Anti-Spam Defense: Executing second evaluation run...")
        run2_res = await client.post("/officers/1/nudges/run")
        assert run2_res.status_code == 200
        run2_data = run2_res.json()
        print(f"Second Run Result: {run2_data['sent_count']} sent, {run2_data['skipped_count']} skipped.")
        # Previously sent items should now be skipped in re-run
        assert run2_data['sent_count'] == 0 or run2_data['skipped_count'] > run_data['skipped_count'], \
            "Re-run should skip previously notified courses to prevent notification spam loops!"

        print("\n--- FR6 PROACTIVE NUDGE AGENT TEST PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    asyncio.run(run_nudge_agent_test())
