import pytest
from sqlalchemy.orm import Session

from src.core.exceptions import BadRequestException, CredentialsException
from src.models.user import User
from src.schemas.auth import LoginRequest
from src.services.auth_service import AuthService
from src.core.security import get_password_hash


class TestAuthServiceLogin:
    def test_login_success(self, db: Session, test_user: User):
        service = AuthService(db)
        token = service.login(LoginRequest(username="testuser", password="Test@123456"))
        assert token.access_token
        assert token.refresh_token
        assert token.token_type == "bearer"

    def test_login_by_email(self, db: Session, test_user: User):
        service = AuthService(db)
        token = service.login(
            LoginRequest(username="test@example.com", password="Test@123456")
        )
        assert token.access_token

    def test_login_wrong_password(self, db: Session, test_user: User):
        service = AuthService(db)
        with pytest.raises(CredentialsException):
            service.login(LoginRequest(username="testuser", password="WrongPass@1"))

    def test_login_unknown_user(self, db: Session):
        service = AuthService(db)
        with pytest.raises(CredentialsException):
            service.login(LoginRequest(username="ghost", password="Test@123456"))

    def test_login_inactive_user(self, db: Session, test_user: User):
        test_user.is_active = False
        db.commit()
        service = AuthService(db)
        with pytest.raises(BadRequestException):
            service.login(LoginRequest(username="testuser", password="Test@123456"))


class TestAuthServiceRefresh:
    def test_refresh_returns_new_tokens(self, db: Session, test_user: User):
        service = AuthService(db)
        original = service.login(LoginRequest(username="testuser", password="Test@123456"))
        refreshed = service.refresh_tokens(original.refresh_token)
        assert refreshed.access_token  # valid non-empty token
        assert refreshed.token_type == "bearer"

    def test_refresh_with_access_token_fails(self, db: Session, test_user: User):
        service = AuthService(db)
        tokens = service.login(LoginRequest(username="testuser", password="Test@123456"))
        with pytest.raises(CredentialsException):
            service.refresh_tokens(tokens.access_token)
