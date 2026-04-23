"""Integration tests for the full authentication flow via HTTP."""
from fastapi.testclient import TestClient

from src.models.user import User


class TestRegisterFlow:
    def test_register_success(self, client: TestClient):
        resp = client.post(
            "/api/v1/auth/register",
            json={
                "email": "reg@example.com",
                "username": "reguser",
                "password": "Reg@12345",
            },
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "reg@example.com"
        assert "hashed_password" not in data

    def test_register_duplicate_email(self, client: TestClient, test_user: User):
        resp = client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "username": "other",
                "password": "Other@1234",
            },
        )
        assert resp.status_code == 409

    def test_register_weak_password(self, client: TestClient):
        resp = client.post(
            "/api/v1/auth/register",
            json={"email": "weak@example.com", "username": "weakuser", "password": "short"},
        )
        assert resp.status_code == 422


class TestLoginFlow:
    def test_form_login_returns_tokens(self, client: TestClient, test_user: User):
        resp = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "Test@123456"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert "access_token" in body
        assert "refresh_token" in body
        assert body["token_type"] == "bearer"

    def test_json_login(self, client: TestClient, test_user: User):
        resp = client.post(
            "/api/v1/auth/login/json",
            json={"username": "testuser", "password": "Test@123456"},
        )
        assert resp.status_code == 200

    def test_wrong_credentials(self, client: TestClient, test_user: User):
        resp = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "WrongPass@1"},
        )
        assert resp.status_code == 401


class TestMeEndpoint:
    def test_get_me(self, client: TestClient, user_token: str):
        resp = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert resp.status_code == 200
        assert resp.json()["username"] == "testuser"

    def test_get_me_no_token(self, client: TestClient):
        resp = client.get("/api/v1/auth/me")
        assert resp.status_code == 401


class TestRefreshFlow:
    def test_refresh_returns_new_access_token(self, client: TestClient, test_user: User):
        login = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "Test@123456"},
        )
        refresh_token = login.json()["refresh_token"]
        resp = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert resp.status_code == 200
        assert resp.json()["access_token"]  # valid non-empty token
