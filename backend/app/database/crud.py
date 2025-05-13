from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.schemas.user import UserCreate,User

from app.database.models import User, Device, Sensor, Prediction,user_device,Task
import logging

logger = logging.getLogger(__name__)

# User operations
def get_all_user(db:Session):
    return db.query(User).all()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.uid == user_id).first()

def get_user_by_email(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    return user if user else None

def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    return user if user else None

def create_user(db: Session, user: UserCreate, hashed_password: str):
    try:
        db_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            dob=user.dob,
            gender=user.gender,
            height=user.height,
            weight=user.weight,
            blood_group=user.blood_group,
            phno=user.phno,
            is_admin=user.is_admin,
            hashed_password=hashed_password,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise

# Device operations
def get_device(db: Session, device_ts_id: str):
    return db.query(Device).filter(Device.thingspeak_channel_id == device_ts_id).first()

def get_devices_for_user(db: Session, user_id: int):
    return db.query(Device).join(
        user_device, user_device.c.device_id == Device.thingspeak_channel_id
    ).filter(user_device.c.user_id == user_id).all()

def get_all_active_devices(db: Session):
    return db.query(Device).filter(Device.is_active == True).all()

# def create_device(db: Session, device_data: Dict[str, Any],user_id:int):
#     db_device = Device(**device_data)

#     user = db.query(User).filter(User.uid == user_id).first()
#     if not user:
#         return None
    
#     # Add user to device's users list
#     db_device.users.append(user)

#     db.add(db_device)
#     db.commit()
#     db.refresh(db_device)
#     return db_device

def create_device(db: Session, device_data: Dict[str, Any],user_id:int):
    db_device = Device(**device_data)

    user = db.query(User).filter(User.uid == user_id).first()
    if not user:
        return None
    
    # Add user to device's users list
    db_device.users.append(user)

    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def assign_device_to_user(db: Session, user_id: int, device_ts_id: str):
    user = db.query(User).filter(User.uid == user_id).first()
    device = db.query(Device).filter(Device.thingspeak_channel_id == device_ts_id).first()

    if user and device:
        db.execute(user_device.insert().values(user_id=user_id, device_id=device_ts_id))
        db.commit()

# Sensor reading operations
def create_sensor_reading(db: Session, reading_data: Dict[str, Any]):
    """Create a new sensor reading with user_id"""
    try:
        db_reading = Sensor(**reading_data)
        db.add(db_reading)
        db.commit()
        db.refresh(db_reading)
        return db_reading
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating sensor reading: {str(e)}")
        raise

# # just in case u want all the readings frm the device irrespective of user
# def get_sensor_readings_for_device(db: Session, device_ts_id: str, since_date: Optional[datetime] = None):
#     query = db.query(Sensor).filter(Sensor.thingspeak_channel_id == device_ts_id)
#     if since_date:
#         query = query.filter(Sensor.timestamp >= since_date)
#     return query.order_by(desc(Sensor.timestamp)).all()

# Get sensor readings for a specific user
def get_sensor_readings_for_user(db: Session, user_id: int, since_date: Optional[datetime] = None):
    """Get sensor readings for a specific user"""
    query = db.query(Sensor).filter(Sensor.user_id == user_id)
    if since_date:
        query = query.filter(Sensor.timestamp >= since_date)
    return query.order_by(desc(Sensor.timestamp)).all()

# # Get sensor readings for a specific device and user
# def get_sensor_readings_for_user_device(db: Session, user_id: int, device_ts_id: str, since_date: Optional[datetime] = None):
#     """Get sensor readings for a specific device and user"""
#     query = db.query(Sensor).filter(
#         Sensor.user_id == user_id,
#         Sensor.thingspeak_channel_id == device_ts_id
#     )
#     if since_date:
#         query = query.filter(Sensor.timestamp >= since_date)
    # return query.order_by(desc(Sensor.timestamp)).all()

# latest reading from a device
def get_latest_sensor_reading(db: Session, device_ts_id: str):
    return db.query(Sensor).filter(
        Sensor.thingspeak_channel_id == device_ts_id
    ).order_by(desc(Sensor.timestamp)).first()

# Health prediction operations
def create_health_prediction(db: Session, prediction_data: Dict[str, Any]):
    db_prediction = Prediction(**prediction_data)
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_predictions_for_user(db: Session, user_id: int, since_date: Optional[datetime] = None):
    query = db.query(Prediction).join(
        Sensor, Prediction.reading_id == Sensor.id
    ).filter(
        Sensor.user_id==user_id
    )
    
    if since_date:
        query = query.filter(Prediction.prediction_timestamp >= since_date)
    
    return query.order_by(desc(Prediction.prediction_timestamp)).all()

def get_predictions_for_user_device(db: Session, user_id: int, since_date: Optional[datetime] = None):
    query = db.query(Prediction).join(
        Sensor, Prediction.reading_id == Sensor.id
    ).join(
        Device, Sensor.thingspeak_channel_id == Device.thingspeak_channel_id
    ).filter(
        (Sensor.user_id == user_id) & (Device.users.any(User.uid == user_id))
    )
    
    if since_date:
        query = query.filter(Prediction.prediction_timestamp >= since_date)
    
    return query.order_by(desc(Prediction.prediction_timestamp)).all()

def get_latest_prediction_for_user(db: Session, user_id: int):
    # Get the latest prediction for a user across all their devices
    return db.query(Prediction).join(
        Sensor, Prediction.reading_id == Sensor.id
    ).join(
        Device, Sensor.thingspeak_channel_id == Device.thingspeak_channel_id
    ).filter(
        Sensor.user_id == user_id
    ).order_by(desc(Prediction.prediction_timestamp)).first()

def get_active_user_for_device(db: Session, device_ts_id: str):
    """Get the active user associated with a device"""
    return db.query(User).join(
        user_device, User.uid == user_device.c.user_id
    ).filter(
        user_device.c.device_id == device_ts_id,
        User.is_active == True
    ).first()

def set_user_active_status(db: Session, user_id: int, is_active: bool):
    """Set the active status of a user"""
    try:
        # If setting a user to active, first get their associated devices
        if is_active:
            # Get all devices associated with this user
            devices = get_devices_for_user(db, user_id)
            device_ids = [device.thingspeak_channel_id for device in devices]
            
            # Deactivate all other users who are associated with these devices
            for device_id in device_ids:
                # Find all users associated with this device
                device_users = db.query(User).join(
                    user_device, User.uid == user_device.c.user_id
                ).filter(
                    user_device.c.device_id == device_id,
                    User.uid != user_id  # Exclude the current user
                ).all()
                
                # Deactivate these users
                for other_user in device_users:
                    other_user.is_active = False
                    db.add(other_user)
                db.commit() ####
        
        # Update the target user's status
        user = db.query(User).filter(User.uid == user_id).first()
        if user:
            user.is_active = is_active
            db.add(user)
            db.commit()
            return True
        return False
    except Exception as e:
        db.rollback()
        logger.error(f"Error setting user active status: {str(e)}")
        return False
    
# task operations
def create_task(db: Session,task_data: Dict[str,Any]):
    '''Create tasks for a user'''
    try:
        db_task=Task(**task_data)
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating task {e}")
        raise

def get_tasks_of_user(db: Session, user_id:int):
    return db.query(Task).filter(Task.u_id==user_id)

def delete_task(db: Session, task_id=int):
    '''Delete task by it's ID'''
    try:
        task=db.query(Task).filter(Task.task_id==task_id).first()
        if task:
            db.delete(task)
            db.commit()
            return True
        return False
    except Exception as e:
        db.rollback()
        logger.error(f"Couldn't delete task{e}")
        return False
    
def modify_task(db:Session,task_id:int, updated_data: Dict[str,Any]):
    try:
        task=db.query(Task).filter(Task.task_id==task_id).first()
        if not task:
            return None
            
        for key, value in updated_data.items():
            setattr(task, key, value)
            
        db.add(task)
        db.commit()
        db.refresh(task)
        return task
    except Exception as e:
        db.rollback()
        logger.error(f"Error modifying task: {str(e)}")
        raise

def mark_as_done(db:Session,task_id:int):
    try:
        task=db.query(Task).filter(Task.task_id==task_id).first()
        if not task:
            return None
        task.task_status="Done"
        db.add(task)
        db.commit()
        db.refresh(task)
        return task
    except Exception as e:
        db.rollback()
        logger.error(f"couldn't update status of the task {e}")
        raise

def get_task_by_id(db: Session, task_id: int):
    """Get a specific task by ID"""
    return db.query(Task).filter(Task.task_id == task_id).first()