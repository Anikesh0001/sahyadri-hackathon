"""Bug service — business logic for bug operations."""

from datetime import datetime, timezone
from typing import List, Optional
import uuid

from sqlalchemy.orm import Session

from app.models.models import Bug, BugStatus, BugSeverity


class BugService:

    @staticmethod
    def create_bug(
        db: Session,
        title: str,
        description: str,
        author_id: str,
        repo_link: str = "",
        logs: str = "",
        tags: list = None,
        severity: str = "Medium",
        expected_behavior: str = "",
    ) -> Bug:
        bug = Bug(
            id=f"bug-{uuid.uuid4().hex[:8]}",
            title=title,
            description=description,
            repo_link=repo_link,
            logs=logs,
            tags=tags or [],
            severity=BugSeverity(severity),
            expected_behavior=expected_behavior,
            status=BugStatus.OPEN,
            bounty=0.0,
            funds_raised=0.0,
            contributors=0,
            author_id=author_id,
            created_at=datetime.now(timezone.utc),
        )
        db.add(bug)
        db.commit()
        db.refresh(bug)
        return bug

    @staticmethod
    def get_all_bugs(db: Session) -> List[Bug]:
        return db.query(Bug).order_by(Bug.created_at.desc()).all()

    @staticmethod
    def get_bug_by_id(db: Session, bug_id: str) -> Optional[Bug]:
        return db.query(Bug).filter(Bug.id == bug_id).first()

    @staticmethod
    def update_bug_status(db: Session, bug_id: str, status: str) -> Optional[Bug]:
        bug = db.query(Bug).filter(Bug.id == bug_id).first()
        if bug:
            bug.status = BugStatus(status)
            db.commit()
            db.refresh(bug)
        return bug

    @staticmethod
    def update_bug_ai_scores(
        db: Session,
        bug_id: str,
        ai_priority_score: float,
        predicted_complexity: str,
        predicted_bounty: float,
    ) -> Optional[Bug]:
        bug = db.query(Bug).filter(Bug.id == bug_id).first()
        if bug:
            bug.ai_priority_score = ai_priority_score
            bug.predicted_complexity = predicted_complexity
            bug.predicted_bounty = predicted_bounty
            db.commit()
            db.refresh(bug)
        return bug
