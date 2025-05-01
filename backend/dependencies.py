from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.thingspeak import ThingSpeakService
from app.services.prediction import HealthPredictor
from app.api.endpoints.auth import get_current_user

def get_thingspeak_service():
    """Dependency for ThingSpeak service"""
    return ThingSpeakService()

def get_health_predictor():
    """Dependency for health prediction service"""
    return HealthPredictor()

def get_current_active_user(current_user = Depends(get_current_user)):
    """Dependency to get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user