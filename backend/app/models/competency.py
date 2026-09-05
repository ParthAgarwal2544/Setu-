from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey, func
from app.core.database import Base

class CompetencyProfile(Base):
    __tablename__ = "competency_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    officer_id = Column(Integer, ForeignKey("officers.id", ondelete="CASCADE"), nullable=False, index=True)
    domain_scores = Column(JSON, nullable=False)
    version = Column(Integer, nullable=False, default=1)
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

class CompetencyGap(Base):
    __tablename__ = "competency_gaps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    officer_id = Column(Integer, ForeignKey("officers.id", ondelete="CASCADE"), nullable=False, index=True)
    domain = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, nullable=False)
    reason_text = Column(Text, nullable=False)
    status = Column(String, nullable=False)
