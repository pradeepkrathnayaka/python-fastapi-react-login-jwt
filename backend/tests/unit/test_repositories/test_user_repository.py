import pytest
from sqlalchemy.orm import Session

from src.models.user import User
from src.repositories.user_repository import UserRepository
from src.schemas.user import UserCreate, UserUpdate


class TestUserRepository:
    def test_create_and_get_by_email(self, db: Session):
        repo = UserRepository(db)
        user = repo.create(
            UserCreate(email="a@b.com", username="ab_user", password="Pass@1234")
        )
        found = repo.get_by_email("a@b.com")
        assert found is not None
        assert found.id == user.id

    def test_get_by_username(self, db: Session):
        repo = UserRepository(db)
        repo.create(UserCreate(email="x@y.com", username="xy_user", password="Pass@1234"))
        found = repo.get_by_username("xy_user")
        assert found is not None

    def test_get_returns_none_for_missing(self, db: Session):
        repo = UserRepository(db)
        assert repo.get(999) is None
        assert repo.get_by_email("missing@x.com") is None

    def test_update_password(self, db: Session, test_user: User):
        repo = UserRepository(db)
        repo.update(test_user, UserUpdate(full_name="Updated Name"))
        refreshed = repo.get(test_user.id)
        assert refreshed.full_name == "Updated Name"

    def test_delete(self, db: Session, test_user: User):
        repo = UserRepository(db)
        repo.delete(test_user.id)
        assert repo.get(test_user.id) is None

    def test_get_all(self, db: Session, test_user: User):
        repo = UserRepository(db)
        users = repo.get_all()
        assert len(users) >= 1
