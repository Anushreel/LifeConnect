from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta,timezone
import random
from app.database.database import get_db
from app.database.crud import get_predictions_for_user, get_latest_prediction_for_user
from app.schemas.prediction import HealthPredictionOut, HealthStatusSummary
from app.api.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/user/{user_id}", response_model=List[HealthPredictionOut])
def get_predictions_for_user_endpoint(
    user_id: int,
    days: Optional[int] = 7,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get health predictions for a specific user"""
    # Check authorization (user can only see their own data)
    if current_user.uid != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")
        
    since_date = datetime.now(timezone.utc) - timedelta(days=days)
    predictions = get_predictions_for_user(db, user_id, since_date)
    return predictions

@router.get("/user/{user_id}/latest", response_model=HealthPredictionOut)
def get_latest_prediction_for_user_endpoint(
    user_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the latest health prediction for a specific user"""
    # Check authorization (user can only see their own data)
    if current_user.uid != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")
        
    prediction = get_latest_prediction_for_user(db, user_id)
    if not prediction:
        raise HTTPException(status_code=404, detail="No predictions found for this user")
        
    return prediction

def map_result_to_percentage(result):
    if result == 1:  # Healthy
        return 100
    elif result == 2:  # Moderate
        return random.randint(60,80)
    else:  # Critical
        return 0
    
@router.get("/user/{user_id}/summary", response_model=HealthStatusSummary)
def get_health_summary_for_user(
    user_id: int,
    days: Optional[int] = 7,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a summary of health status for a specific user"""
    # Check authorization (user can only see their own data)
    if current_user.uid != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")
        
    since_date = datetime.now(timezone.utc) - timedelta(days=days)
    predictions = get_predictions_for_user(db, user_id, since_date)
    
    if not predictions:
        raise HTTPException(status_code=404, detail="No predictions found for this user")
    
    # Calculate statistics
    total_predictions = len(predictions)
    status_counts = {"Normal": 0, "Critical": 0, "moderate": 0}
    
    latest_prediction = predictions[0] if predictions else None
    avg_risk_score = 0
    
    total_percentage=0
    for prediction in predictions:
        status = prediction.health_status
        status_counts[status] = status_counts.get(status, 0) + 1
        avg_risk_score += prediction.result
        total_percentage += map_result_to_percentage(prediction.result)
    avg_risk_score = avg_risk_score / total_predictions if total_predictions > 0 else 0
    health_percentage = total_percentage / total_predictions if total_predictions > 0 else 0

    return {
        "total_predictions": total_predictions,
        "status_distribution": status_counts,
        "average_risk_score": avg_risk_score,
        "health_percentage": round(health_percentage, 2),
        "latest_status": latest_prediction.health_status if latest_prediction else "Unknown",
        "latest_risk_score": latest_prediction.result if latest_prediction else 0,
    }