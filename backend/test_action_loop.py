import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import engine, Base

async def run_action_loop_test():
    print("--- Initializing test database tables ---")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        print("\n1. Creating baseline Officer profile and evaluating initial gaps...")
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
        assert prof_res.status_code == 200

        initial_gaps_res = await client.get("/officers/1/gaps")
        assert initial_gaps_res.status_code == 200
        initial_gaps = initial_gaps_res.json()
        print(f"Initial open gaps count: {len(initial_gaps)}")
        for g in initial_gaps:
            print(f"  - Gap ID {g['id']}: Domain={g['domain']}, Severity={g['severity']}, Reason={g['reason_text']}")

        print("\n2. Executing Action Loop: Enrolling in recommended course (`POST /courses/igot-stat-101/enroll`)...")
        enroll_res = await client.post(
            "/courses/igot-stat-101/enroll",
            json={
                "officer_id": 1,
                "gap_id": initial_gaps[0]["id"] if initial_gaps else None,
                "action": "ENROLL"
            }
        )
        assert enroll_res.status_code == 200, f"Enroll error: {enroll_res.text}"
        enroll_data = enroll_res.json()
        print(f"Enroll Response: {enroll_data['message']}")
        print(f"Updated Domain '{enroll_data['updated_domain']}' Score: {enroll_data['new_domain_score']}%")

        print("\n3. Verifying updated gap list on Dashboard after Action Loop execution...")
        updated_gaps_res = await client.get("/officers/1/gaps")
        assert updated_gaps_res.status_code == 200
        updated_gaps = updated_gaps_res.json()
        print(f"Updated open gaps count: {len(updated_gaps)}")
        for g in updated_gaps:
            print(f"  - Gap ID {g['id']}: Domain={g['domain']}, Severity={g['severity']}, Reason={g['reason_text']}")

        print("\n4. Executing second enrollment / completion for same gap domain...")
        complete_res = await client.post(
            "/courses/nssta-sam-201/enroll",
            json={
                "officer_id": 1,
                "action": "COMPLETE"
            }
        )
        assert complete_res.status_code == 200
        comp_data = complete_res.json()
        print(f"Completion Response: {comp_data['message']}")
        print(f"Updated Domain '{comp_data['updated_domain']}' Score: {comp_data['new_domain_score']}%")

        final_gaps_res = await client.get("/officers/1/gaps")
        final_gaps = final_gaps_res.json()
        print(f"Final open gaps count after completion: {len(final_gaps)}")
        if comp_data["closed_gaps"]:
            print(f"CLOSED GAPS: {comp_data['closed_gaps']}")

        print("\n--- ACTION LOOP END-TO-END TEST PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    asyncio.run(run_action_loop_test())
