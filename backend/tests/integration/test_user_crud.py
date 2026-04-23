"""Integration tests for user CRUD endpoints."""
from fastapi.testclient import TestClient

from src.models.user import User


class TestUserList:
    def test_list_users_as_superuser(
        self, client: TestClient, superuser_token: str, test_user: User
    ):
        resp = client.get(
            "/api/v1/users/",
            headers={"Authorization": f"Bearer {superuser_token}"},
        )
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_list_users_as_regular_user_forbidden(
        self, client: TestClient, user_token: str
    ):
        resp = client.get(
            "/api/v1/users/",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert resp.status_code == 403


class TestGetUser:
    def test_get_user_by_id(
        self, client: TestClient, user_token: str, test_user: User
    ):
        resp = client.get(
            f"/api/v1/users/{test_user.id}",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert resp.status_code == 200
        assert resp.json()["id"] == test_user.id

    def test_get_nonexistent_user(self, client: TestClient, user_token: str):
        resp = client.get(
            "/api/v1/users/9999",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert resp.status_code == 404


class TestUpdateUser:
    def test_update_full_name(
        self, client: TestClient, user_token: str, test_user: User
    ):
        resp = client.put(
            f"/api/v1/users/{test_user.id}",
            json={"full_name": "Updated Name"},
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert resp.status_code == 200
        assert resp.json()["full_name"] == "Updated Name"


class TestDeleteUser:
    def test_delete_as_superuser(
        self, client: TestClient, superuser_token: str, test_user: User
    ):
        resp = client.delete(
            f"/api/v1/users/{test_user.id}",
            headers={"Authorization": f"Bearer {superuser_token}"},
        )
        assert resp.status_code == 200

    def test_delete_as_regular_user_forbidden(
        self, client: TestClient, user_token: str, test_user: User
    ):
        resp = client.delete(
            f"/api/v1/users/{test_user.id}",
            headers={"Authorization": f"Bearer {user_token}"},
        )
        assert resp.status_code == 403
