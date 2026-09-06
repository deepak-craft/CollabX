from __future__ import annotations

import re
from typing import Iterable


def tokenize(text: str) -> set[str]:
    return {token.lower() for token in re.findall(r"[a-zA-Z]+", text or "")}


def similarity_score(a: str, b: str) -> float:
    tokens_a = tokenize(a)
    tokens_b = tokenize(b)
    if not tokens_a or not tokens_b:
        return 0.0

    overlap = len(tokens_a & tokens_b)
    union = len(tokens_a | tokens_b)
    if union == 0:
        return 0.0

    return round((overlap / union) * 100, 2)


def find_duplicate_candidates(report_text: str, existing_reports: Iterable[str]) -> dict[str, float]:
    scores: dict[str, float] = {}
    for idx, existing in enumerate(existing_reports):
        scores[str(idx)] = similarity_score(report_text, existing)
    return scores
