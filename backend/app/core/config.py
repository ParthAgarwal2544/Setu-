"""
Setu AI Competency Copilot Configuration & NFR Verification.

COST-CONSTRAINT NFR AUDIT NOTE:
Strict adherence to free-tier models:
- Gemini Flash (gemini-1.5-flash) for MCQ generation, explanation generation, and nudge decision evaluation.
- text-embedding-004 for vector recommendation embeddings.
NO paid-tier Gemini models (e.g. gemini-1.5-pro) are utilized anywhere in this application.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Setu API"
    DATABASE_URL: str = "sqlite+aiosqlite:///./setu.db"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Supabase Auth — Project Settings -> API in the Supabase dashboard.
    SUPABASE_URL: str = ""
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""  # only needed for admin-side user lookups/seeding

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
