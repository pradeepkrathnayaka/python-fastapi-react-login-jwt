from datetime import datetime, timezone
from typing import Any


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def paginate(total: int, skip: int, limit: int) -> dict[str, Any]:
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": (skip + limit) < total,
    }


def sanitize_string(value: str, max_length: int = 255) -> str:
    """Strip leading/trailing whitespace and truncate."""
    return value.strip()[:max_length]
