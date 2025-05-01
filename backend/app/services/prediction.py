import numpy as np
import pandas as pd
import joblib
import logging
from datetime import datetime, date, timezone
from sqlalchemy.orm import Session
from typing import Dict, Any
from sklearn.preprocessing import OneHotEncoder
from app.database.crud import create_health_prediction,get_user

logger = logging.getLogger(__name__)

class HealthPredictor:
    def __init__(self, scaler_path="app/models/ml_models/scaler.pkl", model_path="app/models/ml_models/health_prediction_model.pkl"):
        """Initialize the predictor with a trained model and scaler"""
        self.scaler = joblib.load(scaler_path) # standard scaler
        self.model = joblib.load(model_path) # classification model ETC

    def calculate_age(self, dob):
        """Calculate age from date of birth"""
        today = date.today()
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    
    def calculate_bmi(self, weight, height):
        """Calculate BMI from weight (kg) and height (cm)"""
        if height > 0:
            return weight / ((height / 100) ** 2)
        return None
    
    def encoder(self,gender):
        gender = gender.lower() if gender else 'unknown'
        if gender in ['male','m']: return 1
        elif gender in ['female','f']: return 0
        else: return -1

    def preprocess_data(self, user_data, sensor_reading):
        """Preprocess user and sensor data for model input"""
        features = {}
        # Input columns : Age, Gender, Body_Temperature_C, Heart_Rate_bpm, Humidity, Heart_Electric_Activity, BMI,
        features['Age'] = self.calculate_age(user_data.dob)
        features['Gender']=self.encoder(user_data.gender)
        # Extract sensor readings
        features['Body_Temperature_C'] = sensor_reading.temperature
        features['Heart_Rate_bpm'] = sensor_reading.heart_rate
        features['Humidity'] = sensor_reading.humidity
        features['Heart_Electric_Activity'] = sensor_reading.ecg
        features['BMI'] = self.calculate_bmi(user_data.weight, user_data.height)

        # Convert to DataFrame
        df = pd.DataFrame([features])

        # # Encoding
        # encoder = OneHotEncoder(drop='first', sparse_output=False)  # Drop first column
        # one_hot_encoded = encoder.fit_transform(df[["gender"]])  # Make sure to pass 2D

        # # Rename the column
        # one_hot_df = pd.DataFrame(one_hot_encoded, columns=['gender'])

        # # Concatenate back to original df
        # df = pd.concat([df.drop("gender", axis=1), one_hot_df], axis=1)

        df = df.fillna(df.mean())  # Handle missing values
        input=np.array(df)
        return input
    
    def predict(self, user_data, sensor_reading, db_session: Session):
        """Generate health prediction for a sensor reading"""
        try:
            # Preprocess the data
            features_df = self.preprocess_data(user_data, sensor_reading)
            
            # Scale features
            input_scaled = self.scaler.transform(features_df)
            
            # Make prediction
            result = self.model.predict(input_scaled)
            
            # Determine health status
            health_status = self.determine_health_status(result)
            
            
            # Create prediction record
            prediction_data = {
                "reading_id": sensor_reading.id,
                "prediction_timestamp": datetime.now(timezone.utc),
                "health_status": health_status,
                "result": float(result),
            }
            
            return create_health_prediction(db_session, prediction_data)
            
        except Exception as e:
            logger.error(f"Error generating prediction: {e}")
            return self.handle_prediction_error(sensor_reading, db_session, e)
    
    def determine_health_status(self, result):
        """Determine health status based on risk score"""
        if result ==0: #critical
            return "Critical"
        elif result ==1: #healthy
            return "Normal"
        else: #2 moderate
            return "Attention"
            
    
    def handle_prediction_error(self, sensor_reading, db_session, error):
        """Handle errors in prediction process"""
        prediction_data = {
            "reading_id": sensor_reading.id,
            "prediction_timestamp": datetime.now(timezone.utc),
            "health_status": "Unknown",
            "result": 0.0,
        }
        return create_health_prediction(db_session, prediction_data)