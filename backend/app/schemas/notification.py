from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class NotificationBase(BaseModel):
    severity: str
    

class NotificationCreate(NotificationBase):
    user_id: int
    prediction_id: Optional[int] = None

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None
    
class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    prediction_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationsList(BaseModel):
    notifications: List[NotificationResponse]
    total: int
    unread: int

    class Config:
        from_attributes = True