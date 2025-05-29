from fastapi import APIRouter

from app.api.endpoints import users, devices, sensors, predictions, auth,tasks,notifications

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["authentication"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"]
)

api_router.include_router(
    devices.router,
    prefix="/devices",
    tags=["devices"]
)

api_router.include_router(
    sensors.router,
    prefix="/sensors",
    tags=["sensors"]
)

api_router.include_router(
    predictions.router,
    prefix="/predictions",
    tags=["predictions"]
)

api_router.include_router(
    tasks.router, 
    prefix="/tasks", 
    tags=["tasks"]
) 

api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"]
)