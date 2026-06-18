from __future__ import annotations

from src.config import TRUST_WEIGHTS
from src.security import SecurityResult


def trust_band(score: int) -> str:
    if score >= 80:
        return "high_trust"
    if score >= 50:
        return "moderate"
    return "high_risk"


def badge_for_band(band: str) -> str:
    return {
        "high_trust": "Verified Low Risk",
        "moderate": "Review Carefully",
        "high_risk": "Likely Fraud",
    }[band]


def compute_trust_score(
    p_fake_text: float,
    security: SecurityResult,
    *,
    alpha: float | None = None,
    beta: float | None = None,
    gamma: float | None = None,
) -> tuple[int, str, list[str]]:
    alpha = alpha if alpha is not None else TRUST_WEIGHTS["alpha"]
    beta = beta if beta is not None else TRUST_WEIGHTS["beta"]
    gamma = gamma if gamma is not None else TRUST_WEIGHTS["gamma"]

    penalty = 1.0 if security.requests_sensitive_data else 0.0
    risk = alpha * p_fake_text + beta * security.p_fake_sec + gamma * penalty
    risk = min(1.0, max(0.0, risk))
    score = round(100 * (1.0 - risk))
    band = trust_band(score)

    reasons = list(security.reasons)
    if p_fake_text >= 0.6:
        reasons.append(f"ML text model: {p_fake_text:.0%} fake probability")
    elif p_fake_text <= 0.3:
        reasons.append(f"ML text model: {p_fake_text:.0%} fake probability (low text risk)")

    if not reasons:
        reasons.append("No major fraud indicators detected")

    return score, band, reasons[:5]
