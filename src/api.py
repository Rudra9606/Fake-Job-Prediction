"""FakeJobShield FastAPI server."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.fusion import analyze_post

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / "static"

app = FastAPI(
    title="FakeJobShield API",
    description="Hybrid AI + Cybersecurity job fraud detection with trust scores",
    version="0.1.0",
)

if STATIC.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")


class JobPostRequest(BaseModel):
    title: str = ""
    description: str = ""
    company_profile: str = ""
    requirements: str = ""
    benefits: str = ""
    salary_range: str = ""
    department: str = ""
    location: str = ""
    contact_email: str = ""
    job_url: str = ""
    telecommuting: bool = False
    has_company_logo: bool = True
    has_questions: bool = False


class JobPostResponse(BaseModel):
    trust_score: int
    risk_band: str
    badge: str
    predicted_label: str
    p_fake_text: float
    p_fake_security: float
    reasons: list[str]
    security_flags: dict[str, bool]


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC / "index.html")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "FakeJobShield"}


@app.post("/analyze", response_model=JobPostResponse)
def analyze(job: JobPostRequest) -> dict[str, Any]:
    return analyze_post(job.model_dump())


@app.post("/analyze/text-only")
def analyze_text_only(job: JobPostRequest) -> dict[str, Any]:
    result = analyze_post(job.model_dump())
    return {
        "p_fake_text": result["p_fake_text"],
        "predicted_label": "fake" if result["p_fake_text"] >= 0.5 else "real",
    }
