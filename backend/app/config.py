from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # General settings
    PROJECT_NAME: str = "Health Monitoring System"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # ThingSpeak
    THINGSPEAK_BASE_URL: str = "https://api.thingspeak.com"
    
    # Data processing
    DATA_PROCESSING_INTERVAL: int = 2  # Minutes
    
    class Config:
        case_sensitive = True
        from_attributes = True

settings = Settings()