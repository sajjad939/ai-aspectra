# Vispectra API Backend

This is the backend API for Vispectra, a web analysis tool that provides insights on readability, contrast, and saliency of web pages.

## Features

- Screenshot capture of web pages
- Saliency analysis with heatmap generation
- Readability scoring (Flesch-Kincaid)
- Contrast analysis for accessibility
- LLM-powered suggestions
- Citation extraction
- GEO score calculation

## Setup

### Prerequisites

- Python 3.9+
- Playwright for browser automation
- OpenAI API key (optional)
- Reimagine API key (optional)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Install Playwright browsers:

```bash
python -m playwright install chromium
```

4. Set up environment variables (copy .env.example to .env and edit):

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

### Running the API

```bash
python run.py
```

The API will be available at http://localhost:8000

### Docker

You can also run the API using Docker:

```bash
docker-compose up -d
```

## API Endpoints

### POST /api/analyze

Analyze a web page.

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "job_id": "1234-5678-90ab-cdef",
  "status": "pending"
}
```

### GET /api/job/{job_id}

Get the status and results of an analysis job.

**Response:**

```json
{
  "job_id": "1234-5678-90ab-cdef",
  "status": "completed",
  "url": "https://example.com",
  "results": {
    "readability": { ... },
    "contrast": { ... },
    "saliency": { ... },
    "geo_score": 85.5,
    "suggestions": [ ... ]
  },
  "overlay_url": "/static/results/1234-5678-90ab-cdef/overlay.png",
  "salmap_url": "/static/results/1234-5678-90ab-cdef/salmap.png"
}
```

## Architecture

The backend is built with FastAPI and uses:

- Playwright for browser automation and screenshot capture
- OpenCV and NumPy for image processing and saliency analysis
- SQLAlchemy for database operations
- Pydantic for data validation
- OpenAI API for LLM-powered suggestions (optional)
- Reimagine API for additional website analysis (optional)

## License

MIT