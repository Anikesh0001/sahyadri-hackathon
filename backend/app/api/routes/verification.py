"""Verification routes — simulated fix verification."""

from fastapi import APIRouter

from app.schemas.schemas import FixVerificationRequest, FixVerificationResponse
from app.services.verification_service import VerificationService

router = APIRouter(tags=["Verification"])


@router.post("/verify-fix", response_model=FixVerificationResponse)
async def verify_fix(req: FixVerificationRequest):
    result = VerificationService.verify_fix(
        bug_id=req.bugId,
        developer_id=req.developerId,
        pr_link=req.prLink,
    )
    return result
