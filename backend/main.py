from fastapi import FastAPI, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import logging
from contextlib import asynccontextmanager
import uvicorn

from app.api.router import api_router
from app.services.data_processor import DataProcessor
from app.services.thingspeak import ThingSpeakService
from app.services.prediction import HealthPredictor
from app.database.database import get_db, engine, Base
from app.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize services
thingspeak_service = ThingSpeakService()
health_predictor = HealthPredictor()

# Background task for data processing
async def start_data_processing():
    try:
        db = next(get_db())
        processor = DataProcessor(db, thingspeak_service, health_predictor)
        await processor.schedule_regular_updates()
    except Exception as e:
        logger.error(f"Error in data processing: {e}")
        
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Start background data processing task
    task = asyncio.create_task(start_data_processing())
    
    yield
    
    # Cleanup on shutdown
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        logger.info("Data processing task was cancelled")

# Initialize FastAPI app
app = FastAPI(
    title="Health Monitoring System",
    description="Backend API for health monitoring system with ML predictions",
    version="1.0.0",
    lifespan=lifespan
)
origin=["http://localhost:3000","http://localhost:8000"]
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Health Monitoring System API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)