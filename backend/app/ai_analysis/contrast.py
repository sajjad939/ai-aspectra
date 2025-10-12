# Purpose: compute WCAG contrast ratio for foreground/background colors.
# Input: colors as hex strings like '#ffffff' or rgb tuples.

from typing import Tuple, Dict


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def relative_luminance(rgb: Tuple[int, int, int]) -> float:
    # Convert sRGB to linear and compute relative luminance (WCAG)
    def channel(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def contrast_ratio(color1: str, color2: str) -> float:
    """Compute contrast ratio between two hex colors."""
    try:
        rgb1 = hex_to_rgb(color1) if isinstance(color1, str) else color1
        rgb2 = hex_to_rgb(color2) if isinstance(color2, str) else color2
        L1 = relative_luminance(rgb1)
        L2 = relative_luminance(rgb2)
        lighter = max(L1, L2)
        darker = min(L1, L2)
        ratio = (lighter + 0.05) / (darker + 0.05)
        return round(ratio, 2)
    except Exception as e:
        print(f"Warning: Contrast calculation failed: {e}")
        return 1.0  # Default to lowest contrast on error


def wcag_pass_level(ratio: float) -> Dict[str, str]:
    """Return WCAG level for normal text and large text.
    - normal text: pass AA if >= 4.5, AAA if >= 7.0
    - large text: pass AA if >= 3.0, AAA if >= 4.5
    """
    result = {
        'normal_text': 'fail',
        'large_text': 'fail'
    }
    if ratio >= 7.0:
        result['normal_text'] = 'AAA'
        result['large_text'] = 'AAA'
    elif ratio >= 4.5:
        result['normal_text'] = 'AA'
        result['large_text'] = 'AAA'
    elif ratio >= 3.0:
        result['large_text'] = 'AA'
    return result