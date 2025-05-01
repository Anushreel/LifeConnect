from pydantic import BaseModel
from typing import Optional,List

class DeviceBase(BaseModel):
    thingspeak_channel_id: Optional[str]="2771512"
    thingspeak_read_api_key: Optional[str]="TDAOWY27LQ0YE4H0"

    class Config:
        from_attributes = True

# class DeviceCreate(DeviceBase):
#     user_ids: List[int]

class UserInfo(BaseModel):
    uid: int
    username: str
    full_name: str
    
    class Config:
        from_attributes = True

class Device(DeviceBase):
    is_active: bool
    users: List[UserInfo] = []
    
    class Config:
        from_attributes = True