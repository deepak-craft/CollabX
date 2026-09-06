from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

def _select_database_url() -> str:
    configured_url = (settings.database_url or "").strip()
    if configured_url:
        return configured_url

    postgres_values = {
        "username": settings.postgres_user,
        "password": settings.postgres_password,
        "host": settings.postgres_host,
        "port": settings.postgres_port,
        "database": settings.postgres_db,
    }
    if all(value not in (None, "") for value in postgres_values.values()):
        return URL.create("postgresql+psycopg", **postgres_values).render_as_string(hide_password=False)

    if settings.use_sqlite_fallback:
        return "sqlite:///./collabx_local.db"

    raise RuntimeError(
        "PostgreSQL is not configured. Set DATABASE_URL or all POSTGRES_* values, "
        "or explicitly set USE_SQLITE_FALLBACK=true for local SQLite development."
    )


selected_database_url = _select_database_url()

engine = create_engine(
    selected_database_url,
    future=True,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if selected_database_url.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
