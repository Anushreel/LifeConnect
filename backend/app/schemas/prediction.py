from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime

class HealthPredictionBase(BaseModel):
    prediction_timestamp: datetime
    health_status: str
    result: float


class HealthPredictionCreate(HealthPredictionBase):
    reading_id: int

class HealthPredictionOut(HealthPredictionBase):
    id: int
    reading_id: int
    
    class Config:
        # orm_mode = True
        from_attributes=True


class HealthStatusSummary(BaseModel):
    total_predictions: int
    status_distribution: Dict[str, int]
    average_risk_score: float
    health_percentage:float
    latest_status: str
    latest_risk_score: float