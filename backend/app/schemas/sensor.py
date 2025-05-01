from pydantic import BaseModel
from typing import Dict, Optional, List, Any,ForwardRef
from datetime import datetime

class SensorReadingBase(BaseModel):
    thingspeak_channel_id: Optional[str]="2771512"
    timestamp: datetime
    temperature: Optional[float] = None
    heart_rate: Optional[float] = None
    humidity: Optional[float] = None
    ecg: Optional[float] = None


class SensorReadingCreate(SensorReadingBase):
    pass

class SensorReadingOut(SensorReadingBase):
    id: int
    
    class Config:
        from_attributes = True

class HealthPredictionBase(BaseModel):
    prediction_timestamp: datetime
    health_status: str
    result: float


class HealthPredictionOut(HealthPredictionBase):
    id: int
    reading_id: int
    
    class Config:
        from_attributes = True

HealthPredictionOutRef = ForwardRef("HealthPredictionOut")

class SensorReadingWithPrediction(SensorReadingOut):
    prediction: Optional["HealthPredictionOut"] = None  # Reference to prediction.py schema
    
    class Config:
        from_attributes = True