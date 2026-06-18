# FakeJobShield — Research Scope

## Title

**FakeJobShield: A Hybrid AI and Cybersecurity Framework for Detecting Fraudulent Job Advertisements and Generating Trust Scores**

## System Type

**Web API + demo UI** — A FastAPI backend that accepts job post JSON, runs NLP classification and cybersecurity checks, and returns a trust score with explainable risk factors.

## Contribution Statement

Existing fake job detection systems rely primarily on textual analysis and ML classification. They often ignore cybersecurity indicators (domain authenticity, email legitimacy, sensitive-data requests). FakeJobShield combines:

1. **NLP / ML / DL** — Text intelligence from job title, description, salary, and requirements.
2. **Cybersecurity verification** — Four-layer checks (identity, domain/email, fraud patterns, user safety).
3. **Trust score** — Unified, explainable score (0–100) with risk bands and verification badges.

## Gap Addressed

No existing work in our literature review jointly optimizes NLP classification with multi-layer cybersecurity verification and an explainable trust score for online job advertisements.

## Out of Scope (v1)

- Multi-language support (English only)
- Real-time browser extension (future work)
- Employer MFA integration (documented as future work)
- Live WHOIS API in production (simulated/rule-based checks in prototype)
