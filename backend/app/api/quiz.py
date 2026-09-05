import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.quiz import QuizQuestion, QuizAttempt
from app.models.competency import CompetencyGap, CompetencyProfile
from app.models.officer import Officer
from app.services.content_extractor import extract_and_chunk_content
from app.services.quiz_generator import generate_mcqs_with_gemini, generate_explanation_with_gemini
from app.services.gap_engine import evaluate_officer_gaps

from app.api.auth import require_roles

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/quiz", tags=["Adaptive Quiz Engine"])


# --- Pydantic Schemas ---

class OptionSchema(BaseModel):
    id: str
    label: str
    text: str


class QuizQuestionOut(BaseModel):
    id: int
    source_material_id: Optional[str]
    bloom_level: str
    difficulty: str
    question_text: str
    options: List[OptionSchema]
    correct_answer: str
    gap_id: Optional[int]
    is_fallback: bool = False


class GenerateQuizResponse(BaseModel):
    source_material_id: str
    chunk_count: int
    question_count: int
    questions: List[QuizQuestionOut]
    is_fallback: bool = False
    fallback_notice: Optional[str] = None


class ExplainRequest(BaseModel):
    question_id: int
    selected_option: str
    officer_id: Optional[int] = 1


class ExplainResponse(BaseModel):
    question_id: int
    selected_option: str
    correct_answer: str
    is_correct: bool
    explanation: str
    bloom_level: str
    gap_addressed: str


class QuizAttemptPayload(BaseModel):
    officer_id: int
    quiz_id: int = 1
    answers: Dict[int, str]  # question_id -> selected option_id ("A", "B", "C", "D")
    difficulty_trace: Optional[List[Dict[str, Any]]] = None


class QuizAttemptResponse(BaseModel):
    attempt_id: int
    officer_id: int
    score: float
    correct_count: int
    total_questions: int
    difficulty_trace: List[Dict[str, Any]]
    updated_domain_scores: Dict[str, float]
    closed_gaps: List[str]
    message: str


# --- Endpoints ---

@router.post("/generate", response_model=GenerateQuizResponse)
async def generate_quiz(
    file: UploadFile = File(...),
    officer_id: Optional[int] = Form(None),
    gap_id: Optional[int] = Form(None),
    num_questions: int = Form(5),
    db: AsyncSession = Depends(get_db),
    _user=Depends(require_roles(["Trainer", "Admin", "Officer"])),
):
    """
    FR3: Generate Adaptive Quiz from uploaded document (PDF, PPT) or video/transcript.
    Chunks content, calls Gemini Flash to generate MCQs tagged with Bloom's taxonomy levels
    and linked to specific Phase 2 CompetencyGap records.
    """
    file_bytes = await file.read()
    filename = file.filename or "uploaded_document"
    content_type = file.content_type

    # 1. Content Extraction & Chunking
    extraction_result = await extract_and_chunk_content(file_bytes, filename, content_type)
    chunks = extraction_result["chunks"]

    # 2. Retrieve open officer gaps to link questions to Phase 2 gap_ids
    gap_info_list = []
    if gap_id:
        g_stmt = select(CompetencyGap).where(CompetencyGap.id == gap_id)
        g_res = await db.execute(g_stmt)
        gap_obj = g_res.scalar_one_or_none()
        if gap_obj:
            gap_info_list.append({
                "id": gap_obj.id,
                "domain": gap_obj.domain,
                "description": gap_obj.description,
            })
    elif officer_id:
        g_stmt = select(CompetencyGap).where(
            CompetencyGap.officer_id == officer_id,
            CompetencyGap.status == "OPEN"
        )
        g_res = await db.execute(g_stmt)
        gaps = g_res.scalars().all()
        for g in gaps:
            gap_info_list.append({
                "id": g.id,
                "domain": g.domain,
                "description": g.description,
            })

    # 3. Call Gemini Flash (or fallback heuristic) to generate MCQs
    generated_raw_questions = await generate_mcqs_with_gemini(
        content_chunks=chunks,
        num_questions=num_questions,
        gap_info_list=gap_info_list,
        filename=filename,
    )

    # 4. Save generated questions to DB
    saved_questions: List[QuizQuestion] = []
    source_mat_id = f"{filename}_{file.size or 0}"

    for raw_q in generated_raw_questions:
        q_options = raw_q.get("options", [])
        if isinstance(q_options, list) and q_options and isinstance(q_options[0], str):
            # Standardize string options into dict objects
            labels = ["A", "B", "C", "D"]
            q_options = [
                {"id": labels[i], "label": labels[i], "text": opt_str}
                for i, opt_str in enumerate(q_options[:4])
            ]

        # Ensure bloom_level and gap_id are attached per FR3 acceptance criteria
        bloom_lvl = raw_q.get("bloom_level", "Apply")
        diff_lvl = raw_q.get("difficulty", "Intermediate")
        q_gap_id = raw_q.get("gap_id")

        if not q_gap_id and gap_info_list:
            q_gap_id = gap_info_list[0]["id"]

        question_obj = QuizQuestion(
            source_material_id=source_mat_id,
            bloom_level=bloom_lvl,
            difficulty=diff_lvl,
            question_text=raw_q.get("question_text", "Sample Statistical Question"),
            options=q_options,
            correct_answer=raw_q.get("correct_answer", "A"),
            gap_id=q_gap_id,
            is_fallback=bool(raw_q.get("is_fallback", False)),
        )
        db.add(question_obj)
        saved_questions.append(question_obj)

    await db.commit()
    for q in saved_questions:
        await db.refresh(q)

    out_questions = [
        QuizQuestionOut(
            id=q.id,
            source_material_id=q.source_material_id,
            bloom_level=q.bloom_level,
            difficulty=q.difficulty,
            question_text=q.question_text,
            options=[OptionSchema(**opt) for opt in (q.options or [])],
            correct_answer=q.correct_answer,
            gap_id=q.gap_id,
            is_fallback=q.is_fallback,
        )
        for q in saved_questions
    ]

    batch_is_fallback = any(q.is_fallback for q in saved_questions)

    return GenerateQuizResponse(
        source_material_id=source_mat_id,
        chunk_count=extraction_result["chunk_count"],
        question_count=len(out_questions),
        questions=out_questions,
        is_fallback=batch_is_fallback,
        fallback_notice=(
            "AI generation was temporarily unavailable, so these are example "
            "questions rather than ones generated from your uploaded document. "
            "Try again in a moment for document-specific questions."
        ) if batch_is_fallback else None,
    )


@router.get("/questions", response_model=List[QuizQuestionOut])
async def get_questions(
    officer_id: Optional[int] = None,
    source_material_id: Optional[str] = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve list of generated quiz questions."""
    stmt = select(QuizQuestion)
    if source_material_id:
        stmt = stmt.where(QuizQuestion.source_material_id == source_material_id)
    stmt = stmt.order_by(QuizQuestion.id.desc()).limit(limit)

    result = await db.execute(stmt)
    questions = result.scalars().all()

    return [
        QuizQuestionOut(
            id=q.id,
            source_material_id=q.source_material_id,
            bloom_level=q.bloom_level,
            difficulty=q.difficulty,
            question_text=q.question_text,
            options=[OptionSchema(**opt) for opt in (q.options or [])],
            correct_answer=q.correct_answer,
            gap_id=q.gap_id,
            is_fallback=q.is_fallback,
        )
        for q in questions
    ]


@router.post("/explain", response_model=ExplainResponse)
async def explain_answer(
    payload: ExplainRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    FR4: Get plain-language statistical explanation for an answered question via Gemini Flash.
    """
    stmt = select(QuizQuestion).where(QuizQuestion.id == payload.question_id)
    result = await db.execute(stmt)
    question = result.scalar_one_or_none()

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with ID {payload.question_id} not found."
        )

    correct_ans = question.correct_answer.strip().upper()
    selected_ans = payload.selected_option.strip().upper()
    is_correct = (correct_ans == selected_ans)

    gap_desc = ""
    if question.gap_id:
        g_stmt = select(CompetencyGap).where(CompetencyGap.id == question.gap_id)
        g_res = await db.execute(g_stmt)
        gap_obj = g_res.scalar_one_or_none()
        if gap_obj:
            gap_desc = gap_obj.description

    explanation_text = await generate_explanation_with_gemini(
        question_text=question.question_text,
        options=question.options or [],
        correct_answer=correct_ans,
        selected_answer=selected_ans,
        gap_description=gap_desc,
    )

    return ExplainResponse(
        question_id=question.id,
        selected_option=selected_ans,
        correct_answer=correct_ans,
        is_correct=is_correct,
        explanation=explanation_text,
        bloom_level=question.bloom_level,
        gap_addressed=gap_desc or "Statistical Sampling & Methodology",
    )


@router.post("/{quiz_id}/attempt", response_model=QuizAttemptResponse)
async def submit_quiz_attempt(
    quiz_id: int,
    payload: QuizAttemptPayload,
    db: AsyncSession = Depends(get_db),
):
    """
    FR4: Submit quiz attempt, apply deterministic running-average difficulty heuristic,
    and WRITE BACK updated scores to Phase 2 CompetencyGap records (Action Loop).
    """
    officer_id = payload.officer_id

    # 1. Fetch Officer
    off_stmt = select(Officer).where(Officer.id == officer_id)
    off_res = await db.execute(off_stmt)
    officer = off_res.scalar_one_or_none()

    if not officer:
        # Create default officer record if missing
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

    # 2. Evaluate answers & compute deterministic running-average difficulty trace (PRD NFR Compliance)
    question_ids = list(payload.answers.keys())
    q_stmt = select(QuizQuestion).where(QuizQuestion.id.in_(question_ids)) if question_ids else select(QuizQuestion).limit(10)
    q_res = await db.execute(q_stmt)
    questions_list = q_res.scalars().all()
    q_map = {q.id: q for q in questions_list}

    correct_count = 0
    total_questions = len(payload.answers) if payload.answers else len(questions_list)
    if total_questions == 0:
        total_questions = 1

    computed_trace = []
    attempted_domains = set()

    for idx, (q_id_str, selected_opt) in enumerate(payload.answers.items()):
        q_id = int(q_id_str)
        q_obj = q_map.get(q_id)
        
        is_corr = False
        if q_obj:
            is_corr = (q_obj.correct_answer.strip().upper() == selected_opt.strip().upper())
            # Attempted domain tracking
            if q_obj.gap_id:
                g_stmt = select(CompetencyGap).where(CompetencyGap.id == q_obj.gap_id)
                g_res = await db.execute(g_stmt)
                g_obj = g_res.scalar_one_or_none()
                if g_obj:
                    attempted_domains.add(g_obj.domain)

        if is_corr:
            correct_count += 1

        # Deterministic running-average heuristic: running_avg = correct_so_far / count_so_far
        running_avg = correct_count / (idx + 1)
        if running_avg >= 0.75:
            current_difficulty = "Advanced"
        elif running_avg >= 0.40:
            current_difficulty = "Intermediate"
        else:
            current_difficulty = "Basic"

        computed_trace.append({
            "step": idx + 1,
            "question_id": q_id,
            "selected_option": selected_opt,
            "is_correct": is_corr,
            "running_avg": round(running_avg, 2),
            "difficulty": current_difficulty,
        })

    if not attempted_domains:
        attempted_domains.add("statistical")

    score_pct = round((correct_count / total_questions) * 100, 1)

    # Save QuizAttempt record
    attempt_record = QuizAttempt(
        officer_id=officer_id,
        quiz_id=quiz_id,
        answers=payload.answers,
        score=score_pct,
        difficulty_trace=computed_trace,
    )
    db.add(attempt_record)
    await db.flush()

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

    # Weight score update: 80% current score + 20% quiz performance score
    for dom in attempted_domains:
        old_val = current_scores.get(dom, 60.0)
        updated_val = round(min(100.0, (old_val * 0.8) + (score_pct * 0.2)), 1)
        current_scores[dom] = updated_val

    # Create new profile version record
    new_profile = CompetencyProfile(
        officer_id=officer_id,
        domain_scores=current_scores,
        version=current_version + 1,
    )
    db.add(new_profile)
    await db.flush()

    # 4. ACTION LOOP WRITE-BACK: Re-evaluate officer gaps and update CompetencyGap DB table
    target_role = officer.role
    if isinstance(officer.past_training, dict) and officer.past_training.get("targetRole"):
        target_role = officer.past_training.get("targetRole")

    newly_evaluated_gaps = evaluate_officer_gaps(target_role, current_scores)
    new_gap_domains = {g["domain"]: g for g in newly_evaluated_gaps}

    # Fetch existing open gaps
    exist_g_stmt = select(CompetencyGap).where(CompetencyGap.officer_id == officer_id)
    exist_g_res = await db.execute(exist_g_stmt)
    existing_gaps = exist_g_res.scalars().all()

    closed_gaps = []

    for eg in existing_gaps:
        if eg.domain in new_gap_domains:
            # Gap remains open; update severity & reason text
            info = new_gap_domains[eg.domain]
            eg.severity = info["severity"]
            eg.reason_text = info["reason_text"]
            eg.status = "OPEN"
        else:
            # Gap is resolved/closed by score increase!
            if eg.status != "CLOSED":
                eg.status = "CLOSED"
                closed_gaps.append(eg.domain)

    await db.commit()
    await db.refresh(attempt_record)

    msg = f"Quiz attempt recorded. Score: {score_pct}%. Competency score updated across domains."
    if closed_gaps:
        msg += f" Closed gaps: {', '.join(closed_gaps)}."

    return QuizAttemptResponse(
        attempt_id=attempt_record.id,
        officer_id=officer_id,
        score=score_pct,
        correct_count=correct_count,
        total_questions=total_questions,
        difficulty_trace=computed_trace,
        updated_domain_scores=current_scores,
        closed_gaps=closed_gaps,
        message=msg,
    )
