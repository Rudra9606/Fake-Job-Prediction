# FakeJobShield System Architecture

## High-Level Flow

```
                    ┌─────────────────────────────────────┐
                    │         Job Post Input (JSON)        │
                    │  title, description, company, email, │
                    │  url, salary, requirements, ...      │
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Module A        │      │  Module B        │      │  Module C        │
│  NLP Preprocess  │─────▶│  ML/DL Classifier│      │  Cybersecurity   │
│  TF-IDF / clean  │      │  P_fake_text     │      │  4-Layer Checks  │
└──────────────────┘      └────────┬─────────┘      │  P_fake_sec      │
                                   │                 └────────┬─────────┘
                                   └──────────┬───────────────┘
                                              ▼
                              ┌───────────────────────────┐
                              │  Module D: Fusion Engine   │
                              │  TrustScore + Risk Band    │
                              │  Explainability reasons    │
                              └───────────────────────────┘
                                              │
                                              ▼
                              ┌───────────────────────────┐
                              │  Output: trust_score,      │
                              │  label, reasons[], badge   │
                              └───────────────────────────┘
```

## Module A — NLP Feature Extractor

- Concatenate: `title + department + company_profile + description + requirements + benefits + salary_range`
- Preprocessing: lowercase, URL/email removal optional, stop-word removal, lemmatization (NLTK)
- Vectorization: TF-IDF (max 10,000 features, n-gram 1–2) for classical ML
- Optional: DistilBERT `[CLS]` embedding for DL branch

## Module B — ML/DL Classifier

**Baselines (sklearn):**
- Logistic Regression, SVM, Naive Bayes, Decision Tree, KNN
- Random Forest, Extra Trees, XGBoost

**Deep learning (optional v1):**
- BiLSTM on padded sequences (if tensorflow available)
- Primary v1: Extra Trees + ADASYN (strong literature baseline)

**Output:** `P_fake_text ∈ [0, 1]`

## Module C — Cybersecurity (4 Layers from rs.pdf)

### Layer 1: Identity Verification
- Company name present vs empty profile
- Recruiter email domain matches company domain (when email provided)

### Layer 2: Domain / Email Security
- Free email provider flag (Gmail, Yahoo, Hotmail, Outlook personal)
- Domain age simulation / WHOIS hook
- Suspicious URL patterns in text (bit.ly, .tk, IP URLs)
- Careers-page match score (simulated or crawler)

### Layer 3: Fraud-Pattern Monitoring
- Phishing urgency keywords
- Unrealistic salary patterns
- Telecommuting + no logo + vague description combo

### Layer 4: User Safety
- Sensitive-data request detection (PAN, Aadhaar, bank, OTP, password, payment)
- External-origin warning when URL domain ≠ company domain
- Reporting hook (API endpoint for user reports — stub)

**Output:** `P_fake_sec ∈ [0, 1]` + list of triggered rules

## Module D — Hybrid Fusion & Trust Score

See `05-trust-score-design.md`.

## Deployment Components

| Component | Technology |
|-----------|------------|
| Training pipeline | Python 3.12, scikit-learn, imbalanced-learn |
| API | FastAPI |
| Model artifacts | `models/` (joblib) |
| Results | `results/metrics.json`, `results/confusion_matrices/` |
| Demo | `static/index.html` |

## API Endpoints

- `POST /analyze` — Full FakeJobShield analysis
- `POST /analyze/text-only` — ML only (ablation)
- `GET /health` — Health check
