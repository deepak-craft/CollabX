from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProblemStructuringOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    summary: str = Field(..., min_length=1, max_length=1000)
    category: str = Field(..., min_length=1, max_length=120)
    problem_type: str = Field(..., min_length=1, max_length=120)
    severity: int = Field(..., ge=0, le=100)
    affected_population: int = Field(..., ge=0)
    recurrence: int = Field(..., ge=0, le=100)
    priority_score: int = Field(..., ge=0, le=100)
    priority_level: Literal["Low", "Medium", "High", "Critical"]
    keywords: list[str] = Field(default_factory=list, max_length=20)
    confidence: int = Field(default=70, ge=0, le=100)

    @field_validator("keywords")
    @classmethod
    def normalize_keywords(cls, keywords: list[str]) -> list[str]:
        return [keyword.strip().lower() for keyword in keywords if keyword.strip()]


class IdeaScreeningOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    feasibility: int = Field(..., ge=0, le=100)
    impact: int = Field(..., ge=0, le=100)
    estimated_cost: int = Field(..., ge=0, le=100)
    scalability: int = Field(..., ge=0, le=100)
    technical_suitability: int = Field(..., ge=0, le=100)
    recommendation_score: int = Field(..., ge=0, le=100)
    explanation: str = Field(..., min_length=1, max_length=2000)
    confidence: int = Field(default=70, ge=0, le=100)
    advisory_only: bool = True