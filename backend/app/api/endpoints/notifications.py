from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List,Optional
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database import crud
from app.schemas.notification import NotificationCreate, NotificationResponse, NotificationUpdate, NotificationsList
from app.api.endpoints.auth import get_current_user
from app.schemas.user import User

router = APIRouter()

@router.get("/", response_model=NotificationsList)
def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all notifications for the current user.
    """
    notifications = crud.get_user_notifications(db, current_user.uid, skip, limit)
    total_count = crud.get_notification_count(db, current_user.uid)
    unread_count = crud.get_unread_notification_count(db, current_user.uid)
    
    return NotificationsList(
        notifications=notifications,
        total=total_count,
        unread=unread_count
    )

@router.get("/unread-count", response_model=int)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the count of unread notifications for the current user.
    """
    return crud.get_unread_notification_count(db, current_user.uid)

@router.get("/{notification_id}", response_model=NotificationResponse)
def get_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific notification by ID.
    """
    notification = crud.get_notification(db, notification_id)
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification.user_id != current_user.uid and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this notification")
    
    return notification

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a notification as read.
    """
    notification = crud.get_notification(db, notification_id)
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification.user_id != current_user.uid and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this notification")
    
    return crud.mark_notification_as_read(db, notification_id)

@router.post("/mark-all-read", response_model=int)
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark all notifications as read for the current user.
    Returns the number of notifications marked as read.
    """
    return crud.mark_all_notifications_as_read(db, current_user.uid)

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a notification.
    """
    notification = crud.get_notification(db, notification_id)
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification.user_id != current_user.uid and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this notification")
    
    crud.delete_notification(db, notification_id)
    return None

# Admin specific endpoint for managing notifications
@router.get("/admin/all", response_model=List[NotificationResponse])
def get_all_notifications_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin endpoint to get all notifications in the system with filtering options.
    
    Parameters:
    - skip: Number of records to skip (pagination)
    - limit: Maximum number of records to return (pagination)
    - user_id: Optional filter by user ID
    - severity: Optional filter by severity level
    
    Returns:
    - List of notification objects
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access all notifications"
        )
    
    notifications = crud.get_all_notifications(
        db=db, 
        skip=skip, 
        limit=limit, 
        user_id=user_id, 
        severity=severity
    )
    
    return notifications