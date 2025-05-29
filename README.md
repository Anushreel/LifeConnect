# Health Monitoring System

A comprehensive real-time health monitoring system that integrates IoT sensors, machine learning predictions, and web-based dashboards for continuous health tracking and emergency detection.

## 🏗️ System Architecture

The system consists of:
- **Frontend**: React.js dashboard with real-time data visualization
- **Backend**: FastAPI with async processing capabilities
- **Database**: MySQL for user data and sensor readings storage
- **ML Engine**: Predictive models for health emergency detection
- **IoT Integration**: ThingSpeak cloud for sensor data collection
- **Notification System**: Real-time alerts for critical health conditions

## 📊 Features

### User Features
- ✅ User registration and authentication
- ✅ Personal health dashboard with real-time graphs
- ✅ Multiple sensor data visualization (heart rate, temperature, etc.)
- ✅ Health parameter history and trends
- ✅ Real-time critical health alerts
- ✅ Device association and management
- ✅ Task management for health activities

### Admin Features
- ✅ Admin dashboard with system overview
- ✅ User management and monitoring
- ✅ Device and sensor management
- ✅ System-wide health alerts monitoring
- ✅ User activity tracking
- ✅ Critical alerts management

### ML & Analytics
- ✅ Continuous health prediction using ML models
- ✅ Anomaly detection for critical health conditions
- ✅ Pattern recognition for health trends
- ✅ Automated emergency detection
- ✅ Predictive health analytics

### Notification System
- 🔔 **Real-time alerts** for critical health conditions
- 📧 **Email notifications** to users and admins
- 📱 **In-app notifications** with severity levels
- 🚨 **Emergency alerts** with immediate response protocols
- 📊 **Alert history** and management

## 🏗️ Project Structure

```
health_monitoring_system/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry point
│   ├── config.py                  # Configuration settings
│   ├── dependencies.py            # Dependency injection
│   ├── database/
│   │   ├── __init__.py
│   │   ├── database.py           # Database connection setup
│   │   ├── models.py             # SQLAlchemy models
│   │   └── crud.py               # Database operations
│   ├── api/
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── users.py          # User management endpoints
│   │   │   ├── devices.py        # Device management endpoints
│   │   │   ├── sensors.py        # Sensor readings endpoints
│   │   │   ├── predictions.py    # ML prediction endpoints
│   │   │   ├── auth.py           # Authentication endpoints
│   │   │   ├── tasks.py          # Task management endpoints
│   │   │   ├── admin.py          # Admin dashboard endpoints
│   │   │   └── notifications.py  # Notification endpoints
│   │   └── router.py             # API router
│   ├── services/
│   │   ├── __init__.py
│   │   ├── thingspeak.py         # ThingSpeak API integration
│   │   ├── prediction.py         # ML prediction logic
│   │   ├── data_processor.py     # Data processing for ML
│   │   ├── notification.py       # Notification service
│   │   
│   ├── models/
│   │   ├── ml_models/            # Trained ML models
│   │   └── training.py           # Model training code
│   └── schemas/
│       ├── __init__.py
│       ├── user.py               # User schemas
│       ├── device.py             # Device schemas
│       ├── sensor.py             # Sensor reading schemas
│       ├── prediction.py         # Prediction schemas
│       ├── task.py               # Task schemas
│       └── notification.py       # Notification schemas
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components
│   │   ├── contexts
│   │   ├── services
│   │   ├── AdminDashboard
│   │   └── App.js
│   ├── package.json
│   └── README.md
├── logs
├── requirements.txt
├── .env
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL 8.0+
- ThingSpeak account

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health_monitoring_system
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

5. **Set up MySQL database**
   ```sql
   CREATE DATABASE health_monitoring;
   ```

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoints
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/health_monitoring

# ThingSpeak Configuration
THINGSPEAK_API_KEY=your_thingspeak_api_key
THINGSPEAK_CHANNEL_ID=your_channel_id

# JWT Configuration
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Notification Settings
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
CRITICAL_THRESHOLD_HEART_RATE=100
CRITICAL_THRESHOLD_TEMPERATURE=102
```

## 🔔 Notification System

### Alert Types

1. **Critical Health Alerts**
   - Heart rate anomalies
   - Temperature spikes
   - Blood pressure irregularities
   - Oxygen level drops

2. **System Alerts**
   - Sensor disconnection
   - Data collection failures
   - ML model prediction errors


### Notification Channels

- **In-App Notifications**: Real-time browser notifications
- **Dashboard Alerts**: Visual indicators on admin/user dashboards


## 🤖 Machine Learning Models

### Prediction Models

1. **Health Risk Prediction**
   - Predicts potential health emergencies
   - Uses ensemble methods (Random Forest, XGBoost)

### Model Training

```bash
# Train new models
python -m app.models.training --model-type anomaly
python -m app.models.training --model-type prediction
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/devices` - Get user devices

### Sensor Data
- `GET /api/sensors/readings` - Get sensor readings
- `POST /api/sensors/readings` - Add sensor reading
- `GET /api/sensors/latest` - Get latest readings

### Predictions
- `GET /api/predictions/health-status` - Get health predictions
- `POST /api/predictions/analyze` - Analyze health data

### Notifications
- `GET /api/notifications/` - Get user notifications
- `POST /api/notifications/mark-read` - Mark notification as read
- `GET /api/notifications/critical` - Get critical alerts

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/alerts` - Get system alerts
- `GET /api/admin/dashboard` - Get admin dashboard data

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- API rate limiting
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment

### Docker Deployment

1. **Build containers**
   ```bash
   docker-compose build
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

### Production Deployment

1. **Backend**
   ```bash
   uvicorn main:app --reload
   ```

2. **Frontend**
   ```bash
   npm install
   npm start
   ```

## 📈 Monitoring & Maintenance

### Health Checks
- Database connectivity monitoring
- ThingSpeak API status checking
- ML model performance tracking
- Notification delivery monitoring

### Logging
- Application logs with rotation
- Error tracking and alerting
- Performance metrics collection
- User activity logging


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@healthmonitoring.com or create an issue in the repository.

## 🔮 Future Enhancements

- Mobile app development
- Integration with wearable devices
- Advanced ML models for disease prediction
- Telemedicine integration
- Multi-language support
- Voice-activated alerts
- Integration with hospital systems

---

**Built with ❤️ for better health monitoring**