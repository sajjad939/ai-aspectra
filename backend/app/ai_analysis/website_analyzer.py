# Purpose: Website analysis using Playwright and Lighthouse

import os
import json
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional


async def analyze_website(url: str, results_dir: Path) -> Dict[str, Any]:
    """
    Analyze a website using Playwright and Lighthouse.
    Saves results to website_analysis_report.json in results_dir.
    """
    # Use Playwright for analysis
    result = await analyze_with_playwright(url)
    
    # Save results
    os.makedirs(results_dir, exist_ok=True)
    report_path = results_dir / "website_analysis_report.json"
    report_path.write_text(json.dumps(result, indent=2))
    
    return result


async def analyze_with_playwright(url: str) -> Dict[str, Any]:
    """
    Use Playwright to analyze a website directly.
    """
    try:
        # Import here to avoid dependency issues if not installed
        from playwright.async_api import async_playwright
        
        # Run Lighthouse via subprocess (requires Node.js and Lighthouse)
        lighthouse_data = {}
        try:
            cmd = ["lighthouse", url, "--output=json", "--quiet", "--chrome-flags='--headless'"]
            proc = subprocess.run(cmd, capture_output=True, text=True)
            if proc.returncode == 0:
                lighthouse_data = json.loads(proc.stdout)
            else:
                print(f"Lighthouse error: {proc.stderr}")
        except Exception as e:
            print(f"Lighthouse execution error: {e}")
        
        # Use Playwright for accessibility testing with axe-core
        accessibility_data = {}
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url)
            
            # Inject axe-core for accessibility testing
            try:
                await page.add_script_tag(url="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js")
                accessibility_data = await page.evaluate("() => axe.run()")
            except Exception as e:
                print(f"Axe-core error: {e}")
            
            # Take screenshot for visual analysis
            screenshot_path = "temp_screenshot.png"
            await page.screenshot(path=screenshot_path)
            
            # Get basic SEO data
            title = await page.title()
            meta_description = await page.evaluate("""
                () => {
                    const meta = document.querySelector('meta[name="description"]');
                    return meta ? meta.getAttribute('content') : '';
                }
            """)
            
            await browser.close()
            
            # Compile results
            return {
                "seo_score": int(lighthouse_data.get("categories", {}).get("seo", {}).get("score", 0) * 100) if lighthouse_data else 50,
                "accessibility_score": int(lighthouse_data.get("categories", {}).get("accessibility", {}).get("score", 0) * 100) if lighthouse_data else 50,
                "visual_score": 70,  # Placeholder - would need actual visual analysis
                "top_issues": [
                    f"Title: {title}" if title else "Missing page title",
                    f"Meta description: {meta_description}" if meta_description else "Missing meta description",
                    f"Found {len(accessibility_data.get('violations', []))} accessibility issues" if accessibility_data else "Could not analyze accessibility"
                ],
                "screenshot_path": screenshot_path
            }
    except Exception as e:
        print(f"Playwright analysis error: {str(e)}")
        return {
            "seo_score": 50,
            "accessibility_score": 50,
            "visual_score": 50,
            "top_issues": [f"Analysis error: {str(e)}"],
            "error": str(e)
        }