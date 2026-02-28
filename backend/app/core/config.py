"""Application configuration."""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "CrowdfundFix — AIBFE"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("ENVIRONMENT", "development") != "production"
    ENVIRONMENT: str = "development"

    # Database — use ./app.db for production safety
    DATABASE_URL: str = "sqlite:///./app.db"

    # JWT
    SECRET_KEY: str = "crowdfundfix-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "allow"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


settings = Settings()
