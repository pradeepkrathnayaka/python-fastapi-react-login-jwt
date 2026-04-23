"""End-to-end test: complete register → login → access protected resource → refresh flow."""
from fastapi.testclient import TestClient


def test_full_login_flow(client: TestClient):
    # 1. Register
    reg = client.post(
        "/api/v1/auth/register",
        json={
            "email": "e2e@example.com",
            "username": "e2euser",
            "password": "E2e@12345",
        },
    )
    assert reg.status_code == 201
    user_id = reg.json()["id"]

    # 2. Login
    login = client.post(
        "/api/v1/auth/login",
        data={"username": "e2euser", "password": "E2e@12345"},
    )
    assert login.status_code == 200
    tokens = login.json()
    access_token = tokens["access_token"]
    refresh_token = tokens["refresh_token"]

    # 3. Access protected endpoint
    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert me.status_code == 200
    assert me.json()["username"] == "e2euser"

    # 4. Refresh
    refreshed = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refreshed.status_code == 200
    new_access = refreshed.json()["access_token"]
    assert new_access  # valid non-empty token

    # 5. Use new access token
    me2 = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {new_access}"},
    )
    assert me2.status_code == 200
    assert me2.json()["id"] == user_id
