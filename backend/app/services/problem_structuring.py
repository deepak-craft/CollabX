from __future__ import annotations

import asyncio
import json
import logging
import re
from urllib.request import Request, urlopen

from app.core.config import settings
from app.schemas.ai import ProblemStructuringOutput

logger = logging.getLogger(__name__)


def _priority_level(score: int) -> str:
    if score >= 85:
        return "Critical"
    if score >= 65:
        return "High"
    if score >= 35:
        return "Medium"
    return "Low"


def _local_recommendation(description: str) -> ProblemStructuringOutput:
    text = description.strip()
    normalized = text.lower()
    keywords = re.findall(r"[a-zA-Z]{4,}", normalized)
    keyword_list = list(dict.fromkeys(keywords))[:10]

    category = "Urban Infrastructure & Public Works"
    problem_type = "Civic service disruption"
    if any(word in normalized for word in ("water", "drain", "flood", "rain")):
        category = "Disaster Management / Water Management"
        problem_type = "Waterlogging or drainage failure"
    elif any(word in normalized for word in ("road", "pothole", "bridge", "traffic")):
        category = "Transportation & Structural Safety"
        problem_type = "Road or transport infrastructure defect"
    elif any(word in normalized for word in ("power", "electricity", "transformer")):
        category = "Energy & Power Distribution"
        problem_type = "Power supply disruption"
    elif any(word in normalized for word in ("hospital", "clinic", "medicine", "health")):
        category = "Public Health & Sanitation"
        problem_type = "Public health service issue"

    severity = 70 if any(word in normalized for word in ("danger", "unsafe", "injury", "accident", "emergency")) else 45
    recurrence = 75 if any(word in normalized for word in ("daily", "often", "frequent", "every", "repeated", "regular")) else 35
    affected_match = re.search(r"\b(\d[\d,]*)\s*(?:people|families|households|students|residents)\b", normalized)
    affected_population = int(affected_match.group(1).replace(",", "")) if affected_match else 0
    population_score = min(25, affected_population // 500) if affected_population else 0
    priority_score = min(100, round(severity * 0.55 + recurrence * 0.3 + population_score))

    return ProblemStructuringOutput(
        summary=text[:1000],
        category=category,
        problem_type=problem_type,
        severity=severity,
        affected_population=affected_population,
        recurrence=recurrence,
        priority_score=priority_score,
        priority_level=_priority_level(priority_score),
        keywords=keyword_list,
        confidence=65,
    )


def _provider_recommendation(description: str, context: str = "") -> ProblemStructuringOutput:
    if not settings.ai_provider_url:
        raise RuntimeError("AI provider is not configured")

    request_body = {
        "model": settings.ai_model,
        "temperature": 0,
        "messages": [
            {
                "role": "system",
                "content": "Return only valid JSON matching the ProblemStructuringOutput schema. AI output is advisory and must never reject a report.",
            },
            {"role": "user", "content": f"Problem: {description}\nContext: {context}" if context else description},
        ],
    }
    headers = {"Content-Type": "application/json"}
    if settings.ai_api_key:
        headers["Authorization"] = f"Bearer {settings.ai_api_key}"

    request = Request(
        settings.ai_provider_url,
        data=json.dumps(request_body).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    with urlopen(request, timeout=settings.ai_timeout_seconds) as response:
        response_data = json.loads(response.read().decode("utf-8"))

    content = response_data.get("choices", [{}])[0].get("message", {}).get("content", response_data)
    if isinstance(content, str):
        content = content.strip().removeprefix("```json").removesuffix("```").strip()
        content = json.loads(content)
    return ProblemStructuringOutput.model_validate(content)


async def structure_problem(description: str, context: str = "") -> ProblemStructuringOutput:
    """Return advisory structure without making persistence depend on an AI provider."""
    if settings.ai_enabled:
        try:
            return await asyncio.to_thread(_provider_recommendation, description, context)
        except Exception:
            logger.exception("AI problem structuring failed; using local recommendation")
    return _local_recommendation(description)