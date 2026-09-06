from __future__ import annotations

import asyncio
import json
import logging
from urllib.request import Request, urlopen

from app.core.config import settings
from app.schemas.ai import IdeaScreeningOutput

logger = logging.getLogger(__name__)


def _local_screening(title: str, description: str) -> IdeaScreeningOutput:
    text = f"{title} {description}".lower()
    technical = 75 if any(word in text for word in ("sensor", "software", "platform", "data", "app", "prototype")) else 55
    impact = 80 if any(word in text for word in ("water", "health", "safety", "flood", "school", "community")) else 60
    scalability = 70 if any(word in text for word in ("open", "modular", "replicate", "scale", "district")) else 55
    feasibility = round((technical + scalability) / 2)
    estimated_cost = 70 if any(word in text for word in ("open source", "low cost", "existing", "local")) else 55
    recommendation_score = round((feasibility + impact + estimated_cost + scalability + technical) / 5)
    return IdeaScreeningOutput(
        feasibility=feasibility,
        impact=impact,
        estimated_cost=estimated_cost,
        scalability=scalability,
        technical_suitability=technical,
        recommendation_score=recommendation_score,
        explanation="Preliminary screening based on the submitted proposal. Expert review is required before selection.",
        confidence=60,
        advisory_only=True,
    )


def _provider_screening(title: str, description: str) -> IdeaScreeningOutput:
    if not settings.ai_provider_url:
        raise RuntimeError("AI provider is not configured")
    request_body = {
        "model": settings.ai_idea_screening_model,
        "temperature": 0,
        "messages": [
            {
                "role": "system",
                "content": "Return only valid JSON matching IdeaScreeningOutput. This is advisory decision support; never select, reject, or approve an idea.",
            },
            {"role": "user", "content": f"Title: {title}\nDescription: {description}"},
        ],
    }
    headers = {"Content-Type": "application/json"}
    if settings.ai_api_key:
        headers["Authorization"] = f"Bearer {settings.ai_api_key}"
    request = Request(settings.ai_provider_url, data=json.dumps(request_body).encode("utf-8"), headers=headers, method="POST")
    with urlopen(request, timeout=settings.ai_timeout_seconds) as response:
        response_data = json.loads(response.read().decode("utf-8"))
    content = response_data.get("choices", [{}])[0].get("message", {}).get("content", response_data)
    if isinstance(content, str):
        content = content.strip().removeprefix("```json").removesuffix("```").strip()
        content = json.loads(content)
    return IdeaScreeningOutput.model_validate(content)


async def screen_idea(title: str, description: str) -> IdeaScreeningOutput:
    """Return preliminary scores only; selection remains an expert/government action."""
    if settings.ai_enabled:
        try:
            return await asyncio.to_thread(_provider_screening, title, description)
        except Exception:
            logger.warning("AI idea screening failed; using local advisory screening")
    return _local_screening(title, description)
