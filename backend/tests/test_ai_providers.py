import asyncio
import json

from app.core.config import settings
from app.schemas.ai import IdeaScreeningOutput, ProblemStructuringOutput
from app.services import embedding_service, idea_screening, problem_structuring


class FakeResponse:
    def __init__(self, payload):
        self.payload = json.dumps(payload).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return None

    def read(self):
        return self.payload


def _run(awaitable):
    return asyncio.run(awaitable)


def test_problem_structuring_uses_mocked_provider(monkeypatch):
    monkeypatch.setattr(settings, "ai_enabled", True)
    monkeypatch.setattr(settings, "ai_provider_url", "https://provider.test/chat")
    monkeypatch.setattr(settings, "ai_api_key", "test-key")
    monkeypatch.setattr(
        problem_structuring,
        "urlopen",
        lambda request, timeout: FakeResponse({"choices": [{"message": {"content": json.dumps({
            "summary": "Blocked drain",
            "category": "Water Management",
            "problem_type": "Drainage failure",
            "severity": 80,
            "affected_population": 120,
            "recurrence": 75,
            "priority_score": 78,
            "priority_level": "High",
            "keywords": ["drain", "flooding"],
            "confidence": 91,
        })}}]}),
    )

    result = _run(problem_structuring.structure_problem("Blocked drain floods the road", "Ranchi"))

    assert isinstance(result, ProblemStructuringOutput)
    assert result.confidence == 91
    assert result.priority_level == "High"


def test_idea_screening_uses_mocked_provider_and_remains_advisory(monkeypatch):
    monkeypatch.setattr(settings, "ai_enabled", True)
    monkeypatch.setattr(settings, "ai_provider_url", "https://provider.test/chat")
    monkeypatch.setattr(
        idea_screening,
        "urlopen",
        lambda request, timeout: FakeResponse({"choices": [{"message": {"content": json.dumps({
            "feasibility": 80,
            "impact": 90,
            "estimated_cost": 70,
            "scalability": 75,
            "technical_suitability": 85,
            "recommendation_score": 80,
            "explanation": "Promising preliminary proposal.",
            "confidence": 88,
            "advisory_only": True,
        })}}]}),
    )

    result = _run(idea_screening.screen_idea("Drainage sensors", "Deploy low-cost sensors for flood alerts"))

    assert isinstance(result, IdeaScreeningOutput)
    assert result.recommendation_score == 80
    assert result.advisory_only is True


def test_provider_failures_use_existing_local_fallback(monkeypatch):
    monkeypatch.setattr(settings, "ai_enabled", True)
    monkeypatch.setattr(settings, "ai_provider_url", "https://provider.test/chat")
    monkeypatch.setattr(problem_structuring, "_provider_recommendation", lambda *_args: (_ for _ in ()).throw(RuntimeError("provider unavailable")))
    monkeypatch.setattr(idea_screening, "_provider_screening", lambda *_args: (_ for _ in ()).throw(RuntimeError("provider unavailable")))
    monkeypatch.setattr(settings, "ai_embedding_enabled", True)
    monkeypatch.setattr(embedding_service, "_provider_embedding", lambda *_args: (_ for _ in ()).throw(RuntimeError("provider unavailable")))

    problem = _run(problem_structuring.structure_problem("Frequent flooding affects residents"))
    idea = _run(idea_screening.screen_idea("Water alert", "A local flood alert platform"))
    embedding = embedding_service._build_embedding("water drainage monitoring")

    assert problem.summary
    assert idea.advisory_only is True
    assert len(embedding) == 256
