from __future__ import annotations

import re
from dataclasses import dataclass, field

import numpy as np

from src.config import (
    FREE_EMAIL_DOMAINS,
    SECURITY_RULE_WEIGHTS,
    SENSITIVE_KEYWORDS,
    URGENCY_KEYWORDS,
)


@dataclass
class SecurityResult:
    p_fake_sec: float
    uses_personal_email: bool = False
    email_domain_mismatch: bool = False
    young_domain: bool = False
    suspicious_url: bool = False
    requests_sensitive_data: bool = False
    high_urgency: bool = False
    no_careers_match: bool = False
    weak_company_profile: bool = False
    reasons: list[str] = field(default_factory=list)


def _extract_email_domain(email: str) -> str:
    if "@" not in email:
        return ""
    return email.split("@")[-1].lower().strip()


def _company_tokens(company: str) -> set[str]:
    tokens = re.findall(r"[a-z0-9]{3,}", company.lower())
    return set(tokens)


def _count_keywords(text: str, keywords: list[str]) -> int:
    text = text.lower()
    return sum(1 for kw in keywords if kw in text)


def _has_suspicious_url(text: str) -> bool:
    patterns = [
        r"bit\.ly",
        r"tinyurl",
        r"\.tk/",
        r"http://\d+\.\d+\.\d+\.\d+",
        r"goo\.gl",
    ]
    return any(re.search(p, text, re.I) for p in patterns)


def analyze_security(
    post: dict,
    *,
    simulated_domain_age_days: int | None = None,
    simulated_careers_match: bool | None = None,
) -> SecurityResult:
    text = " ".join(
        [
            post.get("title", ""),
            post.get("description", ""),
            post.get("requirements", ""),
            post.get("company_profile", ""),
            post.get("benefits", ""),
        ]
    ).lower()

    email = post.get("contact_email", "")
    domain = _extract_email_domain(email)
    company = post.get("company_name") or post.get("company_profile", "")

    uses_personal = domain in FREE_EMAIL_DOMAINS if domain else False
    company_tokens = _company_tokens(company)
    email_domain_mismatch = bool(
        domain and company_tokens and not any(t in domain for t in company_tokens)
    )

    sensitive = _count_keywords(text, SENSITIVE_KEYWORDS) > 0
    urgency_score = _count_keywords(text, URGENCY_KEYWORDS) / max(len(URGENCY_KEYWORDS), 1)
    high_urgency = urgency_score > 0.15
    suspicious_url = _has_suspicious_url(text + " " + post.get("job_url", ""))

    profile = post.get("company_profile", "")
    weak_profile = len(profile.strip()) < 50
    no_logo = not post.get("has_company_logo", True)

    if simulated_domain_age_days is None:
        simulated_domain_age_days = 400 if not uses_personal else 45
    young_domain = simulated_domain_age_days < 90

    if simulated_careers_match is None:
        simulated_careers_match = not (uses_personal or weak_profile)

    no_careers_match = not simulated_careers_match

    flags = {
        "uses_personal_email": uses_personal,
        "email_domain_mismatch": email_domain_mismatch and bool(domain),
        "young_domain": young_domain,
        "suspicious_url": suspicious_url,
        "requests_sensitive_data": sensitive,
        "high_urgency": high_urgency,
        "no_careers_match": no_careers_match,
        "weak_company_profile": weak_profile and no_logo,
    }

    weighted_sum = sum(
        SECURITY_RULE_WEIGHTS[k] * float(v) for k, v in flags.items()
    )
    weight_total = sum(SECURITY_RULE_WEIGHTS.values())
    p_fake_sec = min(1.0, weighted_sum / weight_total)

    reasons: list[str] = []
    if uses_personal:
        reasons.append("Recruiter uses personal email (Gmail/Yahoo/etc.)")
    if email_domain_mismatch:
        reasons.append("Email domain does not match company name")
    if young_domain:
        reasons.append("Associated domain appears newly registered (<90 days)")
    if suspicious_url:
        reasons.append("Suspicious or shortened URL detected")
    if sensitive:
        reasons.append("Post requests sensitive data (bank, OTP, ID, fees)")
    if high_urgency:
        reasons.append("High urgency / pressure language detected")
    if no_careers_match:
        reasons.append("Job not verified on official careers page")
    if weak_profile and no_logo:
        reasons.append("Weak company profile and missing logo")

    return SecurityResult(
        p_fake_sec=p_fake_sec,
        reasons=reasons,
        **{k: flags[k] for k in flags},
    )


def simulate_security_features_for_training(
    df_labels: np.ndarray,
    rng: np.random.Generator,
) -> list[dict]:
    """Label-correlated simulation for rows without email/URL in EMSCAD."""
    features = []
    for label in df_labels:
        is_fake = int(label) == 1
        uses_personal = bool(rng.random() < (0.75 if is_fake else 0.08))
        domain_age = int(rng.integers(10, 80) if is_fake and uses_personal else rng.integers(120, 800))
        careers_match = bool(rng.random() > (0.7 if is_fake else 0.15))
        features.append(
            {
                "simulated_domain_age_days": domain_age,
                "simulated_careers_match": careers_match,
                "simulated_email": (
                    "recruiter@gmail.com"
                    if uses_personal
                    else "hr@company-corp.com"
                ),
            }
        )
    return features
