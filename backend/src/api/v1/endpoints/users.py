from typing import Annotated

from fastapi import APIRouter, Query

from src.api.deps import ActiveUserDep, CurrentUserDep, SuperuserDep
from src.db.session import SessionDep
from src.models.user import User
from src.schemas.user import UserResponse, UserUpdate
from src.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=UserResponse, summary="Get current user profile")
def get_me(current_user: CurrentUserDep) -> User:
    """Returns the authenticated user's own profile."""
    return current_user


@router.patch("/me", response_model=UserResponse, summary="Update current user profile")
def update_me(
    user_in: UserUpdate,
    db: SessionDep,
    current_user: CurrentUserDep,
) -> User:
    """Update the authenticated user's own profile."""
    return UserService(db).update_user(current_user.id, user_in)


@router.delete("/me", response_model=UserResponse, summary="Delete current user account")
def delete_me(
    db: SessionDep,
    current_user: CurrentUserDep,
) -> User:
    """Delete the authenticated user's own account."""
    return UserService(db).delete_user(current_user.id)


@router.get("/", response_model=list[UserResponse], summary="List all users")
def list_users(
    db: SessionDep,
    _: SuperuserDep,
    skip: int = Query(default=0, ge=0),
    limit: Annotated[int, Query(ge=1, le=200)] = 100,
) -> list[User]:
    """Superuser only."""
    return UserService(db).get_users(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse, summary="Get user by ID")
def get_user(
    user_id: int,
    db: SessionDep,
    _: ActiveUserDep,
) -> User:
    return UserService(db).get_user(user_id)


@router.put("/{user_id}", response_model=UserResponse, summary="Full user update")
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: SessionDep,
    _: ActiveUserDep,
) -> User:
    return UserService(db).update_user(user_id, user_in)


@router.patch("/{user_id}", response_model=UserResponse, summary="Partial user update")
def patch_user(
    user_id: int,
    user_in: UserUpdate,
    db: SessionDep,
    _: ActiveUserDep,
) -> User:
    """Send only the fields you want to change."""
    return UserService(db).update_user(user_id, user_in)


@router.delete("/{user_id}", response_model=UserResponse, summary="Delete user")
def delete_user(
    user_id: int,
    db: SessionDep,
    _: SuperuserDep,
) -> User:
    """Superuser only."""
    return UserService(db).delete_user(user_id)
