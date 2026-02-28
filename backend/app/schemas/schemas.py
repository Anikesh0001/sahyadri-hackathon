"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------

class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "User"  # "User" | "Developer" | "Admin"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatarUrl: Optional[str] = None
    reputation: float = 0.0

    class Config:
        from_attributes = True


# ---------- Bug ----------

class BugCreate(BaseModel):
    title: str
    description: str
    repoLink: Optional[str] = ""
    logs: Optional[str] = ""
    tags: List[str] = []
    severity: str = "Medium"
    expectedBehavior: Optional[str] = ""


class BugStatusUpdate(BaseModel):
    status: str


class BugResponse(BaseModel):
    id: str
    title: str
    description: str
    repoLink: str = ""
    logs: Optional[str] = ""
    tags: List[str] = []
    severity: str
    expectedBehavior: Optional[str] = ""
    status: str
    createdAt: str
    bounty: float = 0.0
    fundsRaised: float = 0.0
    contributors: int = 0
    authorId: str
    assignedDeveloperId: Optional[str] = None
    aiScore: Optional[float] = None

    class Config:
        from_attributes = True


# ---------- Developer ----------

class DeveloperResponse(BaseModel):
    id: str
    name: str
    skills: List[str] = []
    successRate: float = 0.0
    bugsResolved: int = 0
    avatarUrl: Optional[str] = None
    matchScore: Optional[float] = None

    class Config:
        from_attributes = True


# ---------- AI Analysis ----------

class ImpactScore(BaseModel):
    userImpact: float
    severity: float
    urgency: float
    popularity: float


class AIAnalysisResponse(BaseModel):
    bugId: str
    category: str
    complexity: str
    estimatedBounty: float
    confidenceScore: float
    impactScore: ImpactScore
    nlpSummary: str
    errorClusters: List[str] = []
    logInsights: List[str] = []


class AIAnalysisRequest(BaseModel):
    bugId: str


# ---------- Funding ----------

class FundingCreate(BaseModel):
    contributor_name: str
    amount: float


class FundingResponse(BaseModel):
    id: int
    bug_id: str
    contributor_name: str
    amount: float

    class Config:
        from_attributes = True


class FundingSummary(BaseModel):
    bug_id: str
    total_funded: float
    contributors: int
    fundings: List[FundingResponse] = []


# ---------- Fix Verification ----------

class FixVerificationRequest(BaseModel):
    bugId: str
    developerId: str
    prLink: str


class FixVerificationResponse(BaseModel):
    bugId: str
    developerId: str
    prLink: str
    similarityScore: float
    passed: bool
    diffSummary: str


# ---------- Analytics ----------

class AnalyticsDashboard(BaseModel):
    totalBugs: int
    resolvedBugs: int
    resolvedPercentage: float
    totalFunding: float
    averageBounty: float
    bugsBySeverity: dict
    bugsByStatus: dict
    topDevelopers: List[DeveloperResponse] = []
    recentBugs: List[BugResponse] = []
