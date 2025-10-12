import asyncio
import os
import json
import uuid
import numpy
from datetime import datetime
from typing import Dict, Any, Optional

from sqlalchemy.orm import Session
from playwright.async_api import async_playwright

from app.database import Analysis
from app.ai_analysis import saliency, readability, contrast, summarizer
from app.ai_analysis.schemas import AnalysisResult, SaliencyResult, ReadabilityResult
from app.ai_analysis.prompt_tester import test_prompts
from app.ai_analysis.citation_extractor import extract_citations


async def process_analysis_job(job_id: str, url: str, db: Session):
    """Process an analysis job in the background"""
    # Update job status to processing
    analysis = db.query(Analysis).filter(Analysis.job_id == job_id).first()
    if not analysis:
        return
    
    analysis.status = "processing"
    db.commit()
    
    try:
        # Create output directory if it doesn't exist
        output_dir = os.path.join("app", "static", "results", job_id)
        os.makedirs(output_dir, exist_ok=True)
        
        # Capture screenshot
        screenshot_path = os.path.join(output_dir, "screenshot.png")
        text_content = await capture_screenshot(url, screenshot_path)
        
        # Process saliency
        overlay_path = os.path.join(output_dir, "overlay.png")
        salmap_path = os.path.join(output_dir, "salmap.png")
        saliency_result = await process_saliency(screenshot_path, overlay_path, salmap_path)
        
        # Process readability
        readability_result = process_readability(text_content)
        
        # Process contrast (mock data for now)
        contrast_issues = []
        
        # Generate suggestions
        suggestions = summarizer.generate_suggestions(
            saliency_summary=saliency_result,
            contrast_issues=contrast_issues,
            readability_result=readability_result
        )
        
        # Test prompt with LLM
        prompt_result = await test_prompts(url)
        
        # Extract citations
        domain = url.split("//")[-1].split("/")[0]
        citation_result = extract_citations(prompt_result.get("response", ""), domain)
        
        # Calculate GEO score
        geo_score = calculate_geo_score(
            readability_score=readability_result.flesch_reading_ease,
            contrast_score=100 if not contrast_issues else 80,
            saliency_score=saliency_result.cta_saliency * 100 if saliency_result.cta_saliency else 70
        )
        
        # Create analysis result
        result = AnalysisResult(
            url=url,
            screenshot=screenshot_path,
            readability=readability_result,
            saliency=saliency_result,
            contrast_issues=contrast_issues,
            suggestions=suggestions,
            prompt_details=[{
                "prompt": "Analyze this website",
                "response": prompt_result.get("response", ""),
                "citation_count": len(citation_result.get("mentions", [])),
                "citations": citation_result.get("mentions", [])
            }],
            geo_summary={
                "geo_score": geo_score,
                "total_mentions": len(citation_result.get("mentions", []))
            },
            axe_violations=[]
        )
        
        # Save result to JSON file
        result_path = os.path.join(output_dir, "result.json")
        with open(result_path, "w") as f:
            f.write(result.json())
        
        # Update database record
        analysis.status = "completed"
        analysis.completed_at = datetime.utcnow()
        analysis.readability_score = readability_result.flesch_reading_ease
        analysis.contrast_score = 100 if not contrast_issues else 80
        analysis.saliency_score = saliency_result.cta_saliency * 100 if saliency_result.cta_saliency else 70
        analysis.geo_score = geo_score
        analysis.result_json = f"/static/results/{job_id}/result.json"
        analysis.overlay_path = f"/static/results/{job_id}/overlay.png"
        analysis.salmap_path = f"/static/results/{job_id}/salmap.png"
        db.commit()
        
    except Exception as e:
        # Update job status to failed
        analysis.status = "failed"
        analysis.error = str(e)
        db.commit()


async def capture_screenshot(url: str, output_path: str) -> str:
    """Capture a screenshot of a URL and extract text content"""
    text_content = ""
    async with async_playwright() as p:
        browser_type = os.getenv("PLAYWRIGHT_BROWSERTYPE", "chromium")
        browser = await getattr(p, browser_type).launch()
        page = await browser.new_page()
        
        # Set viewport size
        await page.set_viewport_size({"width": 1280, "height": 800})
        
        try:
            # Navigate to URL
            await page.goto(url, wait_until="networkidle")
            
            # Extract text content
            text_content = await page.evaluate("() => document.body.innerText")
            
            # Take screenshot
            await page.screenshot(path=output_path, full_page=True)
        finally:
            await browser.close()
    
    return text_content


async def process_saliency(screenshot_path: str, overlay_path: str, salmap_path: str) -> SaliencyResult:
    """Process saliency for a screenshot"""
    try:
        # Generate saliency map and overlay
        saliency_map = saliency.spectral_residual_saliency(screenshot_path)
        saliency.save_heatmap_overlay(screenshot_path, saliency_map, overlay_path, salmap_path)
        
        # Calculate CTA saliency (heuristic)
        # Assuming bottom 1/3 of the image is where CTAs typically are
        height = saliency_map.shape[0]
        cta_region = saliency_map[int(height * 2/3):, :]
        cta_saliency = float(cta_region.mean())
        
        # Identify dominant regions (simple heuristic)
        # Top 20% of saliency values are considered dominant
        threshold = saliency_map.max() * 0.8
        dominant_regions = [(int(y), int(x)) for y, x in zip(*numpy.where(saliency_map > threshold))]
        
        return SaliencyResult(
            saliency_path=salmap_path,
            overlay_path=overlay_path,
            cta_saliency=cta_saliency,
            dominant_regions=dominant_regions[:10]  # Limit to 10 regions
        )
    except Exception as e:
        # Return a default result with error
        return SaliencyResult(
            saliency_path=salmap_path,
            overlay_path=overlay_path,
            cta_saliency=0.5,  # Default value
            dominant_regions=[],
            error=str(e)
        )


def process_readability(text_content: str) -> ReadabilityResult:
    """Process readability for text content"""
    try:
        # Calculate readability scores
        fk_grade, fre = readability.flesch_kincaid_readability(text_content)
        
        return ReadabilityResult(
            flesch_kincaid_grade=fk_grade,
            flesch_reading_ease=fre,
            text_length=len(text_content)
        )
    except Exception as e:
        # Return a default result with error
        return ReadabilityResult(
            flesch_kincaid_grade=10.0,  # Default value
            flesch_reading_ease=50.0,   # Default value
            text_length=len(text_content) if text_content else 0,
            error=str(e)
        )


def calculate_geo_score(readability_score: float, contrast_score: float, saliency_score: float) -> float:
    """Calculate the GEO score based on readability, contrast, and saliency"""
    # Normalize readability score (0-100)
    # Flesch Reading Ease is already 0-100
    normalized_readability = min(max(readability_score, 0), 100)
    
    # Weights for each component
    weights = {
        "readability": 0.4,
        "contrast": 0.3,
        "saliency": 0.3
    }
    
    # Calculate weighted score
    geo_score = (
        normalized_readability * weights["readability"] +
        contrast_score * weights["contrast"] +
        saliency_score * weights["saliency"]
    )
    
    return round(geo_score, 1)