import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from src.db.base import Base
from src.db.session import get_db
from src.main import app
from src.models.user import User
from src.core.security import get_password_hash

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db() -> Session:
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db: Session) -> TestClient:
    def _override_get_db():
        yield db

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db: Session) -> User:
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("Test@123456"),
        full_name="Test User",
        is_active=True,
        is_superuser=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def superuser(db: Session) -> User:
    user = User(
        email="admin@example.com",
        username="admin",
        hashed_password=get_password_hash("Admin@123456"),
        full_name="Admin User",
        is_active=True,
        is_superuser=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def user_token(client: TestClient, test_user: User) -> str:
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testuser", "password": "Test@123456"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def superuser_token(client: TestClient, superuser: User) -> str:
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "Admin@123456"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]
