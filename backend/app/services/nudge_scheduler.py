"""
APScheduler Background Job Scheduler for FR6 (Proactive Nudge Agent).

Fulfills PRD FR6 Requirement 1:
An APScheduler job that periodically checks, per officer's open gaps,
whether new/updated catalog content matches and triggers Gemini decision evaluation.
"""

import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.core.database import AsyncSessionLocal
from app.services.nudge_service import evaluate_all_officers_nudges

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def scheduled_nudge_job():
    """
    Periodically executed background job by APScheduler.
    Evaluates open gaps against training catalog for all active officers.
    """
    logger.info("[APScheduler] Triggering periodic Proactive Nudge evaluation job...")
    async with AsyncSessionLocal() as db:
        try:
            results = await evaluate_all_officers_nudges(db)
            sent_count = sum(1 for r in results if r.get("decision") == "sent")
            skipped_count = sum(1 for r in results if r.get("decision") == "skipped")
            logger.info(f"[APScheduler] Nudge evaluation completed: {sent_count} sent, {skipped_count} skipped.")
        except Exception as e:
            logger.error(f"[APScheduler] Nudge job execution error: {e}")


def start_nudge_scheduler():
    """Start the APScheduler background scheduler."""
    if not scheduler.running:
        # Schedule periodic evaluation every 15 minutes
        scheduler.add_job(
            scheduled_nudge_job,
            "interval",
            minutes=15,
            id="proactive_nudge_job",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("[APScheduler] Proactive Nudge Scheduler started successfully.")


def stop_nudge_scheduler():
    """Stop the APScheduler background scheduler gracefully."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("[APScheduler] Proactive Nudge Scheduler shut down gracefully.")
