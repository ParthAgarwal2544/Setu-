from sqlalchemy import Column, String, Text, Boolean, DateTime, JSON
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    source = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    embedding = Column(JSON, nullable=True)
    nomination_required = Column(Boolean, nullable=False, default=False)
    schedule_date = Column(DateTime(timezone=True), nullable=True)
