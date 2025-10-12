# Purpose: compute readability scores (Flesch, FK grade, simple counts)
# Requirements: textstat (optional). This file includes a fallback implementation.

import re
from typing import Dict


def count_syllables(word: str) -> int:
    """Rudimentary syllable counter. Works well enough for English QA in a sprint."""
    word = word.lower()
    word = re.sub(r'[^a-z]', '', word)
    if len(word) <= 3:
        return 1
    vowels = 'aeiouy'
    sylls = 0
    prev_was_vowel = False
    for ch in word:
        is_vowel = ch in vowels
        if is_vowel and not prev_was_vowel:
            sylls += 1
        prev_was_vowel = is_vowel
    if word.endswith('e'):
        sylls = max(1, sylls - 1)
    return max(1, sylls)


def flesch_kincaid_readability(text: str) -> Dict[str, float]:
    """
    Returns a small dictionary: {flesch_reading_ease, fk_grade}
    Formula references: standard Flesch-Kincaid formulas.
    """
    try:
        sentences = max(1, len(re.findall(r'[.!?]+', text)))
        words_list = re.findall(r"\w+", text)
        words = max(1, len(words_list))
        syllables = sum(count_syllables(w) for w in words_list)

        # Flesch Reading Ease
        # 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
        fre = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
        # Flesch-Kincaid grade
        fk = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
        return {
            'flesch_reading_ease': round(fre, 2),
            'flesch_kincaid_grade': round(fk, 2),
            'sentences': sentences,
            'words': words,
            'syllables': syllables,
        }
    except Exception as e:
        print(f"Warning: Readability calculation failed: {e}")
        return {
            'flesch_reading_ease': 50.0,  # Neutral fallback
            'flesch_kincaid_grade': 8.0,   # Average reading level
            'sentences': 1,
            'words': len(text.split()) if text else 0,
            'syllables': len(text.split()) if text else 0,
            'error': str(e)
        }