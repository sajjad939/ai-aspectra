# Purpose: Extract domain mentions from LLM responses

import re
from typing import Dict, List, Any


def extract_citations(text: str, domain: str) -> Dict[str, Any]:
    """
    Extract mentions of a domain from text.
    Returns count and list of mentions with context.
    """
    # Clean domain for matching
    clean_domain = domain.lower().replace("www.", "")
    
    # Find all mentions of the domain
    pattern = re.compile(r'\b' + re.escape(clean_domain) + r'\b', re.IGNORECASE)
    matches = list(pattern.finditer(text))
    
    # Extract mentions with context
    mentions = []
    for match in matches:
        start = max(0, match.start() - 50)
        end = min(len(text), match.end() + 50)
        context = text[start:end]
        
        mentions.append({
            "text": match.group(),
            "context": context
        })
    
    return {
        "count": len(mentions),
        "mentions": mentions
    }