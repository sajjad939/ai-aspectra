# Visual Analytics Platform

A comprehensive web analysis tool that provides insights on readability, contrast, and saliency of web pages, helping designers and developers create more accessible and effective websites.

## Project Structure

This project consists of two main components:

### Frontend (Next.js)
- Modern UI built with Next.js and Tailwind CSS
- Real-time analysis results display
- Interactive visualizations
- Responsive design for all devices

### Backend (FastAPI)
- Screenshot capture of web pages
- Saliency analysis with heatmap generation
- Readability scoring (Flesch-Kincaid)
- Contrast analysis for accessibility
- LLM-powered suggestions
- Citation extraction
- GEO score calculation

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- Playwright for browser automation
- OpenAI API key (optional)
- Reimagine API key (optional)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install Playwright browsers:
```bash
python -m playwright install chromium
```

4. Start the backend server:
```bash
python run.py
```

The backend server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend/visual-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Features

- **URL Analysis**: Enter any website URL to analyze
- **Saliency Heatmaps**: Visualize which parts of a webpage attract the most attention
- **Readability Metrics**: Get detailed readability scores and suggestions
- **Contrast Analysis**: Identify potential accessibility issues
- **AI-Powered Suggestions**: Receive recommendations for improving your website
- **Citation Extraction**: Automatically extract citations from web content
- **GEO Score**: Comprehensive scoring of website effectiveness

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, SWR for data fetching
- **Backend**: FastAPI, Python, Playwright
- **AI/ML**: Computer vision algorithms for saliency detection, NLP for text analysis
- **Visualization**: Dynamic heatmaps and interactive charts

## License

This project is licensed under the MIT License - see the LICENSE file for details.
