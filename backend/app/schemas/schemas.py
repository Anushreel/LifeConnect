from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import List, Optional, Union

# Base schemas for creation and reading data
class SensorBase(BaseModel):
    device_id: int
    timestamp: datetime
    temparature: Optional[float] = None
    heart_rate: Optional[float] = None
    humidity: Optional[float] = None
    ecg: Optional[float] = None

class UserBase(BaseModel):
    username: str
    full_name: str
    dob: datetime
    gender: str
    height: float
    weight: float
    bloodgroup: Optional[str] = None
    email: EmailStr
    phno: int
    # managerid: Optional[int] = None
    is_admin: Optional[bool]=False
    is_active: bool = True

class DeviceBase(BaseModel):
    thingspeak_channel_id: int
    user_id: int
    is_active: bool = True

class PredictionBase(BaseModel):
    reading_id: int
    health_status: str
    confidence: float

# Create schemas (used for creating new instances)
class SensorCreate(SensorBase):
    pass

class UserCreate(UserBase):
    password: str  # Plain password for creation, will be hashed

class DeviceCreate(DeviceBase):
    pass

class PredictionCreate(PredictionBase):
    pass

# Read schemas (used for responses)
class Prediction(PredictionBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

class Sensor(SensorBase):
    id: int
    prediction: Optional[Prediction] = None
    
    class Config:
        from_attributes = True

class Device(DeviceBase):
    sensor_reading: List[Sensor] = []
    
    class Config:
        from_attributes = True

class User(UserBase):
    uid: int
    devices: List[Device] = []
    
    class Config:
        from_attributes = True

# Update schemas (for partial updates)
class SensorUpdate(BaseModel):
    device_id: Optional[int] = None
    timestamp: Optional[datetime] = None
    temparature: Optional[float] = None
    heart_rate: Optional[float] = None
    humidity: Optional[float] = None
    ecg: Optional[float] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    dob: Optional[datetime] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    bloodgroup: Optional[str] = None
    email: Optional[EmailStr] = None
    phno: Optional[int] = None
    managerid: Optional[int] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None  # To update password

class DeviceUpdate(BaseModel):
    user_id: Optional[int] = None
    is_active: Optional[bool] = None

class PredictionUpdate(BaseModel):
    health_status: Optional[str] = None
    confidence: Optional[float] = None