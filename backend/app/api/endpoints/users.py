from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.database.crud import get_user, get_user_by_email,assign_device_to_user,get_all_user
from app.schemas.user import User, UserWithDevices
from app.api.endpoints.auth import get_current_user

router = APIRouter()
@router.get("/all",response_model=List[User])
def all_users(db: Session = Depends(get_db)):
    users= get_all_user(db)
    return users

@router.get("/me", response_model=User)
def read_users_me(current_user = Depends(get_current_user)):
    """Get the current authenticated user"""
    return current_user

@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific user"""
    # Authorization check
    if current_user.uid != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this user")
        
    db_user = get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/assigndevice")
def assign_device(user_id:int, device_id:str,db:Session=Depends(get_db)):
    assign_device_to_user(db, user_id, device_id)
    return {"message": f"Device {device_id} assigned to User {user_id}"}

# @router.get("/{user_id}/with-devices", response_model=UserWithDevices)
# def read_user_with_devices(
#     user_id: int,
#     current_user = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get a user with their devices"""
#     # Authorization check
#     if current_user.uid != user_id and not current_user.is_admin:
#         raise HTTPException(status_code=403, detail="Not authorized to access this user")
        
#     db_user = get_user(db, user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user