# Vispectra - Web Analysis Tool

## Overview

Vispectra is a comprehensive web analysis tool that provides automated insights on website readability, visual accessibility (contrast), and visual saliency (where users' eyes are drawn). The system captures screenshots of web pages, analyzes them using computer vision and NLP techniques, and generates actionable recommendations for improving user experience and accessibility compliance.

The application consists of a FastAPI backend that processes analysis jobs asynchronously, leveraging Playwright for browser automation, OpenCV for saliency analysis, and various algorithms for readability and contrast scoring. Results include visual heatmaps, accessibility scores, and AI-powered suggestions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Framework
- **FastAPI** serves as the core API framework, chosen for its async support, automatic OpenAPI documentation, and built-in validation via Pydantic
- **Uvicorn** ASGI server handles async request processing with auto-reload in development
- Jobs are processed asynchronously using FastAPI's BackgroundTasks to avoid blocking the API

### Browser Automation
- **Playwright** (async API) captures full-page screenshots and extracts text content
- Chromium browser is used for consistent rendering across platforms
- Screenshots are saved to job-specific directories under `app/static/results/`

### Analysis Pipeline
The system performs four core analyses on each webpage:

1. **Saliency Analysis**: Uses OpenCV's spectral residual saliency algorithm to generate heatmaps showing visual attention patterns. Falls back to edge detection if the saliency module is unavailable. Outputs both overlay (colored heatmap on screenshot) and grayscale saliency map.

2. **Readability Scoring**: Implements Flesch-Kincaid readability formulas with custom syllable counting. Calculates reading ease, grade level, and provides suggestions for simplifying content.

3. **Contrast Analysis**: Computes WCAG contrast ratios between foreground and background colors using relative luminance calculations. Identifies accessibility violations for both normal and large text.

4. **AI Suggestions**: Aggregates findings from all analyses to generate human-friendly recommendations via the summarizer module.

### Data Storage
- **SQLAlchemy ORM** with configurable database backend (defaults to SQLite)
- `Analysis` model stores job metadata, status, scores, file paths, and errors
- Database URL configured via `DB_URL` environment variable for production flexibility
- Tables created automatically on application startup via lifespan events

### Job Processing Flow
1. Client submits URL via `/api/analyze` endpoint
2. Job record created in database with "pending" status
3. Background task starts processing:
   - Status updated to "processing"
   - Screenshot captured via Playwright
   - Parallel analysis execution (saliency, readability, contrast)
   - Results aggregated and saved as JSON
   - Status updated to "completed" or "failed"
4. Client polls for results using job_id

### Static File Serving
- FastAPI's StaticFiles middleware serves generated images and JSON results
- Files organized by job_id: `/static/results/{job_id}/screenshot.png`, etc.
- CORS configured for cross-origin access (wildcard in development)

### Optional Integrations
- **LLM Integration**: Groq API support for prompt testing and citation extraction (via `GROQ_API_KEY` environment variable)
- Mock responses provided when API keys unavailable
- **Website Analysis**: Lighthouse integration (requires Node.js) for performance and accessibility audits
- **Axe-core**: Accessibility violation detection via Playwright integration

### Error Handling
- Try-catch blocks with graceful degradation (e.g., saliency fallback algorithms)
- Errors logged to database `error` column
- Default values returned on analysis failures to prevent pipeline breaks

### Configuration
- Environment variables loaded via python-dotenv
- Configurable: database URL, API keys (Groq, OpenAI), server host/port
- Development mode enables auto-reload and verbose logging

## External Dependencies

### Python Packages
- **fastapi** - Web framework with async support and automatic API documentation
- **uvicorn[standard]** - ASGI server with WebSocket and HTTP/2 support
- **playwright** - Browser automation for screenshot capture and page interaction
- **opencv-python-headless** - Computer vision library for saliency map generation
- **pillow** - Image processing and manipulation
- **numpy** - Numerical computing for image arrays and calculations
- **sqlalchemy** - SQL ORM for database operations
- **pydantic** - Data validation and settings management
- **python-dotenv** - Environment variable configuration
- **httpx** - Async HTTP client for external API calls
- **redis** - Listed but not actively used (possibly for future caching)

### External Services
- **Groq API** - LLM service for AI-powered text generation and analysis (optional, falls back to mocks)
- **Lighthouse** - Google's web performance and accessibility auditing tool (requires Node.js, optional)
- **OpenAI API** - Listed in documentation but not actively implemented (reserved for future use)

### System Requirements
- **Python 3.9+** - Runtime environment
- **Playwright Chromium** - Browser binary installed via `python -m playwright install chromium`
- **Node.js** (optional) - Required for Lighthouse integration

### Database
- **SQLite** - Default database for development (file-based: `geo_data.db`)
- **Configurable RDBMS** - Can use PostgreSQL, MySQL, etc. via SQLAlchemy connection string

### File System
- Local file storage for screenshots, heatmaps, and JSON results under `app/static/results/`
- No cloud storage integration currently implemented

## Replit Setup

### Running on Replit
The application is configured to run on Replit with the following setup:

**Server Configuration:**
- Host: `0.0.0.0` (required for Replit to expose the service)
- Port: `5000` (Replit's standard port)
- Auto-reload enabled in development mode

**Environment Variables:**
- `DB_URL`: SQLite database path (default: `sqlite:///./geo_data.db`)
- `PLAYWRIGHT_BROWSERTYPE`: Browser type for Playwright (default: `chromium`)
- `GROQ_API_KEY`: Optional API key for Groq LLM integration (uses mock responses if not set)

**Starting the Server:**
The workflow automatically runs: `cd backend && python run.py`

**API Documentation:**
- Root endpoint: `/` - Welcome message
- Interactive API docs: `/docs` - Swagger UI
- OpenAPI schema: `/openapi.json`

**Frontend Integration:**
- Frontend is deployed on Vercel
- Backend API is accessible at the Replit deployment URL on port 5000
- CORS is configured to allow all origins in development

### Production Deployment Notes
1. Configure Vercel frontend to use the Replit deployment URL
2. Store production secrets using Replit Secrets (not in `.env` file)
3. Consider disabling uvicorn reload mode for production stability
4. Update CORS settings to allow only specific origins