"""Application configuration."""
import os
from functools import lru_cache
 
from pydantic_settings import BaseSettings
 
 
class Settings(BaseSettings):
    """Application settings from environment variables."""
 
    app_name: str = "XAIO API"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8080
 
    # Database
    DATABASE_URL: str
 
    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
 
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
 
 
@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()