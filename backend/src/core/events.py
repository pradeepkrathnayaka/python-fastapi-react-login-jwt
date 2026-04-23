import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.core.logging import setup_logging

logger = logging.getLogger("app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────────────────────────────
    setup_logging()
    logger.info("Application starting up...")

    from src.db.session import SessionLocal
    from src.db.init_db import init_db

    db = SessionLocal()
    try:
        init_db(db)
        logger.info("Database initialized successfully")
    except Exception as exc:
        logger.error("Database initialization failed: %s", exc)
    finally:
        db.close()

    yield  # ← application runs here

    # ── Shutdown ─────────────────────────────────────────────────
    logger.info("Application shutting down...")
