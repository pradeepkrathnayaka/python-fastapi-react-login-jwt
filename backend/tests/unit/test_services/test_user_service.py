import pytest
from sqlalchemy.orm import Session

from src.core.exceptions import ConflictException, NotFoundException
from src.models.user import User
from src.schemas.user import UserCreate, UserUpdate
from src.services.user_service import UserService


class TestUserServiceCreate:
    def test_create_user_success(self, db: Session):
        service = UserService(db)
        user = service.create_user(
            UserCreate(
                email="new@example.com",
                username="newuser",
                password="NewPass@1",
            )
        )
        assert user.id is not None
        assert user.email == "new@example.com"

    def test_create_duplicate_email_raises(self, db: Session, test_user: User):
        service = UserService(db)
        with pytest.raises(ConflictException):
            service.create_user(
                UserCreate(
                    email="test@example.com",
                    username="another",
                    password="Pass@1234",
                )
            )

    def test_create_duplicate_username_raises(self, db: Session, test_user: User):
        service = UserService(db)
        with pytest.raises(ConflictException):
            service.create_user(
                UserCreate(
                    email="other@example.com",
                    username="testuser",
                    password="Pass@1234",
                )
            )


class TestUserServiceRead:
    def test_get_existing_user(self, db: Session, test_user: User):
        service = UserService(db)
        fetched = service.get_user(test_user.id)
        assert fetched.id == test_user.id

    def test_get_missing_user_raises(self, db: Session):
        service = UserService(db)
        with pytest.raises(NotFoundException):
            service.get_user(9999)


class TestUserServiceUpdate:
    def test_update_full_name(self, db: Session, test_user: User):
        service = UserService(db)
        updated = service.update_user(test_user.id, UserUpdate(full_name="New Name"))
        assert updated.full_name == "New Name"

    def test_update_nonexistent_user_raises(self, db: Session):
        service = UserService(db)
        with pytest.raises(NotFoundException):
            service.update_user(9999, UserUpdate(full_name="Ghost"))


class TestUserServiceDelete:
    def test_delete_user(self, db: Session, test_user: User):
        service = UserService(db)
        deleted = service.delete_user(test_user.id)
        assert deleted.id == test_user.id
        with pytest.raises(NotFoundException):
            service.get_user(test_user.id)

    def test_delete_nonexistent_raises(self, db: Session):
        service = UserService(db)
        with pytest.raises(NotFoundException):
            service.delete_user(9999)
