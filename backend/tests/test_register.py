import asyncio
import pytest
from fastapi import HTTPException

from app.api.v1.routes import auth
from app.core.config import settings
from app.models.normalized import User
from app.schemas.auth import OTPRequest, OTPVerifyRequest, UserRegisterRequest


class MemoryDb:
    def __init__(self):
        self.users: list[User] = []
        self.challenges = {}

    def scalar(self, statement):
        for u in self.users:
            return u
        return None

    def add(self, entity):
        if isinstance(entity, User):
            self.users.append(entity)
        else:
            self.challenges[entity.challenge_id] = entity

    def commit(self):
        pass

    def refresh(self, _entity):
        pass

    def get(self, model, item_id):
        if model is User:
            for u in self.users:
                if u.id == item_id:
                    return u
            return None
        return self.challenges.get(item_id)

    def delete(self, entity):
        if hasattr(entity, 'challenge_id'):
            self.challenges.pop(entity.challenge_id, None)


@pytest.fixture
def auth_demo(monkeypatch):
    auth._otp_request_history.clear()
    monkeypatch.setattr(settings, "auth_mode", "demo")
    monkeypatch.setattr(settings, "jwt_secret_key", "test-secret-key-12345678901234567890")
    monkeypatch.setattr(settings, "auth_dev_mode", True)
    monkeypatch.setattr(settings, "auth_dev_otp", "123456")


def test_register_and_login_flow(auth_demo):
    async def run_test():
        db = MemoryDb()

        # 1. Register a new citizen user with mobile identifier
        reg_payload = UserRegisterRequest(
            name="Ramesh Kumar",
            identifier="9876543210",
            role="citizen",
        )
        reg_response = await auth.register(reg_payload, db=db)
        assert reg_response.name == "Ramesh Kumar"
        assert reg_response.email == "9876543210"
        assert reg_response.role == "citizen"

        # 2. Verify user exists in database
        assert len(db.users) == 1
        created_user = db.users[0]
        assert created_user.name == "Ramesh Kumar"
        assert created_user.email == "9876543210"
        assert created_user.role == "citizen"

        # 3. Request OTP for newly registered citizen using mobile number
        otp_req = OTPRequest(identifier="9876543210", role="citizen")
        otp_resp = await auth.request_otp(otp_req, db=db)
        assert otp_resp.challenge_id is not None

        # 4. Verify OTP using demo OTP 123456
        verify_req = OTPVerifyRequest(challenge_id=otp_resp.challenge_id, otp="123456")
        token_resp = await auth.verify_otp(verify_req, db=db)
        assert token_resp.user_id == created_user.id
        assert token_resp.role == "citizen"
        assert token_resp.access_token is not None

    asyncio.run(run_test())


def test_register_duplicate_prevention(auth_demo):
    async def run_test():
        db = MemoryDb()

        reg_payload = UserRegisterRequest(
            name="Anita Sharma",
            identifier="9123456789",
            role="citizen",
        )
        await auth.register(reg_payload, db=db)

        # Attempting to register the same mobile number + role again must raise 409 Conflict
        with pytest.raises(HTTPException) as exc_info:
            await auth.register(reg_payload, db=db)
        assert exc_info.value.status_code == 409
        assert "already exists" in exc_info.value.detail

    asyncio.run(run_test())
