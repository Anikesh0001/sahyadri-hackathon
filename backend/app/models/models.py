"""SQLAlchemy ORM models."""

import enum
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Text,
    DateTime,
    Enum,
    ForeignKey,
    JSON,
    Boolean,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


# ---------- Enums ----------

class UserRole(str, enum.Enum):
    USER = "User"
    DEVELOPER = "Developer"
    ADMIN = "Admin"


class BugSeverity(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class BugStatus(str, enum.Enum):
    OPEN = "Open"
    FUNDED = "Funded"
    CLAIMED = "Claimed"
    IN_REVIEW = "In Review"
    RESOLVED = "Resolved"


class FixSubmissionStatus(str, enum.Enum):
    PENDING = "Pending"
    VERIFIED = "Verified"
    REJECTED = "Rejected"


# ---------- Models ----------

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    reputation = Column(Float, default=0.0)
    skills = Column(JSON, default=list)  # list of skill strings (for developers)
    success_rate = Column(Float, default=0.0)
    bugs_resolved = Column(Integer, default=0)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    bugs_created = relationship("Bug", back_populates="author", foreign_keys="Bug.author_id")


class Bug(Base):
    __tablename__ = "bugs"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    repo_link = Column(String, nullable=True)
    logs = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    severity = Column(Enum(BugSeverity), default=BugSeverity.MEDIUM)
    expected_behavior = Column(Text, nullable=True)
    status = Column(Enum(BugStatus), default=BugStatus.OPEN)
    ai_priority_score = Column(Float, nullable=True)
    predicted_complexity = Column(String, nullable=True)
    predicted_bounty = Column(Float, nullable=True)
    bounty = Column(Float, default=0.0)
    funds_raised = Column(Float, default=0.0)
    contributors = Column(Integer, default=0)
    author_id = Column(String, ForeignKey("users.id"), nullable=False)
    assigned_developer_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    author = relationship("User", back_populates="bugs_created", foreign_keys=[author_id])
    fundings = relationship("Funding", back_populates="bug")
    developer_matches = relationship("DeveloperMatch", back_populates="bug")
    fix_submissions = relationship("FixSubmission", back_populates="bug")


class Funding(Base):
    __tablename__ = "fundings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bug_id = Column(String, ForeignKey("bugs.id"), nullable=False)
    contributor_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    bug = relationship("Bug", back_populates="fundings")


class DeveloperMatch(Base):
    __tablename__ = "developer_matches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bug_id = Column(String, ForeignKey("bugs.id"), nullable=False)
    developer_id = Column(String, ForeignKey("users.id"), nullable=False)
    match_score = Column(Float, nullable=False)

    bug = relationship("Bug", back_populates="developer_matches")
    developer = relationship("User")


class FixSubmission(Base):
    __tablename__ = "fix_submissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bug_id = Column(String, ForeignKey("bugs.id"), nullable=False)
    developer_id = Column(String, ForeignKey("users.id"), nullable=False)
    pr_link = Column(String, nullable=False)
    verification_score = Column(Float, nullable=True)
    status = Column(Enum(FixSubmissionStatus), default=FixSubmissionStatus.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    bug = relationship("Bug", back_populates="fix_submissions")
    developer = relationship("User")
