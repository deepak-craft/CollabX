from typing import Literal

from pydantic import BaseModel, Field


class UniversityProfileCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    name: str = Field(..., min_length=2, max_length=180)
    domain: str = Field(..., min_length=2, max_length=180)
    technologies: list[str] = Field(default_factory=list, max_length=50)
    expertise: str = Field(..., min_length=10)
    student_team_skills: str = Field(..., min_length=2)
    previous_project_areas: list[str] = Field(default_factory=list, max_length=50)
    location: str | None = Field(None, max_length=180)


class IndustryProfileCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    name: str = Field(..., min_length=2, max_length=180)
    domain: str = Field(..., min_length=2, max_length=180)
    technologies: list[str] = Field(default_factory=list, max_length=50)
    support_capabilities: str = Field(..., min_length=10)
    mentorship_capability: str = Field(..., min_length=2)
    funding_csr_capability: str = Field(..., min_length=2)
    location: str | None = Field(None, max_length=180)


class OpenChallengeCreate(BaseModel):
    id: str | None = Field(None, min_length=1, max_length=128)
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    domain: str = Field(..., min_length=2, max_length=180)
    technologies: list[str] = Field(default_factory=list, max_length=50)
    location: str | None = Field(None, max_length=180)


class MatchDecision(BaseModel):
    status: Literal["accepted", "rejected"]
    reviewed_by: str = Field(..., min_length=1, max_length=128)