from functools import lru_cache
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CollabX API"
    app_version: str = "0.1.0"
    env_file: str = ".env"

    database_url: str | None = None
    use_sqlite_fallback: bool = True
    postgres_user: str | None = None
    postgres_password: str | None = None
    postgres_db: str | None = None
    postgres_host: str | None = None
    postgres_port: int | None = None
    enable_pgvector: bool = True

    secret_key: str = ""
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    jwt_secret_key: str | None = None
    jwt_algorithm: str = "HS256"
    auth_dev_mode: bool = False
    auth_dev_otp: str | None = None
    auth_otp_provider_url: str | None = None
    auth_otp_provider_api_key: str | None = None
    auth_otp_sender: str | None = None
    auth_otp_timeout_seconds: float = 10.0
    auth_otp_expire_seconds: int = 300
    auth_otp_max_attempts: int = 5
    auth_otp_rate_limit_window_seconds: int = 600
    auth_otp_rate_limit_max_requests: int = 3
    # New authentication mode: demo or sms
    auth_mode: str = "demo"
    # SMS provider configuration (used when auth_mode == "sms")
    sms_provider: str | None = None
    sms_api_key: str | None = None
    sms_api_secret: str | None = None
    sms_sender_id: str | None = None
    ai_enabled: bool = False
    ai_provider_url: str | None = None
    ai_model: str = "collabx-problem-structurer"
    ai_api_key: str | None = None
    ai_timeout_seconds: float = 15.0
    ai_idea_screening_model: str = "collabx-idea-screener"
    ai_embedding_enabled: bool = False
    ai_embedding_provider_url: str | None = None
    ai_embedding_model: str = "collabx-embedding"
    ai_embedding_dimensions: int = 256
    duplicate_similarity_threshold: float = 75.0
    duplicate_similarity_limit: int = 10

    @model_validator(mode='after')
    def validate_auth_mode(cls, values: "Settings") -> "Settings":
        if hasattr(values, 'auth_mode'):
            if values.auth_mode not in ('demo', 'sms'):
                raise ValueError('AUTH_MODE must be "demo" or "sms"')
        return values


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
