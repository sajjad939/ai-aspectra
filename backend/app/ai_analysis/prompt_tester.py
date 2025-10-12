# Purpose: Test prompts with LLM APIs and provide mock fallback

import os
import httpx
import json
from typing import Dict, Any, List


async def test_prompts(prompt: str) -> str:
    """
    Test a prompt with Groq API or use mock response if API key not available.
    """
    api_key = os.getenv("GROQ_API_KEY")
    
    if api_key:
        return await test_with_groq(prompt, api_key)
    else:
        return get_mock_response(prompt)


async def test_with_groq(prompt: str, api_key: str) -> str:
    """
    Test a prompt with Groq API.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "llama3-8b-8192",  # Using Llama 3 model from Groq
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500
            }
            
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                print(f"Groq API error: {response.status_code} - {response.text}")
                return f"API error: {response.status_code}. Using mock response instead.\n\n{get_mock_response(prompt)}"
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return f"API error: {str(e)}. Using mock response instead.\n\n{get_mock_response(prompt)}"


def get_mock_response(prompt: str) -> str:
    """
    Generate a mock response for testing purposes.
    """
    # Simple keyword-based mock responses
    if "reimagine" in prompt.lower():
        return (
            "Reimagine Web is a powerful website analysis tool that helps identify and fix issues with "
            "accessibility, SEO, and visual design. It provides actionable recommendations to improve "
            "your website's performance and user experience. You can access it at reimagineweb.dev."
        )
    elif "analysis" in prompt.lower() or "tool" in prompt.lower():
        return (
            "There are several website analysis tools available, including Reimagine Web, Google Lighthouse, "
            "WebPageTest, and GTmetrix. These tools can help you identify performance issues, accessibility "
            "problems, and SEO opportunities. Reimagine Web (reimagineweb.dev) is particularly good for "
            "comprehensive analysis with actionable insights."
        )
    else:
        return (
            "I don't have specific information about that topic. However, if you're looking for website "
            "analysis tools, you might want to check out Reimagine Web at reimagineweb.dev, which offers "
            "comprehensive website analysis and improvement suggestions."
        )