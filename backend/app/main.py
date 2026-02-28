"""
CrowdfundFix — AI Powered Bug Intelligence & Fix Prediction Engine (AIBFE)

Main FastAPI application entry point.
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

logger = logging.getLogger("crowdfundfix")
logging.basicConfig(
    level=logging.INFO if settings.is_production else logging.DEBUG,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
from app.core.database import create_tables, SessionLocal
from app.utils.seed import seed_database

# Import route modules
from app.api.routes import auth, bugs, ai, funding, verification, analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: create tables + seed data
    create_tables()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} is running!")
    yield
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI Powered Bug Intelligence & Fix Prediction Engine",
    lifespan=lifespan,
)

# ---------- CORS ----------
# Collect allowed origins: local dev + Vercel + env override
_allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in _allowed_origins:
    _allowed_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Routes ----------
API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(bugs.router, prefix=API_PREFIX)
app.include_router(ai.router, prefix=API_PREFIX)
app.include_router(funding.router, prefix=API_PREFIX)
app.include_router(verification.router, prefix=API_PREFIX)
app.include_router(analytics.router, prefix=API_PREFIX)


@app.get("/")
async def root():
    return {
        "status": "CrowdfundFix API running",
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "ok",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


# ---------- Logging Middleware ----------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 1)
    logger.info(f"{request.method} {request.url.path} — {response.status_code} ({duration}ms)")
    return response
