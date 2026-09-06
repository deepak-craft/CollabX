from pydantic import BaseModel, Field


class GeoPoint(BaseModel):
    lat: float
    lng: float


class ReportBase(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    district: str
    locality: str
    citizen_name: str | None = None
    citizen_phone: str | None = None
    coordinates: GeoPoint | None = None
    affected_population: int | None = None
    frequency: str | None = None
    evidence_urls: list[str] = []
    audio_transcript: str | None = None
    has_voice_note: bool = False


class ReportCreate(ReportBase):
    pass


class ReportOut(ReportBase):
    id: str
    status: str
    duplicate_similarity: float | None = None
    category: str | None = None
    severity: int | None = None
    priority: str | None = None
