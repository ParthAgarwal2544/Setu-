from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from app.core.database import Base

class Nudge(Base):
    __tablename__ = "nudges"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    officer_id = Column(Integer, ForeignKey("officers.id", ondelete="CASCADE"), nullable=False, index=True)
    gap_id = Column(Integer, ForeignKey("competency_gaps.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    decision = Column(String, nullable=False)
    reason_text = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
