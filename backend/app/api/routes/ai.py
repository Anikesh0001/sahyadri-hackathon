"""AI routes — analysis and developer matching."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import AIAnalysisRequest, AIAnalysisResponse, DeveloperResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI"])

ai_service = AIService()


@router.post("/analyze-bug", response_model=AIAnalysisResponse)
async def analyze_bug(req: AIAnalysisRequest, db: Session = Depends(get_db)):
    result = ai_service.analyze_bug(db, req.bugId)
    if not result:
        raise HTTPException(status_code=404, detail="Bug not found")
    return result


@router.get("/match-developers/{bug_id}", response_model=List[DeveloperResponse])
async def match_developers(bug_id: str, db: Session = Depends(get_db)):
    matches = ai_service.match_developers(db, bug_id)
    if not matches:
        raise HTTPException(status_code=404, detail="Bug not found or no developers available")
    return matches
