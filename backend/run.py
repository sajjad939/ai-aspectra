import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Run the FastAPI application with uvicorn
    uvicorn.run(
        "app.main:app",
        host="localhost",
        port=8080,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )