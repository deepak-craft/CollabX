import json
from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.audit import AuditLog


def record_audit(db: Session, actor_id: str, actor_role: str, action: str, entity_type: str, entity_id: str, details: dict[str, object] | None = None) -> None:
    db.add(AuditLog(
        id=f"audit-{uuid4().hex}",
        actor_id=actor_id,
        actor_role=actor_role,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=json.dumps(details or {}),
        created_at=datetime.now(timezone.utc),
    ))