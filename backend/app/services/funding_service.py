"""Funding service — business logic for funding operations."""

from typing import List, Optional, Dict, Any

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.models import Bug, Funding


class FundingService:

    @staticmethod
    def add_funding(
        db: Session, bug_id: str, contributor_name: str, amount: float
    ) -> Optional[Funding]:
        bug = db.query(Bug).filter(Bug.id == bug_id).first()
        if not bug:
            return None

        funding = Funding(
            bug_id=bug_id,
            contributor_name=contributor_name,
            amount=amount,
        )
        db.add(funding)

        # Update bug totals
        bug.funds_raised += amount
        bug.contributors += 1

        # Auto-update status to Funded if threshold met
        if bug.funds_raised >= bug.bounty and bug.bounty > 0:
            from app.models.models import BugStatus
            bug.status = BugStatus.FUNDED

        db.commit()
        db.refresh(funding)
        return funding

    @staticmethod
    def get_fundings_for_bug(db: Session, bug_id: str) -> Dict[str, Any]:
        bug = db.query(Bug).filter(Bug.id == bug_id).first()
        fundings = db.query(Funding).filter(Funding.bug_id == bug_id).all()
        total = sum(f.amount for f in fundings)

        return {
            "bug_id": bug_id,
            "total_funded": total,
            "contributors": len(fundings),
            "fundings": fundings,
        }
