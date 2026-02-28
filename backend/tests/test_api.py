"""Tests for CrowdfundFix backend."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite:///./test_crowdfundfix.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    """Create tables before each test and drop after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# ---------- Health ----------

class TestHealth:
    def test_root(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["health"] == "ok"

    def test_health(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


# ---------- Auth ----------

class TestAuth:
    def test_signup(self):
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "testpass123",
                "role": "User",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_signup_duplicate_email(self):
        # First signup
        client.post(
            "/api/v1/auth/signup",
            json={
                "name": "Test User",
                "email": "dup@example.com",
                "password": "testpass123",
                "role": "User",
            },
        )
        # Duplicate
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "name": "Test User 2",
                "email": "dup@example.com",
                "password": "testpass123",
                "role": "User",
            },
        )
        assert response.status_code == 400

    def test_login(self):
        # First create the user
        client.post(
            "/api/v1/auth/signup",
            json={
                "name": "Login User",
                "email": "login@example.com",
                "password": "testpass123",
                "role": "User",
            },
        )
        # Then login
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "login@example.com", "password": "testpass123"},
        )
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_login_wrong_password(self):
        client.post(
            "/api/v1/auth/signup",
            json={
                "name": "Wrong Pass User",
                "email": "wrong@example.com",
                "password": "correct",
                "role": "User",
            },
        )
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "wrong@example.com", "password": "incorrect"},
        )
        assert response.status_code == 401

    def test_me(self):
        # Signup to get token
        signup = client.post(
            "/api/v1/auth/signup",
            json={
                "name": "Me User",
                "email": "me@example.com",
                "password": "testpass123",
                "role": "Developer",
            },
        )
        token = signup.json()["access_token"]

        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Me User"
        assert data["role"] == "Developer"

    def test_me_no_token(self):
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401


# ---------- Bugs ----------

def _get_auth_token(name="Bug User", email="buguser@example.com"):
    """Helper to create user and get token."""
    resp = client.post(
        "/api/v1/auth/signup",
        json={"name": name, "email": email, "password": "pass123", "role": "User"},
    )
    return resp.json()["access_token"]


class TestBugs:
    def test_create_bug(self):
        token = _get_auth_token()
        response = client.post(
            "/api/v1/bugs",
            json={
                "title": "Test Bug",
                "description": "This is a test bug",
                "repoLink": "https://github.com/test/repo",
                "tags": ["test", "backend"],
                "severity": "Medium",
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Bug"
        assert data["status"] == "Open"

    def test_list_bugs(self):
        token = _get_auth_token()
        # Create a bug first
        client.post(
            "/api/v1/bugs",
            json={"title": "List Test", "description": "desc", "tags": []},
            headers={"Authorization": f"Bearer {token}"},
        )
        response = client.get("/api/v1/bugs")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    def test_get_bug_by_id(self):
        token = _get_auth_token()
        create_resp = client.post(
            "/api/v1/bugs",
            json={"title": "Get By ID", "description": "desc", "tags": []},
            headers={"Authorization": f"Bearer {token}"},
        )
        bug_id = create_resp.json()["id"]

        response = client.get(f"/api/v1/bugs/{bug_id}")
        assert response.status_code == 200
        assert response.json()["id"] == bug_id

    def test_get_bug_not_found(self):
        response = client.get("/api/v1/bugs/nonexistent")
        assert response.status_code == 404


# ---------- AI Analysis ----------

class TestAI:
    def test_analyze_bug(self):
        token = _get_auth_token(email="ai@example.com")
        create_resp = client.post(
            "/api/v1/bugs",
            json={
                "title": "Auth token loop",
                "description": "JWT refresh token causes infinite redirect loop with 401 errors",
                "logs": "Error: 401 Unauthorized\nRedirecting...",
                "tags": ["auth", "jwt", "frontend"],
                "severity": "Critical",
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        bug_id = create_resp.json()["id"]

        response = client.post(
            "/api/v1/ai/analyze-bug",
            json={"bugId": bug_id},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["bugId"] == bug_id
        assert "category" in data
        assert "complexity" in data
        assert "estimatedBounty" in data
        assert "nlpSummary" in data
        assert "errorClusters" in data

    def test_analyze_nonexistent_bug(self):
        response = client.post(
            "/api/v1/ai/analyze-bug",
            json={"bugId": "nonexistent"},
        )
        assert response.status_code == 404


# ---------- Verification ----------

class TestVerification:
    def test_verify_fix(self):
        response = client.post(
            "/api/v1/verify-fix",
            json={
                "bugId": "bug-1",
                "developerId": "dev-1",
                "prLink": "https://github.com/org/repo/pull/42",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "similarityScore" in data
        assert "passed" in data
        assert "diffSummary" in data
