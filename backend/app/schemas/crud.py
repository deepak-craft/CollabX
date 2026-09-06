from datetime import datetime

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    name: str = Field(..., min_length=2, max_length=180)
    email: str | None = Field(None, max_length=255)
    role: str = Field("citizen", min_length=2, max_length=50)


class UserResponse(UserCreate):
    id: str
    created_at: datetime
    updated_at: datetime


class GovernmentReportUpdate(BaseModel):
    status: str | None = Field(None, min_length=2, max_length=50)
    category: str | None = Field(None, min_length=2, max_length=120)
    priority: str | None = Field(None, min_length=2, max_length=20)
    duplicate_status: str | None = Field(None, max_length=40)
    duplicate_of: str | None = Field(None, max_length=64)
    ai_analysis: str | None = None
    workflow_stage: str | None = Field(None, max_length=50)
    department: str | None = Field(None, max_length=120)


class ReportRoutingDecision(BaseModel):
    route: str = Field(..., pattern=r"^(routine|innovation)$")
    department: str | None = Field(None, min_length=2, max_length=120)


class ChallengeCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    problem_report_id: str
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    domain: str = Field(..., min_length=2, max_length=180)
    technologies: list[str] = Field(default_factory=list, max_length=50)


class IdeaCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    submitted_by: str | None = Field(None, max_length=128)
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)


class ProjectCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    name: str = Field(..., min_length=3, max_length=255)
    description: str | None = None


class MilestoneCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    title: str = Field(..., min_length=2, max_length=255)
    description: str | None = None
    due_at: datetime | None = None


class FeedbackCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    submitted_by: str | None = Field(None, max_length=128)
    rating: int | None = Field(None, ge=1, le=5)
    comments: str | None = None
    solved_status: str | None = Field(None, pattern=r"^(YES|PARTIALLY|NO)$")
    locality: str | None = Field(None, max_length=180)
    photo_proof_url: str | None = None


class PilotMetricsUpdate(BaseModel):
    status: str | None = Field(None, pattern=r"^(planned|prototype|testing|pilot|completed)$")
    metrics: dict[str, object] | None = None


class IdeaReview(BaseModel):
    ai_screening: str | None = None
    expert_evaluation: str | None = None
    status: str = Field(..., pattern=r"^(submitted|screened|evaluated|selected|rejected)$")