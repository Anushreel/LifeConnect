from sqlalchemy.orm import Session
from app.database import crud
from app.schemas.notification import NotificationCreate
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    """Service for handling notification logic."""
    
    @staticmethod
    def create_health_alert(
        db: Session, 
        user_id: int, 
        prediction_id: int, 
        health_status: str, 
        reading_value: float,
        parameter_type: str
    ):
        """
        Create a health alert notification based on prediction results.
        
        Args:
            db: Database session
            user_id: ID of the user to notify
            prediction_id: ID of the health prediction
            health_status: Status from the prediction (e.g., "normal", "warning", "critical")
            reading_value: The value of the health reading
            parameter_type: Type of health parameter (e.g., "heart_rate", "temperature")
        
        Returns:
            Created notification or None if error
        """
        try:
            # Define severity and message based on health status
            severity = health_status.lower()
            
            # Create appropriate message based on parameter type and severity
            message = NotificationService._generate_message(
                parameter_type, 
                health_status, 
                reading_value
            )
            
            # Create notification object
            notification_data = NotificationCreate(
                user_id=user_id,
                prediction_id=prediction_id,
                message=message
            )
            
            # Save to database
            return crud.create_notification(db, notification_data)
            
        except Exception as e:
            logger.error(f"Failed to create health alert notification: {str(e)}")
            return None
    
    @staticmethod
    def _generate_message(parameter_type: str, health_status: str, value: float) -> str:
        """Generate appropriate notification message based on parameters."""
        if health_status.lower() == "critical":
            return f"CRITICAL ALERT: Your {parameter_type} reading of {value} requires immediate attention!"
        
        elif health_status.lower() == "warning":
            return f"Warning: Your {parameter_type} reading of {value} is abnormal."
        
        elif health_status.lower() == "normal":
            return f"Your {parameter_type} reading of {value} is within normal range."
        
        else:
            return f"Health update: Your {parameter_type} reading is {value}."
    
    @staticmethod
    def notify_admin_of_critical_readings(
        db: Session, 
        user_id: int,
        user_name: str,
        prediction_id: int,
        parameter_type: str,
        reading_value: float
    ):
        """
        Notify system administrators about critical health readings.
        
        Args:
            db: Database session
            user_id: ID of the user with critical reading
            user_name: Name of the user with critical reading
            prediction_id: ID of the health prediction
            parameter_type: Type of health parameter
            reading_value: The value of the health reading
        """
        try:
            # Find admin users
            admin_users = crud.get_admin_users(db)
            
            # Create a notification for each admin
            for admin in admin_users:
                message = f"ADMIN ALERT: User {user_name} (ID: {user_id}) has a critical {parameter_type} reading of {reading_value}."
                
                notification_data = NotificationCreate(
                    user_id=admin.uid,
                    prediction_id=prediction_id,
                    message=message
                )
                
                crud.create_notification(db, notification_data)
                
            return True
            
        except Exception as e:
            logger.error(f"Failed to notify admins of critical reading: {str(e)}")
            return False