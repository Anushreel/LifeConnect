import requests
from datetime import datetime
import logging
from app.database.models import Sensor
from typing import Dict, Optional, List, Any

logger = logging.getLogger(__name__)

class ThingSpeakService:
    def __init__(self, base_url: str = "https://api.thingspeak.com"):
        self.base_url = base_url
    
    def fetch_latest_data(self, channel_id: str = "2771512", read_api_key: str= "TDAOWY27LQ0YE4H0") -> Optional[Dict[str, Any]]:
        """
        Fetch the latest entry from a ThingSpeak channel
        """
        url = f"{self.base_url}/channels/{channel_id}/feeds.json"
        params = {"api_key": read_api_key, "results": 1}
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()  # Raise exception for HTTP errors
            
            data = response.json()
            if not data.get('feeds') or len(data['feeds']) == 0:
                logger.warning(f"No data found for channel {channel_id}")
                return None
            
            latest_entry = data['feeds'][-1]
            created_at = latest_entry.get("created_at")
            if not created_at:
                logger.error("Missing timestamp in data")
                return None
            # Parse the data into our standard format
            parsed_data = {
                "timestamp": datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%SZ"),
                "temperature": self._safe_float(latest_entry.get('field1')),
                "heart_rate": self._safe_float(latest_entry.get('field2')),
                "humidity": self._safe_float(latest_entry.get('field3')),
                "ecg": self._safe_float(latest_entry.get('field5')),
            }
            
            return parsed_data
            
        except requests.RequestException as e:
            logger.error(f"Error fetching data from ThingSpeak: {str(e)}")
            return None
        except requests.HTTPError as e:
            logger.error(f"HTTP error {e.response.status_code}: {e.response.text}")
            return None

    
    def fetch_historical_data(self, channel_id: str = "2771512", read_api_key: str= "TDAOWY27LQ0YE4H0", days: int = 7) -> List[Dict[str, Any]]:
        """
        Fetch historical data for the specified number of days
        """
        url = f"{self.base_url}/channels/{channel_id}/feeds.json"
        params = {
            "api_key": read_api_key,
            "days": days
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if not data.get('feeds'):
                return []
                
            parsed_data = []
            
            for entry in data['feeds']:
                created_at = entry.get("created_at")
                if not created_at:
                    logger.error("Missing timestamp in data")
                    return None
                reading = {
                    "timestamp": datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%SZ"),
                    "temperature": self._safe_float(entry.get('field1')),
                    "heart_rate": self._safe_float(entry.get('field2')),
                    "humidity": self._safe_float(entry.get('field3')),
                    # "body_fall": self._safe_float(entry.get('field4')),
                    "ecg": self._safe_float(entry.get('field5')),
                    # "raw_data": entry
                }
                parsed_data.append(reading)
                
            return parsed_data
            
        except requests.RequestException as e:
            logger.error(f"Error fetching historical data from ThingSpeak: {str(e)}")
            return []
        except requests.HTTPError as e:
            logger.error(f"HTTP error {e.response.status_code}: {e.response.text}")
            return None

    def _safe_float(self, value) -> Optional[float]:
        """Convert value to float safely, returning None if conversion fails"""
        if value is None:
            return None
        try:
            return float(value)
        except (ValueError, TypeError):
            return None