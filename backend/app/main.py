from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="CollabX backend for civic problem reporting, AI matching, and governance workflows.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
        ],
        allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def startup() -> None:
        Base.metadata.create_all(bind=engine)
        if "reports" in inspect(engine).get_table_names():
            report_columns = {column["name"] for column in inspect(engine).get_columns("reports")}
            if "ai_analysis_json" not in report_columns:
                with engine.begin() as connection:
                    connection.execute(text("ALTER TABLE reports ADD COLUMN ai_analysis_json TEXT"))
        if "university_profiles" in inspect(engine).get_table_names():
            university_columns = {column["name"] for column in inspect(engine).get_columns("university_profiles")}
            if "student_team_skills" not in university_columns:
                with engine.begin() as connection:
                    connection.execute(text("ALTER TABLE university_profiles ADD COLUMN student_team_skills TEXT NOT NULL DEFAULT ''"))

    app.include_router(api_router, prefix="/api")

    @app.get("/health")
    async def health_check() -> dict[str, str]:
        return {"status": "ok", "service": settings.app_name}

    return app


app = create_app()
