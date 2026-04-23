from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from src.api.deps import AuthServiceDep, CurrentUserDep
from src.db.session import SessionDep
from src.models.user import User
from src.schemas.auth import LoginRequest
from src.schemas.token import Token, TokenRefresh
from src.schemas.user import UserCreate, UserResponse
from src.services.user_service import UserService

router = APIRouter()


@router.post("/login", response_model=Token, summary="OAuth2 form login")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: AuthServiceDep,
) -> Token:
    """Login with username/password form data (OAuth2 compatible)."""
    return auth_service.login(LoginRequest(username=form_data.username, password=form_data.password))


@router.post("/login/json", response_model=Token, summary="JSON body login")
def login_json(
    login_data: LoginRequest,
    auth_service: AuthServiceDep,
) -> Token:
    """Login with JSON body – convenient for non-OAuth2 clients."""
    return auth_service.login(login_data)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
    summary="Register a new user",
)
def register(user_in: UserCreate, db: SessionDep) -> User:
    return UserService(db).create_user(user_in)


@router.post("/refresh", response_model=Token, summary="Refresh access token")
def refresh_token(token_data: TokenRefresh, auth_service: AuthServiceDep) -> Token:
    return auth_service.refresh_tokens(token_data.refresh_token)


@router.get("/me", response_model=UserResponse, summary="Current user info")
def get_me(current_user: CurrentUserDep) -> User:
    return current_user


@router.post("/logout", status_code=204, summary="Logout (client-side token discard)")
def logout() -> None:
    """JWT is stateless – instruct the client to discard its tokens.
    Returns 204 No Content.
    """
    return None
