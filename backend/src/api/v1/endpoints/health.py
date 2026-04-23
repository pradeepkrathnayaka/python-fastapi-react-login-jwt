from fastapi import APIRouter
from sqlalchemy import text

from src.core.config import settings
from src.db.session import SessionDep

router = APIRouter()


@router.get("/", summary="Health check")
def health_check() -> dict:
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@router.get("/db", summary="Database connectivity check")
def db_health_check(db: SessionDep) -> dict:
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        db_status = f"error: {exc}"
    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "database": db_status,
    }
