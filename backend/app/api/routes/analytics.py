"""Analytics routes — dashboard stats."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import AnalyticsDashboard
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=AnalyticsDashboard)
async def get_dashboard(db: Session = Depends(get_db)):
    return AnalyticsService.get_dashboard(db)
