"""AI service — orchestrates AI engine calls."""

from typing import List, Dict, Any, Optional

from sqlalchemy.orm import Session

from app.models.models import Bug, User, UserRole, DeveloperMatch
from app.ai.engine import AIEngine


class AIService:

    def __init__(self):
        self.engine = AIEngine()

    def analyze_bug(self, db: Session, bug_id: str) -> Dict[str, Any]:
        """Run full AI analysis pipeline on a bug."""
        bug = db.query(Bug).filter(Bug.id == bug_id).first()
        if not bug:
            return {}

        analysis = self.engine.analyze(
            title=bug.title,
            description=bug.description,
            logs=bug.logs or "",
            tags=bug.tags or [],
            severity=bug.severity.value if bug.severity else "Medium",
        )

        # Persist AI scores back to bug
        bug.ai_priority_score = analysis.get("priority_score", 0.0)
        bug.predicted_complexity = analysis.get("complexity", "Medium")
        bug.predicted_bounty = analysis.get("estimated_bounty", 0.0)
        db.commit()

        return {
            "bugId": bug.id,
            "category": analysis["category"],
            "complexity": analysis["complexity"],
            "estimatedBounty": analysis["estimated_bounty"],
            "confidenceScore": analysis["confidence_score"],
            "impactScore": analysis["impact_score"],
            "nlpSummary": analysis["summary"],
            "errorClusters": analysis["error_clusters"],
            "logInsights": analysis["log_insights"],
        }

    def match_developers(self, db: Session, bug_id: str) -> List[Dict[str, Any]]:
        """Match developers to a bug based on skills overlap and reputation."""
        bug = db.query(Bug).filter(Bug.id == bug_id).first()
        if not bug:
            return []

        developers = (
            db.query(User).filter(User.role == UserRole.DEVELOPER).all()
        )

        matches = self.engine.match_developers(
            bug_tags=bug.tags or [],
            bug_severity=bug.severity.value if bug.severity else "Medium",
            developers=[
                {
                    "id": dev.id,
                    "name": dev.name,
                    "skills": dev.skills or [],
                    "success_rate": dev.success_rate,
                    "bugs_resolved": dev.bugs_resolved,
                    "avatar_url": dev.avatar_url,
                }
                for dev in developers
            ],
        )

        # Persist developer matches
        for match in matches:
            existing = (
                db.query(DeveloperMatch)
                .filter(
                    DeveloperMatch.bug_id == bug_id,
                    DeveloperMatch.developer_id == match["id"],
                )
                .first()
            )
            if not existing:
                dm = DeveloperMatch(
                    bug_id=bug_id,
                    developer_id=match["id"],
                    match_score=match["matchScore"],
                )
                db.add(dm)
        db.commit()

        return matches
