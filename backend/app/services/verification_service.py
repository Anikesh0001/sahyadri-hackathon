"""Verification service — simulated fix verification."""

import random
import hashlib
from typing import Dict, Any


class VerificationService:

    @staticmethod
    def verify_fix(bug_id: str, developer_id: str, pr_link: str) -> Dict[str, Any]:
        """
        Simulate PR diff analysis and fix verification.

        Uses heuristic scoring based on:
        - PR link hash (deterministic per-link)
        - Random variation to simulate real-world variance
        """
        # Deterministic seed from PR link for consistent results
        seed = int(hashlib.md5(pr_link.encode()).hexdigest()[:8], 16)
        rng = random.Random(seed)

        # Simulate similarity score (60-99%)
        similarity_score = round(rng.uniform(60.0, 99.0), 1)

        # Pass if similarity > 75%
        passed = similarity_score > 75.0

        # Generate diff summary
        lines_changed = rng.randint(5, 200)
        files_changed = rng.randint(1, 15)

        diff_summaries = [
            f"Modified {files_changed} files with {lines_changed} line changes.",
            f"Key changes in error handling and validation logic.",
            f"Added unit tests covering the reported scenario.",
            f"Refactored affected module for better error isolation.",
        ]
        diff_summary = " ".join(rng.sample(diff_summaries, k=min(3, len(diff_summaries))))

        return {
            "bugId": bug_id,
            "developerId": developer_id,
            "prLink": pr_link,
            "similarityScore": similarity_score,
            "passed": passed,
            "diffSummary": diff_summary,
        }
