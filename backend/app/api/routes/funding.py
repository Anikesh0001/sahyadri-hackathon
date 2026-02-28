"""Funding routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import FundingCreate, FundingSummary, FundingResponse
from app.services.funding_service import FundingService

router = APIRouter(prefix="/fund", tags=["Funding"])


@router.post("/{bug_id}", response_model=FundingResponse)
async def fund_bug(bug_id: str, req: FundingCreate, db: Session = Depends(get_db)):
    funding = FundingService.add_funding(
        db=db,
        bug_id=bug_id,
        contributor_name=req.contributor_name,
        amount=req.amount,
    )
    if not funding:
        raise HTTPException(status_code=404, detail="Bug not found")
    return FundingResponse(
        id=funding.id,
        bug_id=funding.bug_id,
        contributor_name=funding.contributor_name,
        amount=funding.amount,
    )


@router.get("/{bug_id}", response_model=FundingSummary)
async def get_funding(bug_id: str, db: Session = Depends(get_db)):
    result = FundingService.get_fundings_for_bug(db, bug_id)
    return FundingSummary(
        bug_id=result["bug_id"],
        total_funded=result["total_funded"],
        contributors=result["contributors"],
        fundings=[
            FundingResponse(
                id=f.id,
                bug_id=f.bug_id,
                contributor_name=f.contributor_name,
                amount=f.amount,
            )
            for f in result["fundings"]
        ],
    )
