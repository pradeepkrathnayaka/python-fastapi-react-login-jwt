import logging

import jwt
from sqlalchemy.orm import Session

from src.core.exceptions import (
    BadRequestException,
    CredentialsException,
    TokenExpiredException,
)
from src.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from src.models.user import User
from src.repositories.user_repository import UserRepository
from src.schemas.auth import LoginRequest
from src.schemas.token import Token

logger = logging.getLogger("app")


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)

    def _authenticate(self, identifier: str, password: str) -> User | None:
        user = self.user_repo.get_by_username(identifier) or self.user_repo.get_by_email(identifier)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def login(self, login_data: LoginRequest) -> Token:
        user = self._authenticate(login_data.username, login_data.password)
        if not user:
            raise CredentialsException("Incorrect username or password")
        if not user.is_active:
            raise BadRequestException("Inactive user account")
        logger.info("User %s logged in", user.username)
        return Token(
            access_token=create_access_token(subject=user.id),
            refresh_token=create_refresh_token(subject=user.id),
        )

    def refresh_tokens(self, refresh_token: str) -> Token:
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                raise CredentialsException("Invalid token type")
            user_id = payload.get("sub")
            if user_id is None:
                raise CredentialsException()
        except jwt.ExpiredSignatureError:
            raise TokenExpiredException()
        except jwt.InvalidTokenError:
            raise CredentialsException()

        user = self.user_repo.get(int(user_id))
        if not user or not user.is_active:
            raise CredentialsException()

        return Token(
            access_token=create_access_token(subject=user.id),
            refresh_token=create_refresh_token(subject=user.id),
        )

    def get_current_user_from_token(self, token: str) -> User:
        try:
            payload = decode_token(token)
            if payload.get("type") != "access":
                raise CredentialsException("Invalid token type")
            user_id: str | None = payload.get("sub")
            if user_id is None:
                raise CredentialsException()
        except jwt.ExpiredSignatureError:
            raise TokenExpiredException()
        except jwt.InvalidTokenError:
            raise CredentialsException()

        user = self.user_repo.get(int(user_id))
        if user is None:
            raise CredentialsException()
        return user
