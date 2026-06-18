# Trust Score Design

## Formula (Explainable Late Fusion)

```
risk_text = P_fake_text          # from ML classifier (probability of class 1)
risk_sec  = P_fake_sec           # from cybersecurity module (0–1)

risk_combined = α · risk_text + β · risk_sec + γ · penalty_sensitive

TrustScore = round(100 × (1 − min(1, risk_combined)))
```

### Default Weights

| Symbol | Value | Rationale |
|--------|-------|-----------|
| α | 0.55 | Text remains primary signal (literature strength) |
| β | 0.35 | Security layer adds unique non-text evidence |
| γ | 0.10 | Hard penalty when sensitive data requested |

If `requests_sensitive_data = 1`, set `penalty_sensitive = 1`, else `0`.

Clamp: `risk_combined = min(1.0, risk_combined)`

## Cybersecurity Risk Aggregation

Each rule contributes weighted evidence:

```
P_fake_sec = min(1.0, Σ (w_i · rule_i) / Σ w_i)
```

| Rule | Weight |
|------|--------|
| uses_personal_email | 0.20 |
| email_domain_mismatch | 0.15 |
| domain_age_days < 90 | 0.15 |
| suspicious_url | 0.15 |
| requests_sensitive_data | 0.25 |
| phishing_urgency_score > 0.3 | 0.10 |
| careers_page_match = 0 | 0.10 |
| no_company_logo + vague profile | 0.10 |

## Trust Bands & Badges

| Score | Band | Badge | User Action |
|-------|------|-------|-------------|
| 80–100 | High Trust | ✓ Verified Low Risk | Safe to review further |
| 50–79 | Moderate | ⚠ Review Carefully | Verify company independently |
| 0–49 | High Risk | ✗ Likely Fraud | Do not share personal/financial data |

## Explainability Output

Return top reasons (max 5), e.g.:

```json
{
  "trust_score": 28,
  "risk_band": "high_risk",
  "reasons": [
    "Recruiter uses personal email (Gmail/Yahoo)",
    "Description requests bank or OTP details",
    "High urgency language detected",
    "ML text model: 91% fake probability"
  ]
}
```

## Pseudocode

```python
def compute_trust_score(p_fake_text, security_result, alpha=0.55, beta=0.35, gamma=0.10):
    penalty = 1.0 if security_result.requests_sensitive_data else 0.0
    risk = alpha * p_fake_text + beta * security_result.p_fake_sec + gamma * penalty
    risk = min(1.0, risk)
    score = round(100 * (1.0 - risk))
    band = "high_trust" if score >= 80 else "moderate" if score >= 50 else "high_risk"
    return score, band
```
