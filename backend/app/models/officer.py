from sqlalchemy import Column, Integer, String, JSON
from app.core.database import Base

class Officer(Base):
    __tablename__ = "officers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # Links this Officer record to a real Supabase Auth user (auth.users.id, a UUID).
    # Nullable so existing/seed officers can be created before a Supabase account exists.
    supabase_user_id = Column(String, nullable=True, unique=True, index=True)
    email = Column(String, nullable=True, unique=True, index=True)
    full_name = Column(String, nullable=False, default="")
    role = Column(String, nullable=False)
    department = Column(String, nullable=False)
    experience = Column(Integer, nullable=False)
    education = Column(String, nullable=False)
    past_training = Column(JSON, nullable=False)
