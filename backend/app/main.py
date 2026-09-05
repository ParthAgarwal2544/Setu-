from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.gaps import router as gaps_router
from app.api.courses import router as courses_router
from app.api.quiz import router as quiz_router
from app.api.nudges import router as nudges_router
from app.api.dashboard import router as dashboard_router
from app.services.nudge_scheduler import start_nudge_scheduler, stop_nudge_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Launch APScheduler background job for FR6 proactive nudges
    start_nudge_scheduler()
    yield
    # Shutdown: Stop APScheduler gracefully
    stop_nudge_scheduler()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    description="Setu AI Competency Copilot Backend API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(gaps_router)
app.include_router(courses_router)
app.include_router(quiz_router)
app.include_router(nudges_router)
app.include_router(dashboard_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}

