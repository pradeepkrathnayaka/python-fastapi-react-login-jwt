from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from src.core.exceptions import PermissionDeniedException
from src.db.session import get_db
from src.models.user import User
from src.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# ── Reusable Annotated dependency aliases ─────────────────────────────────────
DbDep = Annotated[Session, Depends(get_db)]


def get_auth_service(db: DbDep) -> AuthService:
    return AuthService(db)


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> User:
    return auth_service.get_current_user_from_token(token)


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user


def get_current_superuser(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_superuser:
        raise PermissionDeniedException()
    return current_user


# Convenient Annotated aliases for use in route signatures
CurrentUserDep = Annotated[User, Depends(get_current_user)]
ActiveUserDep = Annotated[User, Depends(get_current_active_user)]
SuperuserDep = Annotated[User, Depends(get_current_superuser)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
