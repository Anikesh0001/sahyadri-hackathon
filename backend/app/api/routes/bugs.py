"""Bug routes — CRUD operations."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import BugCreate, BugResponse, BugStatusUpdate
from app.services.bug_service import BugService
from app.dependencies import get_current_user

router = APIRouter(prefix="/bugs", tags=["Bugs"])


def _bug_to_response(bug) -> BugResponse:
    return BugResponse(
        id=bug.id,
        title=bug.title,
        description=bug.description,
        repoLink=bug.repo_link or "",
        logs=bug.logs or "",
        tags=bug.tags or [],
        severity=bug.severity.value if bug.severity else "Medium",
        expectedBehavior=bug.expected_behavior or "",
        status=bug.status.value if bug.status else "Open",
        createdAt=bug.created_at.isoformat() if bug.created_at else "",
        bounty=bug.bounty or 0.0,
        fundsRaised=bug.funds_raised or 0.0,
        contributors=bug.contributors or 0,
        authorId=bug.author_id,
        assignedDeveloperId=bug.assigned_developer_id,
        aiScore=bug.ai_priority_score,
    )


@router.post("", response_model=BugResponse)
async def create_bug(
    req: BugCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = BugService.create_bug(
        db=db,
        title=req.title,
        description=req.description,
        author_id=current_user.id,
        repo_link=req.repoLink or "",
        logs=req.logs or "",
        tags=req.tags,
        severity=req.severity,
        expected_behavior=req.expectedBehavior or "",
    )
    return _bug_to_response(bug)


@router.get("", response_model=List[BugResponse])
async def list_bugs(db: Session = Depends(get_db)):
    bugs = BugService.get_all_bugs(db)
    return [_bug_to_response(b) for b in bugs]


@router.get("/{bug_id}", response_model=BugResponse)
async def get_bug(bug_id: str, db: Session = Depends(get_db)):
    bug = BugService.get_bug_by_id(db, bug_id)
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")
    return _bug_to_response(bug)


@router.patch("/{bug_id}/status", response_model=BugResponse)
async def update_bug_status(
    bug_id: str,
    req: BugStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = BugService.update_bug_status(db, bug_id, req.status)
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")
    return _bug_to_response(bug)
