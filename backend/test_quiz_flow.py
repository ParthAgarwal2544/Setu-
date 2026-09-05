import asyncio
import io
import os
import time
import fitz
from jose import jwt
from httpx import AsyncClient, ASGITransport

os.environ["SUPABASE_JWT_SECRET"] = "test-secret-for-local-hardening-suite-only"

from app.main import app
from app.core.database import engine, Base


def _trainer_token() -> str:
    payload = {
        "sub": "00000000-0000-0000-0000-000000000002",
        "email": "trainer.test@setudemo.local",
        "aud": "authenticated",
        "role": "authenticated",
        "user_metadata": {"role": "Trainer"},
        "exp": int(time.time()) + 3600,
    }
    return jwt.encode(payload, os.environ["SUPABASE_JWT_SECRET"], algorithm="HS256")

async def run_tests():
    print("--- Initializing test database tables ---")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        print("\n1. Testing Profile & Gap creation (Phase 1 & 2 baseline)...")
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
        print("Profile created successfully.")

        gaps_res = await client.get("/officers/1/gaps")
        assert gaps_res.status_code == 200
        gaps = gaps_res.json()
        print(f"Detected gaps count: {len(gaps)}")
        for g in gaps:
            print(f"  - Gap ID {g['id']}: Domain={g['domain']}, Severity={g['severity']}")

        print("\n2. Testing FR3: Document upload and quiz generation (`POST /quiz/generate`)...")
        # Generate a synthetic PDF in memory using fitz
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((50, 50), "MoSPI Survey Methodology & Stratified Sampling Training Material.\n"
                                  "Topics cover non-response weighting, PySpark microdata engineering, "
                                  "and Differential Privacy guarantees.")
        pdf_bytes = doc.write()
        doc.close()

        files = {
            "file": ("mospi_training.pdf", pdf_bytes, "application/pdf")
        }
        data = {
            "officer_id": "1",
            "num_questions": "3"
        }

        gen_res = await client.post("/quiz/generate", files=files, data=data, headers={"Authorization": f"Bearer {_trainer_token()}"})
        assert gen_res.status_code == 200, f"Generate quiz error: {gen_res.text}"
        gen_data = gen_res.json()
        print(f"Quiz generated: {gen_data['question_count']} questions generated from {gen_data['source_material_id']}")

        questions = gen_data["questions"]
        assert len(questions) > 0, "No questions returned!"
        first_q = questions[0]
        print(f"Sample Generated Question ID {first_q['id']}:")
        print(f"  - Text: {first_q['question_text'][:80]}...")
        print(f"  - Bloom Taxonomy Level: {first_q['bloom_level']}")
        print(f"  - Initial Difficulty: {first_q['difficulty']}")
        print(f"  - Linked Gap ID: {first_q['gap_id']}")
        print(f"  - Options count: {len(first_q['options'])}")

        print("\n3. Testing FR4: Per-answer explanation (`POST /quiz/explain`)...")
        explain_res = await client.post(
            "/quiz/explain",
            json={
                "question_id": first_q["id"],
                "selected_option": "B",
                "officer_id": 1
            }
        )
        assert explain_res.status_code == 200, f"Explain error: {explain_res.text}"
        exp_data = explain_res.json()
        print(f"Explanation: {exp_data['explanation']}")
        print(f"Is Correct: {exp_data['is_correct']}, Correct Answer: {exp_data['correct_answer']}")

        print("\n4. Testing FR4: Quiz Attempt & Action Loop Write-Back (`POST /quiz/1/attempt`)...")
        attempt_answers = {
            str(q["id"]): q["correct_answer"] for q in questions
        }

        attempt_res = await client.post(
            "/quiz/1/attempt",
            json={
                "officer_id": 1,
                "quiz_id": 1,
                "answers": attempt_answers
            }
        )
        assert attempt_res.status_code == 200, f"Attempt error: {attempt_res.text}"
        att_data = attempt_res.json()
        print(f"Quiz Attempt Score: {att_data['score']}% ({att_data['correct_count']}/{att_data['total_questions']})")
        print(f"Difficulty Trace (Running Average Heuristic): {att_data['difficulty_trace']}")
        print(f"Updated Domain Scores: {att_data['updated_domain_scores']}")
        print(f"Closed Gaps: {att_data['closed_gaps']}")

        print("\n5. Verifying dashboard state after Action Loop write-back...")
        updated_gaps_res = await client.get("/officers/1/gaps")
        updated_gaps = updated_gaps_res.json()
        print(f"Remaining open gaps after quiz completion: {len(updated_gaps)}")

        print("\n--- ALL BACKEND FR3 & FR4 VERIFICATION TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    asyncio.run(run_tests())
