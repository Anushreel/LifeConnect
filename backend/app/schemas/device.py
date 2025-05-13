from pydantic import BaseModel
from typing import Optional,List
import os
from dotenv import load_dotenv

load_dotenv()
class DeviceBase(BaseModel):
    thingspeak_channel_id: Optional[str]=os.getenv("THINGSPEAK_CHANNEL_ID")
    thingspeak_read_api_key: Optional[str]=os.getenv("THINGSPEAK_READ_API_KEY")

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