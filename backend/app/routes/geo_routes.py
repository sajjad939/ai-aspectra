from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import json
import uuid
from pathlib import Path
import httpx
import asyncio
from sqlalchemy.orm import Session

# Import AI analysis modules
from ..ai_analysis.saliency import generate_overlay_from_file
from ..ai_analysis.readability import flesch_kincaid_readability
from ..ai_analysis.contrast import contrast_ratio, wcag_pass_level
from ..ai_analysis.summarizer import generate_suggestions
from ..ai_analysis.website_analyzer import analyze_website
from ..ai_analysis.prompt_tester import test_prompts
from ..ai_analysis.citation_extractor import extract_citations

from ..database import get_db, Analysis
from ..background import process_analysis_job

# Create router
router = APIRouter()


# Request models
class AnalyzeRequest(BaseModel):
    url: str
    prompts: List[str] = []


# Response models
class JobResponse(BaseModel):
    job_id: str
    status: str
    result: Optional[Dict[str, Any]] = None


@router.post("/analyze", response_model=JobResponse)
async def analyze_site(request: AnalyzeRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Generate job ID
    job_id = str(uuid.uuid4())
    
    # Create job directory
    results_dir = Path(f"app/static/results/{job_id}")
    results_dir.mkdir(parents=True, exist_ok=True)
    
    # Create database record
    analysis = Analysis(
        job_id=job_id,
        url=request.url,
        status="pending"
    )
    db.add(analysis)
    db.commit()
    
    # Start background task
    background_tasks.add_task(process_analysis_job, job_id, request.url, db)
    
    return JobResponse(job_id=job_id, status="pending")


@router.get("/job/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str, db: Session = Depends(get_db)):
    # Query the database for the job
    analysis = db.query(Analysis).filter(Analysis.job_id == job_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # If job is completed, include result.json content
    result = None
    if analysis.status == "completed":
        result_path = Path(f"app/static/results/{job_id}/result.json")
        if result_path.exists():
            try:
                result = json.loads(result_path.read_text())
            except Exception as e:
                print(f"Error reading result.json: {e}")
    
    return JobResponse(
        job_id=job_id,
        status=analysis.status,
        result=result
    )


# Helper functions for processing analysis jobs


async def take_screenshot_and_run_axe(url: str, screenshot_path: str, results_dir: Path):
    try:
        from playwright.async_api import async_playwright
        
        browser_type = os.getenv("PLAYWRIGHT_BROWSERTYPE", "chromium")
        
        async with async_playwright() as p:
            # Launch browser
            browser_types = {
                "chromium": p.chromium,
                "firefox": p.firefox,
                "webkit": p.webkit
            }
            
            browser = await browser_types.get(browser_type, p.chromium).launch()
            page = await browser.new_page()
            
            # Navigate to URL
            await page.goto(url, wait_until="networkidle")
            
            # Take screenshot
            await page.screenshot(path=screenshot_path, full_page=True)
            
            # Inject axe-core
            await page.add_script_tag(url="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js")
            
            # Run axe
            axe_results = await page.evaluate("() => axe.run()")
            
            # Extract text for readability
            text = await page.evaluate("""
                () => {
                    const mainContent = document.querySelector('main, article');
                    if (mainContent) return mainContent.innerText;
                    return document.body.innerText;
                }
            """)
            
            # Extract styles for contrast
            styles = await page.evaluate("""
                () => {
                    const textElements = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button, li'));
                    return textElements.map(el => {
                        const style = window.getComputedStyle(el);
                        return {
                            selector: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + 
                                     (el.className ? '.' + el.className.replace(/\\s+/g, '.') : ''),
                            text: el.innerText.substring(0, 50),
                            fg: style.color,
                            bg: style.backgroundColor
                        };
                    });
                }
            """)
            
            # Close browser
            await browser.close()
            
            # Save axe results
            axe_path = results_dir / "axe.json"
            axe_path.write_text(json.dumps(axe_results, indent=2))
            
            # Save text for readability
            text_path = results_dir / "text.txt"
            text_path.write_text(text)
            
            # Save styles for contrast
            styles_path = results_dir / "styles.json"
            styles_path.write_text(json.dumps(styles, indent=2))
            
            return axe_results
    except Exception as e:
        print(f"Error taking screenshot and running axe: {e}")
        return {"error": str(e)}


async def generate_saliency(screenshot_path: str, results_dir: Path):
    try:
        overlay_path = str(results_dir / "saliency.png")
        salmap_path = str(results_dir / "salmap.png")
        
        generate_overlay_from_file(screenshot_path, overlay_path, salmap_path)
        
        # Basic heuristic for CTA saliency (center area)
        from PIL import Image
        import numpy as np
        
        try:
            sm = Image.open(salmap_path).convert('L')
            w, h = sm.size
            cx1 = int(w * 0.33)
            cy1 = int(h * 0.4)
            cx2 = int(w * 0.66)
            cy2 = int(h * 0.7)
            crop = sm.crop((cx1, cy1, cx2, cy2))
            arr = (np.array(crop).astype('float32') / 255.0)
            cta_saliency = float(arr.mean()) if arr.size else 0.0
        except Exception as e:
            print(f"Error computing CTA saliency: {e}")
            cta_saliency = 0.0
        
        saliency_summary = {
            "cta_saliency": cta_saliency,
            "dominant_regions": ["top-hero"]  # Simplified for demo
        }
        
        return {
            "saliency_png": overlay_path,
            "salmap_png": salmap_path,
            "saliency_summary": saliency_summary
        }
    except Exception as e:
        print(f"Error generating saliency: {e}")
        return {"error": str(e)}


async def compute_readability(url: str, results_dir: Path):
    try:
        # Read extracted text
        text_path = results_dir / "text.txt"
        if text_path.exists():
            text = text_path.read_text()
        else:
            text = "No text extracted from the page."
        
        # Compute readability
        readability = flesch_kincaid_readability(text)
        
        # Save readability results
        readability_path = results_dir / "readability.json"
        readability_path.write_text(json.dumps(readability, indent=2))
        
        return readability
    except Exception as e:
        print(f"Error computing readability: {e}")
        return {"error": str(e)}


async def compute_contrast(url: str, results_dir: Path):
    try:
        # Read extracted styles
        styles_path = results_dir / "styles.json"
        if styles_path.exists():
            styles = json.loads(styles_path.read_text())
        else:
            styles = []
        
        # Compute contrast for each style
        contrast_issues = []
        for style in styles:
            try:
                fg = style.get("fg")
                bg = style.get("bg")
                if fg and bg and fg != "rgba(0, 0, 0, 0)" and bg != "rgba(0, 0, 0, 0)":
                    # Convert rgba to hex
                    fg_hex = rgba_to_hex(fg)
                    bg_hex = rgba_to_hex(bg)
                    
                    ratio = contrast_ratio(fg_hex, bg_hex)
                    wcag = wcag_pass_level(ratio)
                    
                    if wcag["normal_text"] == "fail":
                        contrast_issues.append({
                            "selector": style.get("selector"),
                            "text": style.get("text"),
                            "foreground": fg_hex,
                            "background": bg_hex,
                            "ratio": ratio
                        })
            except Exception as e:
                print(f"Error computing contrast for style {style}: {e}")
        
        # Save contrast results
        contrast_path = results_dir / "contrast.json"
        contrast_results = {"contrast_issues": contrast_issues}
        contrast_path.write_text(json.dumps(contrast_results, indent=2))
        
        return contrast_results
    except Exception as e:
        print(f"Error computing contrast: {e}")
        return {"error": str(e)}


async def test_prompts_and_extract_citations(url: str, prompts: List[str], results_dir: Path):
    try:
        domain = url.split("//")[-1].split("/")[0]
        
        prompt_results = []
        for prompt in prompts:
            # Test prompt
            response = await test_prompts(prompt)
            
            # Extract citations
            citations = extract_citations(response, domain)
            
            prompt_results.append({
                "prompt": prompt,
                "response": response,
                "citation_count": citations["count"],
                "citations": citations["mentions"]
            })
        
        # Save prompt results
        prompts_path = results_dir / "prompts.json"
        prompts_path.write_text(json.dumps(prompt_results, indent=2))
        
        return prompt_results
    except Exception as e:
        print(f"Error testing prompts: {e}")
        return []


def rgba_to_hex(rgba):
    """Convert rgba string to hex color"""
    try:
        # Parse rgba string
        rgba = rgba.strip().lower()
        if rgba.startswith("rgba"):
            rgba = rgba.replace("rgba(", "").replace(")", "")
            r, g, b, a = [float(x.strip()) for x in rgba.split(",")]
            r, g, b = int(r), int(g), int(b)
        elif rgba.startswith("rgb"):
            rgba = rgba.replace("rgb(", "").replace(")", "")
            r, g, b = [int(x.strip()) for x in rgba.split(",")]
        else:
            # Assume it's already hex
            return rgba
        
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception:
        return "#000000"  # Default to black on error


def calculate_geo_score(saliency, readability, contrast, axe):
    """Calculate overall GEO score based on various metrics"""
    try:
        # Start with base score
        score = 70
        
        # Adjust based on readability
        fk_grade = readability.get("flesch_kincaid_grade", 10)
        if fk_grade > 12:
            score -= 10
        elif fk_grade < 8:
            score += 5
        
        # Adjust based on contrast issues
        contrast_issues = len(contrast.get("contrast_issues", []))
        if contrast_issues > 10:
            score -= 15
        elif contrast_issues > 5:
            score -= 10
        elif contrast_issues > 0:
            score -= 5
        
        # Adjust based on axe violations
        axe_violations = len(axe.get("violations", []))
        if axe_violations > 10:
            score -= 15
        elif axe_violations > 5:
            score -= 10
        elif axe_violations > 0:
            score -= 5
        
        # Adjust based on CTA saliency
        cta_saliency = saliency.get("saliency_summary", {}).get("cta_saliency", 0)
        if cta_saliency > 0.5:
            score += 10
        elif cta_saliency > 0.3:
            score += 5
        
        # Ensure score is within bounds
        return max(0, min(100, score))
    except Exception as e:
        print(f"Error calculating GEO score: {e}")
        return 50  # Default score on error