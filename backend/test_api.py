import httpx
import asyncio
import json
import time
import sys
from typing import Dict, Any

# Enable more verbose output
print("Starting API test script")


async def test_api():
    """Test the Vispectra API locally"""
    base_url = "http://localhost:8080"
    test_url = "https://example.com"
    
    print(f"Testing API at {base_url}")
    print(f"Analyzing URL: {test_url}")
    
    # Check if API is running
    try:
        print(f"Attempting to connect to {base_url}/")
        # Try with different timeouts and settings
        print("Trying with extended timeout and different settings...")
        async with httpx.AsyncClient(timeout=30.0) as client:
            print("Client created, sending request...")
            try:
                response = await client.get(f"{base_url}/")
                print(f"Response received: {response.status_code}")
                print(f"Response content: {response.text[:100]}...")
                if response.status_code != 200:
                    print(f"API not responding correctly. Status: {response.status_code}")
                    return
                print("API connection successful")
            except httpx.ConnectError as ce:
                print(f"Connection error: {ce}")
                print("Trying alternative connection method...")
                # Try with explicit connection parameters
                response = await client.get("http://127.0.0.1:8080/")
                print(f"Alternative connection response: {response.status_code}")
    except Exception as e:
        print(f"Error connecting to API: {e}")
        print(f"Error type: {type(e).__name__}")
        print("Make sure the API is running with 'python run.py'")
        return
    
    # Submit analysis job
    job_id = None
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{base_url}/api/analyze",
                json={"url": test_url}
            )
            
            if response.status_code == 200:
                data = response.json()
                job_id = data.get("job_id")
                print(f"Analysis job submitted. Job ID: {job_id}")
            else:
                print(f"Error submitting analysis job: {response.status_code} - {response.text}")
                return
    except Exception as e:
        print(f"Error submitting analysis job: {e}")
        return
    
    if not job_id:
        print("No job ID received. Cannot check job status.")
        return
    
    # Poll for job completion
    max_attempts = 30
    attempt = 0
    while attempt < max_attempts:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{base_url}/api/job/{job_id}")
                
                if response.status_code == 200:
                    data = response.json()
                    status = data.get("status")
                    
                    if status == "completed":
                        print("\nAnalysis completed successfully!")
                        print_results(data)
                        return
                    elif status == "failed":
                        print(f"\nAnalysis failed: {data.get('error')}")
                        return
                    else:
                        print(f"Status: {status}. Waiting...")
                else:
                    print(f"Error checking job status: {response.status_code} - {response.text}")
                    return
        except Exception as e:
            print(f"Error checking job status: {e}")
            return
        
        attempt += 1
        await asyncio.sleep(2)  # Wait 2 seconds between checks
    
    print("\nTimeout waiting for analysis to complete.")


def print_results(data: Dict[str, Any]):
    """Print analysis results in a readable format"""
    print("\n=== ANALYSIS RESULTS ===")
    print(f"URL: {data.get('url')}")
    print(f"GEO Score: {data.get('results', {}).get('geo_score')}")
    
    # Print readability results
    readability = data.get('results', {}).get('readability', {})
    if readability:
        print("\n--- Readability ---")
        print(f"Flesch Reading Ease: {readability.get('flesch_reading_ease')}")
        print(f"Flesch-Kincaid Grade: {readability.get('flesch_kincaid_grade')}")
    
    # Print saliency results
    saliency = data.get('results', {}).get('saliency', {})
    if saliency:
        print("\n--- Saliency ---")
        print(f"CTA Saliency: {saliency.get('cta_saliency')}")
        print(f"Overlay Image: {data.get('overlay_url')}")
        print(f"Saliency Map: {data.get('salmap_url')}")
    
    # Print suggestions
    suggestions = data.get('results', {}).get('suggestions', [])
    if suggestions:
        print("\n--- Suggestions ---")
        for i, suggestion in enumerate(suggestions, 1):
            print(f"{i}. {suggestion}")
    
    print("\nFull results available in the API response JSON")


if __name__ == "__main__":
    print("Running test_api() function")
    try:
        asyncio.run(test_api())
        print("Test completed")
    except Exception as e:
        print(f"Error in main: {e}")