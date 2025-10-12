# Purpose: combine saliency + contrast + readability to produce human-friendly suggestions.

from typing import Dict, Any, List


def generate_suggestions(saliency_summary: Dict[str, Any], contrast_issues: List[Dict[str, Any]], readability: Dict[str, Any]) -> List[str]:
    """
    Simple heuristic-based suggestions. Input examples:
    - saliency_summary = { 'dominant_regions': ['top banner', 'left nav'], 'cta_saliency': 0.2 }
    - contrast_issues = [ { 'selector': 'h1', 'ratio': 2.1 }, ...]
    - readability = output of flesch_kincaid_readability
    """
    suggestions = []

    # Readability suggestions
    fk = readability.get('flesch_kincaid_grade')
    fre = readability.get('flesch_reading_ease')
    if fk and fk > 10:
        suggestions.append(f"Text reads at grade {fk} — consider simplifying headings and paragraph sentences to lower reading level (aim ~7-9).")
    if fre and fre < 60:
        suggestions.append(f"Flesch Reading Ease is {fre} — consider shortening sentences and using simpler words.")

    # Contrast suggestions
    for issue in contrast_issues[:5]:  # Limit to top 5 issues
        selector = issue.get('selector', 'element')
        ratio = issue.get('ratio')
        suggestions.append(f"Contrast issue: {selector} has ratio {ratio}. Increase contrast or change background to pass WCAG AA.")

    # Saliency-driven suggestions
    cta_saliency = saliency_summary.get('cta_saliency')
    if cta_saliency is not None:
        if cta_saliency < 0.25:
            suggestions.append("Primary CTA has low visual saliency — increase size, contrast, or move it into a focal area.")
        else:
            suggestions.append("Primary CTA falls within the visual focal region 👍")

    # Add accessibility suggestions based on axe violations
    if hasattr(saliency_summary, 'axe_violations') and saliency_summary.get('axe_violations'):
        violations = saliency_summary.get('axe_violations', [])
        if violations:
            suggestions.append(f"Found {len(violations)} accessibility violations. Fix these to improve inclusivity.")

    # Add website analysis suggestions if available
    if hasattr(saliency_summary, 'website_analysis_report') and saliency_summary.get('website_analysis_report'):
        analysis = saliency_summary.get('website_analysis_report', {})
        if analysis.get('top_issues'):
            for issue in analysis.get('top_issues')[:3]:  # Top 3 issues
                suggestions.append(f"Website analysis suggestion: {issue}")

    if not suggestions:
        suggestions.append("No major issues detected — consider A/B tests to validate these results with real users.")
    
    return suggestions