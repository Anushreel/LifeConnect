from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.schemas.device import DeviceBase
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    dob: datetime
    gender: str
    height: float
    weight: float
    blood_group: str
    phno: str
    is_admin: Optional[bool]=False

    class Config:
        # orm_mode = True
        from_attributes=True


class UserCreate(UserBase):
    password: str

class User(UserBase):
    uid: int
    is_active: bool
    
    class Config:
        from_attributes = True

class UserWithDevices(User):
    devices: List[DeviceBase] = []
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None