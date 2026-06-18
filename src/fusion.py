from __future__ import annotations

from typing import Any

import pandas as pd

from src.models import TrainArtifacts, load_best_model, predict_text_proba
from src.preprocessing import job_post_from_row
from src.security import SecurityResult, analyze_security
from src.trust_score import badge_for_band, compute_trust_score


def analyze_post(
    post: dict[str, Any],
    artifacts: TrainArtifacts | None = None,
    *,
    simulated_domain_age_days: int | None = None,
    simulated_careers_match: bool | None = None,
) -> dict[str, Any]:
    if artifacts is None:
        saved = load_best_model()
        artifacts = TrainArtifacts(
            vectorizer=saved["vectorizer"],
            model=saved["model"],
            model_name=saved["model_name"],
            use_metadata=saved["use_metadata"],
        )

    row = pd.Series(
        {
            "title": post.get("title", ""),
            "department": post.get("department", ""),
            "company_profile": post.get("company_profile", ""),
            "description": post.get("description", ""),
            "requirements": post.get("requirements", ""),
            "benefits": post.get("benefits", ""),
            "salary_range": post.get("salary_range", ""),
            "telecommuting": int(post.get("telecommuting", 0)),
            "has_company_logo": int(post.get("has_company_logo", 0)),
            "has_questions": int(post.get("has_questions", 0)),
        }
    )
    df = pd.DataFrame([row])
    p_fake_text = float(predict_text_proba(artifacts, df)[0])

    security = analyze_security(
        post,
        simulated_domain_age_days=simulated_domain_age_days,
        simulated_careers_match=simulated_careers_match,
    )
    score, band, reasons = compute_trust_score(p_fake_text, security)

    predicted_fake = p_fake_text >= 0.5 or security.p_fake_sec >= 0.5

    return {
        "trust_score": score,
        "risk_band": band,
        "badge": badge_for_band(band),
        "predicted_label": "fake" if predicted_fake else "real",
        "p_fake_text": round(p_fake_text, 4),
        "p_fake_security": round(security.p_fake_sec, 4),
        "reasons": reasons,
        "security_flags": {
            "uses_personal_email": security.uses_personal_email,
            "email_domain_mismatch": security.email_domain_mismatch,
            "young_domain": security.young_domain,
            "suspicious_url": security.suspicious_url,
            "requests_sensitive_data": security.requests_sensitive_data,
            "high_urgency": security.high_urgency,
            "no_careers_match": security.no_careers_match,
            "weak_company_profile": security.weak_company_profile,
        },
    }


def analyze_dataframe_row(row: pd.Series, artifacts: TrainArtifacts, sim: dict) -> dict[str, Any]:
    post = job_post_from_row(row)
    post["contact_email"] = sim.get("simulated_email", "")
    return analyze_post(
        post,
        artifacts=artifacts,
        simulated_domain_age_days=sim.get("simulated_domain_age_days"),
        simulated_careers_match=sim.get("simulated_careers_match"),
    )
