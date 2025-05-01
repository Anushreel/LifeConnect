from datetime import datetime, timedelta, timezone
import logging
import asyncio
from sqlalchemy.orm import Session
from app.database.crud import get_all_active_devices, create_sensor_reading, get_latest_sensor_reading,get_active_user_for_device
from app.services.thingspeak import ThingSpeakService
from app.services.prediction import HealthPredictor
from app.config import settings

logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self, db: Session, thingspeak_client: ThingSpeakService, health_predictor: HealthPredictor):
        self.db = db
        self.thingspeak_client = thingspeak_client
        self.health_predictor = health_predictor
        
    async def process_device_data(self, device):
        """Process data for a single device"""
        try:
            # Get the latest reading timestamp for this device or default to 24 hours ago
            latest_reading = get_latest_sensor_reading(self.db, device.thingspeak_channel_id)
            since_datetime = latest_reading.timestamp if latest_reading else (
                datetime.now(timezone.utc) - timedelta(hours=24))
            
            # Fetch new data from ThingSpeak
            thingspeak_data_list = self.thingspeak_client.fetch_historical_data(
                device.thingspeak_channel_id, 
                device.thingspeak_read_api_key,
                since_datetime
            )
            
            # Process each data point
            for ts_data in thingspeak_data_list:
                # Skip if this timestamp already exists
                if latest_reading and ts_data["timestamp"] <= latest_reading.timestamp:
                    continue
                # Find the active user for this device
                active_user = get_active_user_for_device(self.db, device.thingspeak_channel_id)
                
                if active_user:
                    # Add device_id and user_id to each reading
                    reading_data = ts_data.copy()
                    reading_data["thingspeak_channel_id"] = device.thingspeak_channel_id
                    reading_data["user_id"] = active_user.uid
                    
                    # Save to database
                    sensor_reading = create_sensor_reading(self.db, reading_data)
                    
                    # Make health prediction for this reading
                    prediction = self.health_predictor.predict(active_user, sensor_reading, self.db)
                    
                    # Check if prediction indicates a critical condition
                    if prediction.health_status == "Critical":
                        await self.send_alert(active_user, sensor_reading, prediction)
                else:
                    logger.warning(f"No active user found for device {device.thingspeak_channel_id}. Skipping readings.")
            
            logger.info(f"Processed data for device {device.thingspeak_channel_id}")
            
        except Exception as e:
            logger.error(f"Error processing device {device.thingspeak_channel_id}: {str(e)}")
    
    async def send_alert(self, user, sensor_reading, prediction):
        """Send alert for critical health prediction"""
        # This would integrate with notification service (email, SMS, etc.)
        logger.warning(f"HEALTH ALERT: User {user.uid} has critical health status! Risk score: {prediction.result}")
        # TODO: Implement actual notification sending
    
    async def process_all_devices(self):
        """Process data for all active devices"""
        devices = get_all_active_devices(self.db)
        
        # Process each device concurrently
        tasks = [self.process_device_data(device) for device in devices]
        await asyncio.gather(*tasks)
        
        logger.info(f"Processed data for {len(devices)} devices")
    
    async def schedule_regular_updates(self, interval_minutes=None):
        """Schedule regular data updates"""
        interval = interval_minutes or settings.DATA_PROCESSING_INTERVAL
        
        while True:
            logger.info("Starting scheduled data processing")
            try:
                await self.process_all_devices()
            except Exception as e:
                logger.error(f"Error in scheduled processing: {e}")
                
            # Wait for next interval
            await asyncio.sleep(interval * 60)