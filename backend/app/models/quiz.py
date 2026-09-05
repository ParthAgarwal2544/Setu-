from sqlalchemy import Column, Integer, String, Text, Float, JSON, ForeignKey, Boolean
from app.core.database import Base

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_material_id = Column(String, nullable=True)
    bloom_level = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)
    correct_answer = Column(Text, nullable=False)
    gap_id = Column(Integer, ForeignKey("competency_gaps.id", ondelete="SET NULL"), nullable=True)
    # Honesty flag: True when Gemini generation failed and this is a generic example
    # question, not one actually derived from the officer's uploaded document.
    is_fallback = Column(Boolean, nullable=False, default=False, server_default="0")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    officer_id = Column(Integer, ForeignKey("officers.id", ondelete="CASCADE"), nullable=False, index=True)
    quiz_id = Column(Integer, nullable=False)
    answers = Column(JSON, nullable=False)
    score = Column(Float, nullable=False)
    difficulty_trace = Column(JSON, nullable=False)
