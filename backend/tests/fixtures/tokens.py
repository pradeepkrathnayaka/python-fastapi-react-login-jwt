"""Reusable token fixture helpers."""
from datetime import timedelta

from src.core.security import create_access_token, create_refresh_token


def make_access_token(user_id: int, expires_delta: timedelta | None = None) -> str:
    return create_access_token(subject=user_id, expires_delta=expires_delta)


def make_refresh_token(user_id: int, expires_delta: timedelta | None = None) -> str:
    return create_refresh_token(subject=user_id, expires_delta=expires_delta)


def make_expired_access_token(user_id: int) -> str:
    return create_access_token(subject=user_id, expires_delta=timedelta(seconds=-1))


def make_expired_refresh_token(user_id: int) -> str:
    return create_refresh_token(subject=user_id, expires_delta=timedelta(seconds=-1))
