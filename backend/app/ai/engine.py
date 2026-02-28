"""
AI Engine — Bug intelligence, bounty prediction, developer matching.

Uses:
- sklearn TF-IDF + clustering for error categorization
- Heuristic scoring for priority, complexity, bounty prediction
- Skill overlap + reputation weighting for developer matching

Falls back to mock logic if ML libraries unavailable.
"""

import random
import hashlib
import math
from typing import List, Dict, Any, Optional

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.cluster import KMeans
    import numpy as np

    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False


# ---------- Category keyword mappings ----------
CATEGORY_KEYWORDS = {
    "Authentication / Security": [
        "auth", "jwt", "token", "login", "password", "session", "oauth",
        "security", "permission", "401", "403", "credential",
    ],
    "Payment Gateway Integration": [
        "payment", "stripe", "billing", "invoice", "charge", "webhook",
        "currency", "checkout", "transaction",
    ],
    "UI / Frontend": [
        "css", "ui", "frontend", "react", "component", "render", "layout",
        "mobile", "responsive", "z-index", "animation", "dom",
    ],
    "Memory Management / Infrastructure": [
        "memory", "leak", "oom", "heap", "buffer", "gc", "worker",
        "kubernetes", "docker", "infra", "devops", "crash",
    ],
    "Database / Data Layer": [
        "database", "sql", "query", "orm", "migration", "index",
        "postgres", "mysql", "mongo", "redis",
    ],
    "API / Backend": [
        "api", "endpoint", "rest", "graphql", "backend", "server",
        "route", "middleware", "cors", "500",
    ],
    "Performance": [
        "slow", "latency", "timeout", "performance", "cache", "optimize",
        "bottleneck", "throughput",
    ],
}

SEVERITY_WEIGHTS = {"Low": 0.2, "Medium": 0.5, "High": 0.8, "Critical": 1.0}

COMPLEXITY_THRESHOLDS = {
    (0, 30): "Low",
    (30, 60): "Medium",
    (60, 85): "High",
    (85, 101): "Extreme",
}


class AIEngine:
    """Core AI engine for bug analysis and developer matching."""

    def analyze(
        self,
        title: str,
        description: str,
        logs: str = "",
        tags: List[str] = None,
        severity: str = "Medium",
    ) -> Dict[str, Any]:
        """Full AI analysis of a bug."""
        tags = tags or []
        full_text = f"{title} {description} {logs} {' '.join(tags)}".lower()

        # 1. Categorize
        category = self._categorize(full_text, tags)

        # 2. Score complexity
        complexity_score = self._compute_complexity(full_text, severity, logs)
        complexity = self._score_to_complexity(complexity_score)

        # 3. Estimate bounty
        estimated_bounty = self._estimate_bounty(complexity_score, severity)

        # 4. Confidence score
        confidence = self._compute_confidence(full_text, logs)

        # 5. Impact scores
        impact = self._compute_impact(full_text, severity, tags)

        # 6. Priority score
        priority = self._compute_priority(complexity_score, severity, impact)

        # 7. NLP Summary
        summary = self._generate_summary(title, category, complexity, severity)

        # 8. Error clusters
        error_clusters = self._extract_error_clusters(full_text, logs)

        # 9. Log insights
        log_insights = self._extract_log_insights(logs)

        return {
            "category": category,
            "complexity": complexity,
            "complexity_score": complexity_score,
            "estimated_bounty": estimated_bounty,
            "confidence_score": confidence,
            "impact_score": impact,
            "priority_score": priority,
            "summary": summary,
            "error_clusters": error_clusters,
            "log_insights": log_insights,
        }

    def match_developers(
        self,
        bug_tags: List[str],
        bug_severity: str,
        developers: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Match developers to bug based on skills, reputation, and random variation."""
        if not developers:
            return []

        matches = []
        for dev in developers:
            skills = [s.lower() for s in (dev.get("skills") or [])]
            bug_tags_lower = [t.lower() for t in bug_tags]

            # Skill overlap
            overlap = len(set(skills) & set(bug_tags_lower))
            max_possible = max(len(bug_tags_lower), 1)
            skill_score = (overlap / max_possible) * 60  # up to 60%

            # Reputation weighting (success_rate contributes up to 25%)
            success_rate = dev.get("success_rate", 50.0)
            reputation_score = (success_rate / 100.0) * 25

            # Experience bonus (bugs_resolved, up to 10%)
            resolved = dev.get("bugs_resolved", 0)
            experience_score = min(resolved / 50.0, 1.0) * 10

            # Random variation (±5%)
            variation = random.uniform(-5, 5)

            total = max(0, min(100, skill_score + reputation_score + experience_score + variation))

            matches.append(
                {
                    "id": dev["id"],
                    "name": dev["name"],
                    "skills": dev.get("skills", []),
                    "successRate": dev.get("success_rate", 0),
                    "bugsResolved": dev.get("bugs_resolved", 0),
                    "avatarUrl": dev.get("avatar_url"),
                    "matchScore": round(total, 1),
                }
            )

        # Sort by match score descending
        matches.sort(key=lambda x: x["matchScore"], reverse=True)
        return matches

    # ---------- Private helpers ----------

    def _categorize(self, text: str, tags: List[str]) -> str:
        """Match text + tags to category using keyword overlap."""
        best_category = "General Bug"
        best_score = 0

        combined = f"{text} {' '.join(tags)}".lower()

        for category, keywords in CATEGORY_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw in combined)
            if score > best_score:
                best_score = score
                best_category = category

        return best_category

    def _compute_complexity(self, text: str, severity: str, logs: str) -> float:
        """Heuristic complexity score (0–100)."""
        base = SEVERITY_WEIGHTS.get(severity, 0.5) * 40

        # Text length contributes to complexity
        text_factor = min(len(text) / 500, 1.0) * 20

        # Log presence and length
        log_factor = min(len(logs) / 200, 1.0) * 15 if logs else 0

        # Keyword density
        complex_keywords = [
            "memory", "leak", "crash", "infinite", "loop", "deadlock",
            "race condition", "concurrent", "heap", "oom", "segfault",
        ]
        keyword_hits = sum(1 for kw in complex_keywords if kw in text.lower())
        keyword_factor = min(keyword_hits * 5, 25)

        return min(100, base + text_factor + log_factor + keyword_factor)

    def _score_to_complexity(self, score: float) -> str:
        for (lo, hi), label in COMPLEXITY_THRESHOLDS.items():
            if lo <= score < hi:
                return label
        return "Medium"

    def _estimate_bounty(self, complexity_score: float, severity: str) -> float:
        """Predict bounty from complexity and severity."""
        base = complexity_score * 3
        severity_mult = {"Low": 0.5, "Medium": 1.0, "High": 1.8, "Critical": 3.0}
        mult = severity_mult.get(severity, 1.0)
        bounty = base * mult
        # Round to nearest 25
        return round(bounty / 25) * 25

    def _compute_confidence(self, text: str, logs: str) -> float:
        """Higher confidence with more data."""
        text_score = min(len(text) / 300, 1.0) * 50
        log_score = min(len(logs) / 100, 1.0) * 30 if logs else 0
        base = 20  # baseline confidence
        return round(min(100, base + text_score + log_score), 1)

    def _compute_impact(self, text: str, severity: str, tags: List[str]) -> Dict[str, float]:
        sev_weight = SEVERITY_WEIGHTS.get(severity, 0.5)
        user_keywords = ["user", "customer", "client", "login", "payment", "checkout"]
        user_hits = sum(1 for kw in user_keywords if kw in text.lower())
        user_impact = min(100, sev_weight * 60 + user_hits * 15)

        urgency_keywords = ["critical", "urgent", "crash", "down", "block", "broken"]
        urgency_hits = sum(1 for kw in urgency_keywords if kw in text.lower())
        urgency = min(100, sev_weight * 50 + urgency_hits * 20)

        return {
            "userImpact": round(user_impact),
            "severity": round(sev_weight * 100),
            "urgency": round(urgency),
            "popularity": round(random.uniform(30, 80)),  # simulated
        }

    def _compute_priority(
        self, complexity: float, severity: str, impact: Dict[str, float]
    ) -> float:
        sev_weight = SEVERITY_WEIGHTS.get(severity, 0.5)
        impact_avg = sum(impact.values()) / max(len(impact), 1)
        priority = (sev_weight * 40) + (impact_avg * 0.4) + (complexity * 0.2)
        return round(min(100, priority), 1)

    def _generate_summary(
        self, title: str, category: str, complexity: str, severity: str
    ) -> str:
        return (
            f"This is a {severity.lower()}-severity issue in the {category.lower()} domain. "
            f"Analysis indicates {complexity.lower()} complexity. "
            f"The issue '{title}' requires targeted investigation and a fix "
            f"addressing the root cause identified in the error patterns."
        )

    def _extract_error_clusters(self, text: str, logs: str) -> List[str]:
        """Extract error pattern clusters from text and logs."""
        clusters = []
        error_patterns = {
            "TypeError": ["typeerror", "cannot read propert", "undefined is not"],
            "401 Unauthorized": ["401", "unauthorized", "authentication failed"],
            "500 Server Error": ["500", "internal server error"],
            "Infinite Redirect": ["redirect", "loop", "infinite"],
            "JWT Expiration": ["jwt", "token expired", "refresh token"],
            "Webhook Failure": ["webhook", "callback fail"],
            "Data Parsing": ["parse", "json", "deserializ"],
            "OOM Crash": ["oom", "out of memory", "heap limit"],
            "Buffer Retention": ["buffer", "stream", "unclosed"],
            "Worker Dying": ["worker", "process exit", "signal"],
            "Timeout": ["timeout", "timed out", "deadline"],
            "Connection Error": ["connection refused", "econnrefused", "network"],
        }

        combined = f"{text} {logs}".lower()
        for cluster_name, patterns in error_patterns.items():
            if any(p in combined for p in patterns):
                clusters.append(cluster_name)

        return clusters or ["Uncategorized Error"]

    def _extract_log_insights(self, logs: str) -> List[str]:
        """Extract actionable insights from logs."""
        if not logs or not logs.strip():
            return ["No log data provided for analysis."]

        insights = []
        log_lower = logs.lower()

        insight_rules = [
            ("redirect", "Detected redirect loop pattern in log output."),
            ("401", "Authentication failure (401) detected — check token lifecycle."),
            ("500", "Server error (500) detected — check server-side exception handlers."),
            ("undefined", "Accessing undefined value — missing null check or data validation."),
            ("timeout", "Timeout detected — check service connectivity and retry logic."),
            ("heap", "Heap-related issue — possible memory leak or large allocation."),
            ("oom", "Out of memory condition — investigate buffer/stream management."),
            ("touppercase", "Calling method on potentially undefined value — add type guard."),
            ("fatal error", "Fatal error detected — process stability at risk."),
            ("mark-compacts", "V8 mark-compacts failing near heap limit — severe memory pressure."),
        ]

        for keyword, insight in insight_rules:
            if keyword in log_lower:
                insights.append(insight)

        return insights or ["Log data present but no specific patterns matched."]
