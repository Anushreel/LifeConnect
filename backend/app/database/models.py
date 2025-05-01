from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, Text,ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime,timezone
from .database import Base

class Sensor(Base):
    __tablename__ = "sensordata"

    id = Column(Integer, primary_key=True, index=True)
    thingspeak_channel_id = Column(String(50), ForeignKey("device.thingspeak_channel_id"))
    user_id = Column(Integer, ForeignKey("user.uid"))  # Track which user this reading belongs to
    timestamp = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    temperature = Column(Float, nullable=True)
    heart_rate = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    ecg = Column(Float, nullable=True)
    
    # Relationships
    device = relationship("Device", back_populates="sensor_readings")
    user = relationship("User", back_populates="sensor_readings")  # Direct relationship to user
    prediction = relationship("Prediction", back_populates="sensor_reading", uselist=False,cascade="all, delete")


class User(Base):
    __tablename__ = "user"

    uid = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String(50), unique=True, index=True)
    full_name = Column(String(100))
    dob = Column(DateTime, nullable=False)
    gender = Column(String(10))
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    blood_group = Column(String(5))
    email = Column(String(50), unique=True)
    phno = Column(String(15), unique=True)
    is_admin = Column(Boolean, default=False)
    hashed_password = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    devices = relationship("Device", secondary="user_device", back_populates="users")
    sensor_readings = relationship("Sensor", back_populates="user")  # Direct access to readings


class Device(Base):
    __tablename__ = "device"
    thingspeak_channel_id = Column(String(50), primary_key=True, index=True)
    thingspeak_read_api_key=Column(String(50))
    is_active = Column(Boolean, default=True)

    # Relationships
    users = relationship("User", secondary="user_device", back_populates="devices")
    sensor_readings = relationship("Sensor", back_populates="device")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    reading_id = Column(Integer, ForeignKey("sensordata.id",ondelete='CASCADE'), unique=True)
    prediction_timestamp = Column(DateTime, default=datetime.now(timezone.utc))
    health_status = Column(String(50))  # e.g., "normal", "warning", "critical"
    result = Column(Float) 

    
    # Relationships
    sensor_reading = relationship("Sensor", back_populates="prediction")

# Association table for the many-to-many relationship between User and Device
user_device = Table(
    "user_device",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("user.uid"), primary_key=True),
    Column("device_id", String(50), ForeignKey("device.thingspeak_channel_id"), primary_key=True)
)

