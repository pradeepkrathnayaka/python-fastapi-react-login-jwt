"""Root-level smoke tests for the FastAPI app."""
from fastapi.testclient import TestClient


def test_root_returns_200(client: TestClient):
    resp = client.get("/")
    assert resp.status_code == 200
    body = resp.json()
    assert "message" in body
    assert "docs" in body


def test_health_check(client: TestClient):
    resp = client.get("/api/v1/health/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_db_health_check(client: TestClient):
    resp = client.get("/api/v1/health/db")
    assert resp.status_code == 200
    assert resp.json()["database"] == "connected"

