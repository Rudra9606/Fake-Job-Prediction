# Literature Review Matrix

> Sources aligned with rs.pdf guidance and standard fake-job / employment-fraud research. Expand with your library access before submission.

| # | Paper / Source | Method | Features | Cybersecurity? | Trust Score? | Dataset | Key Metrics | Limitations |
|---|----------------|--------|----------|----------------|--------------|---------|-------------|-------------|
| 1 | Ahmed et al. — Fake job detection (RF) | Random Forest + TF-IDF | Title, description, company | No | No | Employment scam CSV | ~96.4% accuracy | Text-only |
| 2 | ETC + ADASYN study (cited in rs.pdf) | Extra Trees + ADASYN + TF-IDF | Text features | No | No | Imbalanced job posts | ~99.9% accuracy | No domain/email checks |
| 3 | BiLSTM employment fraud study | BiLSTM | Sequential text | No | No | Job descriptions | Outperforms traditional ML | Black-box, text-only |
| 4 | Jain et al. — Real/Fake Job Posting | Logistic Regression, NB, SVM | TF-IDF on description | No | No | Kaggle Employment Scam | Accuracy, F1 | Public benchmark only |
| 5 | BERT-based job scam detection | DistilBERT fine-tuning | Transformer embeddings | No | No | Custom + public | High F1 on text | Compute-heavy, no URL checks |
| 6 | Phishing detection (general) | Rule + ML hybrid | URL, email, content | Partial | Risk level | Phishing corpus | High precision on URLs | Not job-specific |
| 7 | WHOIS / domain-age fraud | Rule-based | Domain registration age | Yes | Partial | Scam domains | Good for new domains | Needs live WHOIS |
| 8 | Email authentication (SPF/DKIM) | DNS checks | MX, SPF records | Yes | No | Corporate email | Reduces spoofing | Not in job ML papers |
| 9 | Sensitive-data scam NLP | Keyword + classifier | PAN, bank, OTP requests | Partial | No | Scam messages | High recall on keywords | Rules easily evaded |
| 10 | Explainable fraud (SHAP/LIME) | XAI on tabular/text | Mixed | Varies | Partial | Fraud datasets | User trust improved | Rare in job domain |
| 11 | Ensemble boosting (XGBoost) | Gradient boosting | TF-IDF + metadata | No | No | Job posts | Strong baseline | Metadata not security |
| 12 | CNN + text for spam/scam | CNN | n-gram patterns | No | No | SMS/spam | Fast inference | Shallow semantics |
| 13 | Careers-page verification | Crawler + string match | Official job portal | Yes | Badge | Company sites | Reduces impersonation | Crawler maintenance |
| 14 | Consumer fraud reports (FTC/IC3) | Statistical reports | Report categories | Context | No | Government reports | Trend data | Not ML-ready |
| 15 | **FakeJobShield (this work)** | Hybrid NLP + 4-layer security + fusion | Text + domain + email + rules | **Yes** | **Yes (0–100)** | Employment Scam + synthetic security features | F1, AUC, FPR, FNR | English, prototype WHOIS |

## Thematic Gaps (motivation for FakeJobShield)

1. **Text-only dominance** — Most job-fraud papers optimize TF-IDF or BERT without domain/email verification.
2. **Missing trust calibration** — Binary labels rarely map to user-facing trust scores.
3. **Weak explainability** — Deep models lack reasons tied to cybersecurity (e.g., "Gmail recruiter email").
4. **No unified architecture** — Security checks appear in phishing literature but not integrated with job ML pipelines.

## Search Keywords Used

`fake job posting detection`, `employment fraud machine learning`, `BiLSTM job scam`, `TF-IDF fraudulent recruitment`, `domain verification phishing jobs`, `trust score fraud detection`, `explainable AI hiring fraud`
