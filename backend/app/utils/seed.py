"""Mock data loader — seeds the database at startup."""

import json
import os
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.models import User, UserRole, Bug, BugSeverity, BugStatus


# Resolve paths relative to this file
MOCK_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "mock_data")

# Also check the frontend mock directory
FRONTEND_MOCK_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
    "mock",
)


def _load_json(filename: str):
    """Try mock_data dir first, then frontend mock dir."""
    path = os.path.join(MOCK_DIR, filename)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)

    path = os.path.join(FRONTEND_MOCK_DIR, filename)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)

    return []


def seed_database(db: Session):
    """Seed database with mock data if tables are empty."""

    # Check if already seeded
    if db.query(User).first():
        return

    print("🌱 Seeding database with mock data...")

    # ---- Users ----
    # Create default users (one per role)
    default_password = hash_password("password123")

    admin_user = User(
        id="user-admin",
        name="Admin User",
        email="admin@crowdfundfix.io",
        hashed_password=default_password,
        role=UserRole.ADMIN,
        reputation=100.0,
        avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    )
    db.add(admin_user)

    regular_users = [
        User(
            id="user-1",
            name="Alice Johnson",
            email="alice@example.com",
            hashed_password=default_password,
            role=UserRole.USER,
            reputation=25.0,
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        ),
        User(
            id="user-2",
            name="Bob Wilson",
            email="bob@example.com",
            hashed_password=default_password,
            role=UserRole.USER,
            reputation=15.0,
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        ),
        User(
            id="user-3",
            name="Carol Davis",
            email="carol@example.com",
            hashed_password=default_password,
            role=UserRole.USER,
            reputation=30.0,
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
        ),
    ]
    for u in regular_users:
        db.add(u)

    # ---- Developers (from mock/developers.json) ----
    developers_data = _load_json("developers.json")
    for dev in developers_data:
        db.add(
            User(
                id=dev["id"],
                name=dev["name"],
                email=f"{dev['name'].lower().replace(' ', '.')}@dev.io",
                hashed_password=default_password,
                role=UserRole.DEVELOPER,
                skills=dev.get("skills", []),
                success_rate=dev.get("successRate", 0),
                bugs_resolved=dev.get("bugsResolved", 0),
                avatar_url=dev.get("avatarUrl"),
                reputation=dev.get("bugsResolved", 0) * 2.5,
            )
        )

    db.flush()  # Ensure user IDs exist before bug FK references

    # ---- Bugs (from mock/bugs.json) ----
    bugs_data = _load_json("bugs.json")
    for b in bugs_data:
        created_at = datetime.fromisoformat(b["createdAt"].replace("Z", "+00:00"))
        bug = Bug(
            id=b["id"],
            title=b["title"],
            description=b["description"],
            repo_link=b.get("repoLink", ""),
            logs=b.get("logs", ""),
            tags=b.get("tags", []),
            severity=BugSeverity(b.get("severity", "Medium")),
            expected_behavior=b.get("expectedBehavior", ""),
            status=BugStatus(b.get("status", "Open")),
            bounty=b.get("bounty", 0),
            funds_raised=b.get("fundsRaised", 0),
            contributors=b.get("contributors", 0),
            author_id=b.get("authorId", "user-1"),
            assigned_developer_id=b.get("assignedDeveloperId"),
            ai_priority_score=b.get("aiScore"),
            created_at=created_at,
        )
        db.add(bug)

    db.commit()
    print(f"✅ Seeded {len(regular_users) + 1} users, {len(developers_data)} developers, {len(bugs_data)} bugs")
