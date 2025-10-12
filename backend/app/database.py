from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment or use default SQLite
DB_URL = os.getenv("DB_URL", "sqlite:///./geo_data.db")

# Create SQLAlchemy engine
engine = create_engine(DB_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


class Analysis(Base):
    """Model for storing analysis results"""
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, unique=True, index=True)
    url = Column(String)
    status = Column(String)  # pending, processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Analysis scores
    readability_score = Column(Float, nullable=True)
    contrast_score = Column(Float, nullable=True)
    saliency_score = Column(Float, nullable=True)
    geo_score = Column(Float, nullable=True)
    
    # Result paths
    result_json = Column(String, nullable=True)
    overlay_path = Column(String, nullable=True)
    salmap_path = Column(String, nullable=True)
    
    # Error information
    error = Column(Text, nullable=True)


# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)


# Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()