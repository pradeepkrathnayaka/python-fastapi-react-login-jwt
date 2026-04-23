import logging

from sqlalchemy.orm import Session

from src.core.exceptions import ConflictException, NotFoundException
from src.models.user import User
from src.repositories.user_repository import UserRepository
from src.schemas.user import UserCreate, UserUpdate

logger = logging.getLogger("app")


class UserService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)

    def create_user(self, user_in: UserCreate) -> User:
        if self.user_repo.get_by_email(user_in.email):
            raise ConflictException("Email already registered")
        if self.user_repo.get_by_username(user_in.username):
            raise ConflictException("Username already taken")
        user = self.user_repo.create(user_in)
        logger.info("User created: %s", user.username)
        return user

    def get_user(self, user_id: int) -> User:
        user = self.user_repo.get(user_id)
        if not user:
            raise NotFoundException(f"User {user_id} not found")
        return user

    def get_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        return self.user_repo.get_all(skip=skip, limit=limit)

    def update_user(self, user_id: int, user_in: UserUpdate) -> User:
        user = self.get_user(user_id)
        if user_in.email and user_in.email != user.email:
            if self.user_repo.get_by_email(user_in.email):
                raise ConflictException("Email already registered")
        if user_in.username and user_in.username != user.username:
            if self.user_repo.get_by_username(user_in.username):
                raise ConflictException("Username already taken")
        return self.user_repo.update(user, user_in)

    def delete_user(self, user_id: int) -> User:
        user = self.user_repo.delete(user_id)
        if not user:
            raise NotFoundException(f"User {user_id} not found")
        logger.info("User deleted: id=%s", user_id)
        return user
