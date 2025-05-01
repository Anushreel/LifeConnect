from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.database.crud import (
    get_devices_for_user,
    get_device,
    create_device
)
from app.schemas.device import Device, DeviceBase
from app.api.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=Device)
def create_device_endpoint(
    device: DeviceBase,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    """Create a new device"""
    db_device = create_device(db, device.dict(), current_user.uid)
    if not db_device:
        raise HTTPException(status_code=404, detail="User not found")
    return db_device

# @router.get("/user/{user_id}", response_model=List[Device])
# def get_devices_for_user_endpoint(
#     user_id: int,
#     current_user = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get all devices for a specific user"""
#     # Authorization check
#     if current_user.uid != user_id and not current_user.is_admin:
#         raise HTTPException(status_code=403, detail="Not authorized to access this user's devices")
        
#     devices = get_devices_for_user(db, user_id)
#     return devices


# @router.get("/{device_ts_id}", response_model=Device)
# def get_device_endpoint(
#     thingspeak_channel_id: str,
#     current_user = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get a specific device"""
#     device = get_device(db, thingspeak_channel_id)
#     authorized = False
#     for user in device.users:
#         if user.uid == current_user.uid:
#             authorized = True
#             break
#     if not authorized and not current_user.is_admin:
#         raise HTTPException(status_code=403, detail="Not authorized")
    
#     if not device:
#         raise HTTPException(status_code=404, detail="Device not found")
        
#     # # For many-to-many relationships, check if current user is associated with device
#     # user_ids = [user.uid for user in device.user]
#     # if current_user.uid not in user_ids and not current_user.is_admin:
#     #     raise HTTPException(status_code=403, detail="Not authorized to access this device")
        
#     return device