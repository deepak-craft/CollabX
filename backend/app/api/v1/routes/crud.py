from __future__ import annotations

import json
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.routes.reports import get_db, serialize_report
from app.core.security import forbid_roles, get_current_user, require_roles
from app.models.matching import OpenChallenge
from app.models.normalized import Challenge, Feedback, Idea, Milestone, Project, User
from app.models.report import Report
from app.services.audit_service import record_audit
from app.services.idea_screening import screen_idea
from app.schemas.crud import (
    ChallengeCreate,
    FeedbackCreate,
    GovernmentReportUpdate,
    IdeaCreate,
    IdeaReview,
    MilestoneCreate,
    PilotMetricsUpdate,
    ProjectCreate,
    ReportRoutingDecision,
    UserCreate,
    UserResponse,
)

router = APIRouter()


def now() -> datetime:
    return datetime.now(timezone.utc)


def serialize_entity(entity) -> dict[str, object]:
    result = {column.name: getattr(entity, column.name) for column in entity.__table__.columns}
    if "technologies" in result and isinstance(result["technologies"], str):
        result["technologies"] = json.loads(result["technologies"])
    return result


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    user_id = payload.id or f"user-{uuid4().hex}"
    if db.get(User, user_id):
        raise HTTPException(status_code=409, detail="User already exists")
    timestamp = now()
    user = User(id=user_id, name=payload.name, email=payload.email, role=payload.role, created_at=timestamp, updated_at=timestamp)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/users/{user_id}/reports")
async def get_user_reports(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[dict[str, object]]:
    if current_user.id != user_id and current_user.role not in {"government", "expert"}:
        raise HTTPException(status_code=403, detail="You may only access your own reports")
    if db.get(User, user_id) is None:
        raise HTTPException(status_code=404, detail="User not found")
    reports = db.scalars(select(Report).where(Report.citizen_id == user_id).order_by(Report.created_at.desc())).all()
    return [serialize_report(report) for report in reports]


@router.patch("/reports/{report_id}/validation")
async def validate_report(report_id: str, payload: GovernmentReportUpdate, db: Session = Depends(get_db), actor: User = Depends(forbid_roles("government"))) -> dict[str, object]:
    report = db.get(Report, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Problem report not found")
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="At least one validation field is required")
    for field, value in updates.items():
        setattr(report, field, value)
    if report.status == "verified":
        report.workflow_stage = "validated"
    report.updated_at = now()
    record_audit(db, actor.id, actor.role, "VALIDATE_REPORT", "report", report.id, updates)
    db.commit()
    db.refresh(report)
    return serialize_report(report)


@router.post("/challenges", status_code=status.HTTP_201_CREATED)
async def create_challenge(payload: ChallengeCreate, db: Session = Depends(get_db), actor: User = Depends(forbid_roles("government"))) -> dict[str, object]:
    report = db.get(Report, payload.problem_report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Problem report not found")
    if report.status not in {"verified", "challenge_created", "in_project", "pilot_deployed"}:
        raise HTTPException(status_code=409, detail="Challenge must be linked to a validated problem report")
    challenge_id = payload.id or f"challenge-{uuid4().hex}"
    if db.get(Challenge, challenge_id):
        raise HTTPException(status_code=409, detail="Challenge already exists")
    timestamp = now()
    challenge = Challenge(
        id=challenge_id,
        problem_report_id=report.id,
        title=payload.title,
        description=payload.description,
        domain=payload.domain,
        technologies=json.dumps(payload.technologies),
        status="open",
        created_at=timestamp,
        updated_at=timestamp,
    )
    report.status = "challenge_created"
    report.workflow_stage = "challenge_created"
    record_audit(db, actor.id, actor.role, "CREATE_CHALLENGE", "challenge", challenge.id, {"problem_report_id": report.id})
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return serialize_entity(challenge)


@router.patch("/reports/{report_id}/routing")
async def route_report(report_id: str, payload: ReportRoutingDecision, db: Session = Depends(get_db), actor: User = Depends(forbid_roles("government"))) -> dict[str, object]:
    report = db.get(Report, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Problem report not found")
    if payload.route == "routine" and not payload.department:
        raise HTTPException(status_code=400, detail="Routine reports require a department")
    report.department = payload.department
    report.workflow_stage = "department_routed" if payload.route == "routine" else "innovation_candidate"
    report.updated_at = now()
    record_audit(db, actor.id, actor.role, "ROUTE_REPORT", "report", report.id, payload.model_dump())
    db.commit()
    db.refresh(report)
    return serialize_report(report)


@router.get("/challenges")
async def get_challenges(db: Session = Depends(get_db), _user: User = Depends(get_current_user)) -> list[dict[str, object]]:
    challenges = db.scalars(select(Challenge).order_by(Challenge.created_at.desc())).all()
    return [serialize_entity(challenge) for challenge in challenges]


@router.post("/challenges/{challenge_id}/ideas", status_code=status.HTTP_201_CREATED)
async def submit_idea(challenge_id: str, payload: IdeaCreate, db: Session = Depends(get_db), submitting_user: User = Depends(require_roles("student", "professor"))) -> dict[str, object]:
    if db.get(Challenge, challenge_id) is None:
        raise HTTPException(status_code=404, detail="Challenge not found")
    if payload.submitted_by and payload.submitted_by != submitting_user.id:
        raise HTTPException(status_code=403, detail="Ideas must be submitted for the authenticated user")
    idea = Idea(
        id=payload.id or f"idea-{uuid4().hex}",
        challenge_id=challenge_id,
        submitted_by=submitting_user.id,
        title=payload.title,
        description=payload.description,
        status="submitted",
        created_at=now(),
        updated_at=now(),
    )
    db.add(idea)
    record_audit(db, submitting_user.id, submitting_user.role, "SUBMIT_IDEA", "idea", idea.id, {"challenge_id": challenge_id})
    db.commit()
    db.refresh(idea)
    return serialize_entity(idea)


@router.post("/ideas/{idea_id}/projects", status_code=status.HTTP_201_CREATED)
async def create_project(idea_id: str, payload: ProjectCreate, db: Session = Depends(get_db), actor: User = Depends(forbid_roles("government"))) -> dict[str, object]:
    idea = db.get(Idea, idea_id)
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    project = Project(
        id=payload.id or f"project-{uuid4().hex}",
        idea_id=idea_id,
        name=payload.name,
        description=payload.description,
        status="planned",
        created_at=now(),
        updated_at=now(),
    )
    db.add(project)
    idea.status = "selected"
    idea.selected_at = now()
    record_audit(db, actor.id, actor.role, "CREATE_PROJECT", "project", project.id, {"idea_id": idea_id})
    db.commit()
    db.refresh(project)
    return serialize_entity(project)


@router.get("/projects/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db), _user: User = Depends(get_current_user)) -> dict[str, object]:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_entity(project)


@router.patch("/projects/{project_id}/pilot")
async def update_pilot(project_id: str, payload: PilotMetricsUpdate, db: Session = Depends(get_db), actor: User = Depends(require_roles("expert", "professor", "industry"))) -> dict[str, object]:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.status is None and payload.metrics is None:
        raise HTTPException(status_code=400, detail="Pilot status or metrics are required")
    if payload.status is not None:
        project.status = payload.status
    if payload.metrics is not None:
        project.pilot_metrics_json = json.dumps(payload.metrics)
    project.updated_at = now()
    record_audit(db, actor.id, actor.role, "UPDATE_PILOT", "project", project.id, payload.model_dump(exclude_none=True))
    db.commit()
    db.refresh(project)
    return serialize_entity(project)


@router.post("/ideas/{idea_id}/screen")
async def screen_idea_route(idea_id: str, db: Session = Depends(get_db), actor: User = Depends(require_roles("expert", "professor"))) -> dict[str, object]:
    idea = db.get(Idea, idea_id)
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    screening = await screen_idea(idea.title, idea.description)
    idea.ai_screening = screening.model_dump_json()
    idea.status = "screened"
    record_audit(db, actor.id, actor.role, "SCREEN_IDEA", "idea", idea.id, {"advisory_only": True})
    db.commit()
    db.refresh(idea)
    return {"idea_id": idea.id, "screening": screening.model_dump(), "status": idea.status, "advisory_only": True}


@router.post("/projects/{project_id}/milestones", status_code=status.HTTP_201_CREATED)
async def create_milestone(project_id: str, payload: MilestoneCreate, db: Session = Depends(get_db), actor: User = Depends(require_roles("professor", "industry"))) -> dict[str, object]:
    if db.get(Project, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    milestone = Milestone(
        id=payload.id or f"milestone-{uuid4().hex}",
        project_id=project_id,
        title=payload.title,
        description=payload.description,
        status="pending",
        due_at=payload.due_at,
        created_at=now(),
        updated_at=now(),
    )
    db.add(milestone)
    record_audit(db, actor.id, actor.role, "CREATE_MILESTONE", "milestone", milestone.id, {"project_id": project_id})
    db.commit()
    db.refresh(milestone)
    return serialize_entity(milestone)


@router.patch("/milestones/{milestone_id}")
async def update_milestone(milestone_id: str, payload: dict[str, str], db: Session = Depends(get_db), actor: User = Depends(require_roles("professor", "industry"))) -> dict[str, object]:
    milestone = db.get(Milestone, milestone_id)
    if milestone is None:
        raise HTTPException(status_code=404, detail="Milestone not found")
    if "status" in payload and payload["status"] not in {"pending", "in_progress", "completed"}:
        raise HTTPException(status_code=400, detail="Invalid milestone status")
    for field in ("status", "description"):
        if field in payload:
            setattr(milestone, field, payload[field])
    milestone.updated_at = now()
    record_audit(db, actor.id, actor.role, "UPDATE_MILESTONE", "milestone", milestone.id, payload)
    db.commit()
    db.refresh(milestone)
    return serialize_entity(milestone)



@router.post("/projects/{project_id}/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(project_id: str, payload: FeedbackCreate, db: Session = Depends(get_db), actor: User = Depends(get_current_user)) -> dict[str, object]:
    if db.get(Project, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.submitted_by and payload.submitted_by != actor.id:
        raise HTTPException(status_code=403, detail="Feedback must be submitted for the authenticated user")
    feedback = Feedback(
        id=payload.id or f"feedback-{uuid4().hex}",
        project_id=project_id,
        submitted_by=actor.id,
        rating=payload.rating,
        comments=payload.comments,
        solved_status=payload.solved_status,
        locality=payload.locality,
        photo_proof_url=payload.photo_proof_url,
        created_at=now(),
        updated_at=now(),
    )
    db.add(feedback)
    record_audit(db, actor.id, actor.role, "SUBMIT_FEEDBACK", "feedback", feedback.id, {"project_id": project_id})
    db.commit()
    db.refresh(feedback)
    return serialize_entity(feedback)


@router.get("/projects/{project_id}/feedback")
async def get_project_feedback(project_id: str, db: Session = Depends(get_db), _user: User = Depends(get_current_user)) -> list[dict[str, object]]:
    if db.get(Project, project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    feedback = db.scalars(select(Feedback).where(Feedback.project_id == project_id).order_by(Feedback.created_at.desc())).all()
    return [serialize_entity(item) for item in feedback]


@router.patch("/ideas/{idea_id}/review")
async def review_idea(idea_id: str, payload: IdeaReview, db: Session = Depends(get_db), actor: User = Depends(require_roles("expert", "professor"))) -> dict[str, object]:
    idea = db.get(Idea, idea_id)
    if idea is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    if payload.ai_screening is not None:
        idea.ai_screening = payload.ai_screening
    if payload.expert_evaluation is not None:
        idea.expert_evaluation = payload.expert_evaluation
    idea.status = payload.status
    if payload.status == "selected":
        idea.selected_at = now()
    record_audit(db, actor.id, actor.role, "REVIEW_IDEA", "idea", idea.id, payload.model_dump(exclude_none=True))
    db.commit()
    db.refresh(idea)
    return serialize_entity(idea)