import asyncio
import json
from datetime import datetime, timezone

from app.api.v1.routes.crud import submit_feedback, update_milestone, update_pilot
from app.models.normalized import Feedback, Milestone, Project, User
from app.schemas.crud import FeedbackCreate, PilotMetricsUpdate


class FakeDb:
    def __init__(self, objects):
        self.objects = {(type(item), item.id): item for item in objects}
        self.added = []

    def get(self, model, item_id):
        return self.objects.get((model, item_id))

    def add(self, item):
        self.added.append(item)
        self.objects[(type(item), item.id)] = item

    def commit(self):
        return None

    def refresh(self, _item):
        return None


def _run(awaitable):
    return asyncio.run(awaitable)


def _user():
    timestamp = datetime.now(timezone.utc)
    return User(id="user-persistence", name="Government", email="gov@example.com", role="government", created_at=timestamp, updated_at=timestamp)


def test_feedback_persists_extended_fields():
    timestamp = datetime.now(timezone.utc)
    project = Project(id="project-persistence", idea_id="idea-1", name="Pilot", created_at=timestamp, updated_at=timestamp)
    db = FakeDb([project])
    response = _run(submit_feedback(
        project.id,
        FeedbackCreate(id="feedback-persistence", rating=5, comments="Solved", solved_status="YES", locality="Ranchi", photo_proof_url="proof.jpg"),
        db,
        _user(),
    ))

    assert response["project_id"] == project.id
    saved = db.get(Feedback, "feedback-persistence")
    assert saved.solved_status == "YES"
    assert saved.locality == "Ranchi"
    assert saved.photo_proof_url == "proof.jpg"


def test_pilot_metrics_and_milestone_status_persist():
    timestamp = datetime.now(timezone.utc)
    project = Project(id="project-pilot", idea_id="idea-1", name="Pilot", created_at=timestamp, updated_at=timestamp)
    milestone = Milestone(id="milestone-pilot", project_id=project.id, title="Deploy", created_at=timestamp, updated_at=timestamp)
    db = FakeDb([project, milestone])
    actor = _user()

    _run(update_pilot(project.id, PilotMetricsUpdate(status="pilot", metrics={"beneficiaries": 45200}), db, actor))
    _run(update_milestone(milestone.id, {"status": "completed"}, db, actor))

    assert project.status == "pilot"
    assert json.loads(project.pilot_metrics_json)["beneficiaries"] == 45200
    assert milestone.status == "completed"
