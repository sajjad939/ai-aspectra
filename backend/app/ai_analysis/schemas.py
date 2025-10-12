# Purpose: Pydantic-compatible schemas for results so backend can return typed JSON.

from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ContrastIssue(BaseModel):
    selector: str
    foreground: str
    background: str
    ratio: float
    text: Optional[str] = None


class ReadabilityResult(BaseModel):
    flesch_reading_ease: float
    flesch_kincaid_grade: float
    sentences: int
    words: int
    syllables: int
    error: Optional[str] = None


class SaliencyResult(BaseModel):
    saliency_png: str  # path/url
    salmap_png: Optional[str] = None
    cta_saliency: Optional[float] = None
    dominant_regions: Optional[List[str]] = None


class AxeViolation(BaseModel):
    id: str
    impact: str
    description: str
    nodes: List[Dict[str, Any]]


class CitationMention(BaseModel):
    text: str
    context: str


class PromptResult(BaseModel):
    prompt: str
    response: str
    citation_count: int
    citations: List[CitationMention]


class WebsiteAnalysisReport(BaseModel):
    """Website analysis report from BrowseAI or Playwright"""
    seo_score: Optional[int] = None
    accessibility_score: Optional[int] = None
    visual_score: Optional[int] = None
    top_issues: List[str] = []
    error: Optional[str] = None


class GeoSummary(BaseModel):
    geo_score: float
    total_mentions: int


class AnalysisResult(BaseModel):
    url: str
    screenshot: str
    saliency: SaliencyResult
    readability: ReadabilityResult
    contrast_issues: List[ContrastIssue]
    axe_violations: Optional[List[AxeViolation]] = None
    website_analysis_report: Optional[WebsiteAnalysisReport] = None
    prompt_details: Optional[List[PromptResult]] = None
    suggestions: List[str]
    geo_summary: Optional[GeoSummary] = None