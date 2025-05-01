from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta,timezone
from app.database.database import get_db
from app.database.crud import get_sensor_readings_for_user
# from app.database.crud import (
#     get_sensor_readings_for_user,
#     get_sensor_readings_for_device,
#     get_latest_sensor_reading,
#     get_device,
#     get_sensor_readings_for_user_device
# )
from app.schemas.sensor import SensorReadingOut, SensorReadingWithPrediction
from app.api.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/user/{user_id}", response_model=List[SensorReadingWithPrediction])
def get_readings_for_user(
    user_id: int,
    days: Optional[int] = 7,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get sensor readings for a specific user"""
    # Check authorization (user can only see their own data)
    if current_user.uid != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")
    since_date = datetime.now(timezone.utc) - timedelta(days=days)
    if(days==0): since_date=None
    readings = get_sensor_readings_for_user(db, user_id, since_date)
    return readings

# @router.get("/user/{user_id}/{device_ts_id}", response_model=List[SensorReadingWithPrediction])
# def get_readings_for_user_device(
#     user_id: int,
#     device_ts_id: str,
#     days: Optional[int] = 7,
#     current_user = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get sensor readings for a specific user and device"""
#     # Check authorization (user can only see their own data)
#     if current_user.uid != user_id and not current_user.is_admin:
#         raise HTTPException(status_code=403, detail="Not authorized to access this user's data")
        
#     since_date = datetime.now(timezone.utc) - timedelta(days=days)
#     # Fix: Pass all three parameters instead of just since_date
#     readings = get_sensor_readings_for_user_device(db, user_id, device_ts_id, since_date)
#     return readings

# @router.get("/device/{device_ts_id}", response_model=List[SensorReadingWithPrediction])
# def get_readings_for_device(
#     device_ts_id: str,
#     days: Optional[int] = 7,
#     current_user = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get sensor readings for a specific device"""
#     # Verify user has access to the device
#     # Implementation of get_device in crud.py
#     device = get_device(db, device_ts_id)
#     if not device:
#         raise HTTPException(status_code=404, detail="Device not found")
        
#     if device.user_id != current_user.uid and not current_user.is_admin:
#         raise HTTPException(status_code=403, detail="Not authorized to access this device's data")
        
#     since_date = datetime.now(timezone.utc) - timedelta(days=days)
#     readings = get_sensor_readings_for_device(db, device_ts_id, since_date)
#     return readings

# @router.get("/device/{device_ts_id}/latest", response_model=SensorReadingWithPrediction)
# def get_latest_reading_for_device(
#     device_ts_id: str,
#     current_user = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get the latest sensor reading for a specific device"""
#     # Verify user has access to the device
#     device = get_device(db, device_ts_id)
#     if not device:
#         raise HTTPException(status_code=404, detail="Device not found")
        
#     if device.user_id != current_user.uid and not current_user.is_admin:
#         raise HTTPException(status_code=403, detail="Not authorized to access this device's data")
        
#     reading = get_latest_sensor_reading(db, device_ts_id)
#     if not reading:
#         raise HTTPException(status_code=404, detail="No readings found for this device")
        
#     return reading