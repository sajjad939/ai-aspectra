import os
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routes and database
from .routes.geo_routes import router as geo_router
from .database import Base, engine, create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables and static directories on startup"""
    # Create database tables
    create_tables()
    
    # Create static directories if they don't exist
    os.makedirs("app/static/results", exist_ok=True)
    yield

# Create FastAPI app
app = FastAPI(
    title="Vispectra API",
    description="API for Vispectra - Website Analysis Tool",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include routers
app.include_router(geo_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Welcome to Vispectra API. Use /docs for API documentation."}