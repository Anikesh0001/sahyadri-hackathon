"""Analytics service — aggregated dashboard stats."""

from typing import Dict, Any, List

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.models import Bug, User, UserRole, BugStatus, BugSeverity


class AnalyticsService:

    @staticmethod
    def get_dashboard(db: Session) -> Dict[str, Any]:
        total_bugs = db.query(Bug).count()
        resolved_bugs = (
            db.query(Bug).filter(Bug.status == BugStatus.RESOLVED).count()
        )
        resolved_pct = (resolved_bugs / total_bugs * 100) if total_bugs > 0 else 0.0

        total_funding = (
            db.query(func.sum(Bug.funds_raised)).scalar() or 0.0
        )
        avg_bounty = (
            db.query(func.avg(Bug.bounty)).scalar() or 0.0
        )

        # Bugs by severity
        severity_counts = {}
        for sev in BugSeverity:
            count = db.query(Bug).filter(Bug.severity == sev).count()
            severity_counts[sev.value] = count

        # Bugs by status
        status_counts = {}
        for st in BugStatus:
            count = db.query(Bug).filter(Bug.status == st).count()
            status_counts[st.value] = count

        # Top developers
        top_devs = (
            db.query(User)
            .filter(User.role == UserRole.DEVELOPER)
            .order_by(User.bugs_resolved.desc())
            .limit(10)
            .all()
        )

        # Recent bugs
        recent_bugs = (
            db.query(Bug).order_by(Bug.created_at.desc()).limit(5).all()
        )

        return {
            "totalBugs": total_bugs,
            "resolvedBugs": resolved_bugs,
            "resolvedPercentage": round(resolved_pct, 1),
            "totalFunding": float(total_funding),
            "averageBounty": round(float(avg_bounty), 2),
            "bugsBySeverity": severity_counts,
            "bugsByStatus": status_counts,
            "topDevelopers": [
                {
                    "id": d.id,
                    "name": d.name,
                    "skills": d.skills or [],
                    "successRate": d.success_rate,
                    "bugsResolved": d.bugs_resolved,
                    "avatarUrl": d.avatar_url,
                }
                for d in top_devs
            ],
            "recentBugs": [
                {
                    "id": b.id,
                    "title": b.title,
                    "description": b.description,
                    "repoLink": b.repo_link or "",
                    "logs": b.logs or "",
                    "tags": b.tags or [],
                    "severity": b.severity.value if b.severity else "Medium",
                    "expectedBehavior": b.expected_behavior or "",
                    "status": b.status.value if b.status else "Open",
                    "createdAt": b.created_at.isoformat() if b.created_at else "",
                    "bounty": b.bounty or 0.0,
                    "fundsRaised": b.funds_raised or 0.0,
                    "contributors": b.contributors or 0,
                    "authorId": b.author_id,
                    "assignedDeveloperId": b.assigned_developer_id,
                    "aiScore": b.ai_priority_score,
                }
                for b in recent_bugs
            ],
        }
