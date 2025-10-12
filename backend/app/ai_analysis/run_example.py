# Purpose: example runner for Vispectra AI/ML modules.
# Usage examples:
#  python run_example.py --screenshot /path/to/screenshot.png --outdir /path/to/outdir
#  python run_example.py --sample --outdir /path/to/outdir

"""
Run the Vispectra ML demo pipeline from a screenshot.
This script expects to be placed in the same folder as saliency.py, readability.py, contrast.py and summarizer.py
(backend/app/analysis/). It will add the current folder to sys.path so `import saliency` works when executed from
anywhere.

It accepts either a screenshot path or the --sample flag. If a text file (--textfile) is provided, it will compute
readability from that text; otherwise it uses a built-in sample paragraph.

Outputs saved in <outdir>:
 - overlay.png      (screenshot with heatmap overlay)
 - salmap.png       (gray saliency map)
 - result.json      (combined JSON with readability/contrast/suggestions/result file paths)

Note: for production use, the backend should call saliency.generate_overlay_from_file() directly rather than running
this script as a subprocess.
"""

import argparse
import json
import sys
from pathlib import Path

# allow imports when running from any path (ensures local modules are found)
here = Path(__file__).resolve().parent
if str(here) not in sys.path:
    sys.path.insert(0, str(here))

# local imports (these files are in this same folder)
from saliency import generate_overlay_from_file
from readability import flesch_kincaid_readability
from contrast import contrast_ratio
from summarizer import generate_suggestions


def parse_args():
    p = argparse.ArgumentParser(description='Vispectra ML demo runner')
    p.add_argument('--screenshot', '-s', help='Path to full-page screenshot PNG/JPG')
    p.add_argument('--outdir', '-o', default='results', help='Output directory')
    p.add_argument('--sample', action='store_true', help='Use bundled sample image at analysis/sample_screenshot.png')
    p.add_argument('--textfile', '-t', help='Optional plaintext file containing page text to score readability')
    p.add_argument('--contrast-file', '-c', help='Optional JSON file with contrast pairs: [{"selector": ".cta","fg":"#fff","bg":"#000"}, ...]')
    p.add_argument('--verbose', '-v', action='store_true', help='Verbose logging')
    return p.parse_args()


def read_text_from_file(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def load_contrast_pairs(path: Path):
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
        # expect list of {selector, fg, bg}
        return data
    except Exception:
        return []


def main():
    args = parse_args()
    if not args.screenshot and not args.sample:
        print('Error: supply --screenshot or --sample. See --help for usage.')
        sys.exit(2)

    if args.sample:
        sample_path = here / 'sample_screenshot.png'
        if not sample_path.exists():
            print('Sample image not found at', sample_path)
            print('Creating a simple test image...')
            try:
                from PIL import Image
                img = Image.new('RGB', (300, 200), color=(73, 109, 137))
                img.save(str(sample_path))
                print(f'Created test image at {sample_path}')
            except Exception as e:
                print(f'Failed to create test image: {e}')
                print('Either provide --screenshot or place a file named sample_screenshot.png next to this script.')
                sys.exit(1)
        screenshot = str(sample_path)
    else:
        screenshot = args.screenshot

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    overlay_path = str(outdir / 'overlay.png')
    salmap_path = str(outdir / 'salmap.png')

    if args.verbose:
        print(f'Processing screenshot: {screenshot}\n  output -> {outdir}')

    # Saliency / overlay
    try:
        generate_overlay_from_file(screenshot, overlay_path, salmap_path)
        if args.verbose:
            print('Saved overlay ->', overlay_path)
    except ModuleNotFoundError as e:
        print(f'Error: Missing module {e.name}. Please install required packages:')
        print('pip install opencv-python numpy pillow')
        sys.exit(1)
    except Exception as e:
        print('Saliency failed:', e)

    # Readability
    if args.textfile:
        text = read_text_from_file(Path(args.textfile))
    else:
        text = (
            "This is a sample paragraph used to demonstrate readability scoring. Replace with page text pulled "
            "from the site (playwright should extract article text or main content)."
        )

    try:
        readability = flesch_kincaid_readability(text)
    except Exception as e:
        print('Readability failed:', e)
        readability = {}

    # Contrast (if provided)
    contrast_issues = []
    if args.contrast_file:
        pairs = load_contrast_pairs(Path(args.contrast_file))
    else:
        pairs = [
            {"selector": "example", "fg": "#222222", "bg": "#ffffff"}
        ]

    for pitem in pairs:
        try:
            r = contrast_ratio(pitem.get('fg'), pitem.get('bg'))
            contrast_issues.append({'selector': pitem.get('selector', 'element'), 'foreground': pitem.get('fg'), 'background': pitem.get('bg'), 'ratio': r})
        except Exception as e:
            contrast_issues.append({'selector': pitem.get('selector', 'element'), 'foreground': pitem.get('fg'), 'background': pitem.get('bg'), 'ratio': None, 'error': str(e)})

    # Saliency summary (simple heuristics for demo)
    cta_saliency = None
    try:
        # Basic heuristic: average intensity in salmap center area (if salmap exists)
        from PIL import Image
        import numpy as np
        salmap_file = Path(salmap_path)
        if salmap_file.exists():
            sm = Image.open(salmap_file).convert('L')
            w, h = sm.size
            cx1 = int(w * 0.33)
            cy1 = int(h * 0.4)
            cx2 = int(w * 0.66)
            cy2 = int(h * 0.7)
            crop = sm.crop((cx1, cy1, cx2, cy2))
            arr = (np.array(crop).astype('float32') / 255.0)
            cta_saliency = float(arr.mean()) if arr.size else 0.0
    except Exception:
        cta_saliency = None

    saliency_summary = {'cta_saliency': cta_saliency, 'dominant_regions': ['top-hero']}

    # Suggestions
    try:
        suggestions = generate_suggestions(saliency_summary, contrast_issues, readability)
    except Exception as e:
        suggestions = [f'Failed to generate suggestions: {e}']

    # Save combined JSON result
    result = {
        'screenshot': str(screenshot),
        'overlay': overlay_path,
        'salmap': salmap_path,
        'readability': readability,
        'contrast_issues': contrast_issues,
        'saliency_summary': saliency_summary,
        'suggestions': suggestions
    }

    result_file = outdir / 'result.json'
    result_file.write_text(json.dumps(result, indent=2), encoding='utf-8')

    print('\nAnalysis complete. Outputs:')
    print(' - overlay :', overlay_path)
    print(' - salmap  :', salmap_path)
    print(' - result  :', result_file)


if __name__ == '__main__':
    main()