from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    task_des: str
    task_status: str = "Not Done"  # Default status

class TaskCreate(TaskBase):
    u_id: int

class TaskUpdate(BaseModel):
    task_des: Optional[str] = None
    task_status: Optional[str] = None

class TaskInDB(TaskBase):
    task_id: int
    u_id: int

    class Config:
        from_attributes = True

class Task(TaskInDB):
    pass