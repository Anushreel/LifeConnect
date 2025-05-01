from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from app.config import settings
Base = declarative_base()


DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL,
                    pool_pre_ping=True,  # Check connection before using it
                    pool_recycle=3600,   # Recycle connections after 1 hour
                    )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

