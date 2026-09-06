from fastapi import APIRouter

from app.api.v1.routes import health as health_routes
from app.api.v1.routes import reports as report_routes
from app.api.v1.routes import embeddings as embedding_routes
from app.api.v1.routes import matching as matching_routes
from app.api.v1.routes import crud as crud_routes
from app.api.v1.routes import auth as auth_routes

api_router = APIRouter()
api_router.include_router(health_routes.router, prefix="/health", tags=["health"])
api_router.include_router(report_routes.router, prefix="/reports", tags=["reports"])
api_router.include_router(embedding_routes.router, prefix="/embeddings", tags=["embeddings"])
api_router.include_router(matching_routes.router, prefix="/matching", tags=["matching"])
api_router.include_router(crud_routes.router, tags=["core"])
api_router.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
