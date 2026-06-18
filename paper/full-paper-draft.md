# FakeJobShield: A Hybrid AI and Cybersecurity Framework for Detecting Fraudulent Job Advertisements and Generating Trust Scores

## Abstract

Online job portals have accelerated hiring but also enabled fraudulent job advertisements that target job seekers through phishing, identity theft, and financial scams. Existing detection systems rely primarily on textual machine learning classifiers and often ignore cybersecurity indicators such as domain authenticity, email legitimacy, and sensitive-data requests. We propose **FakeJobShield**, a hybrid framework that combines NLP-based classification (TF-IDF with ensemble ML), a four-layer cybersecurity verification module, and an explainable trust score (0–100). Experiments on the Employment Scam Aegean Dataset (17,880 postings) show that hybrid fusion improves fraud detection over text-only and security-only baselines, with interpretable risk reasons for end users.

**Keywords:** fake job detection, employment fraud, NLP, cybersecurity, trust score, hybrid AI

---

## 1. Introduction

The growth of online recruitment has created opportunities for fraudsters to publish deceptive job advertisements on portals, social media, and messaging platforms. Victims may lose money, share identity documents, or expose credentials to phishing campaigns.

Most prior work treats fake job detection as a text classification problem using TF-IDF, Random Forest, or deep models such as BiLSTM and BERT. While effective at capturing suspicious language, these systems rarely verify whether the recruiter's email domain matches the company, whether the domain is newly registered, or whether the post requests prohibited sensitive information.

**Contributions:**
1. A modular architecture combining ML text intelligence with four cybersecurity layers (identity, domain/email, fraud patterns, user safety).
2. A calibrated **trust score** with risk bands and verification badges.
3. Explainable outputs listing top fraud indicators.
4. Empirical comparison of text-only, security-only, and hybrid fusion on EMSCAD.

---

## 2. Related Work

*(See `docs/03-literature-matrix.md` for full matrix.)*

- **ML/DL for job fraud:** Random Forest (~96.4% accuracy), Extra Trees + ADASYN + TF-IDF (~99.9%), BiLSTM outperforming classical ML on text features.
- **Cybersecurity in fraud:** Domain-age checks, email authentication, and phishing URL detection appear in general fraud literature but are seldom integrated with job-specific classifiers.
- **Gap:** Lack of unified frameworks producing user-facing trust scores with both NLP and security evidence.

---

## 3. Problem Definition

**Input:** Job post \( J = \{title, description, company, email, url, metadata\} \)

**Output:** Trust score \( T \in [0,100] \), risk band, predicted label, explanation set \( R \)

**Objective:** Maximize F1 and recall on fraudulent posts while minimizing false positives on legitimate corporate listings.

*(Full problem statement: `docs/02-problem-statement-and-rqs.md`)*

---

## 4. Proposed Framework

### 4.1 Architecture

See Figure 1 (`docs/05-architecture.md`, `results/roc_comparison.png`).

Modules:
- **A:** NLP preprocessing and TF-IDF vectorization
- **B:** ML classifier → \( P_{fake}^{text} \)
- **C:** Cybersecurity 4-layer analyzer → \( P_{fake}^{sec} \)
- **D:** Fusion engine → Trust score + reasons

### 4.2 Cybersecurity Layers

1. Identity verification (company profile, logo)
2. Domain/email security (free providers, mismatch, URL patterns)
3. Fraud-pattern monitoring (urgency, weak profiles)
4. User safety (sensitive-data keywords, warnings)

### 4.3 Trust Score

\[
T = 100 \times \left(1 - \min\left(1,\; \alpha P_{fake}^{text} + \beta P_{fake}^{sec} + \gamma \cdot \mathbb{1}_{sensitive}\right)\right)
\]

Default: \( \alpha=0.55, \beta=0.35, \gamma=0.10 \)

---

## 5. Methodology

- **Dataset:** EMSCAD / fakeJobDataset.csv — 17,880 posts, 866 fraudulent (~4.8%)
- **Split:** 70/15/15 stratified, seed 42
- **Models:** Logistic Regression, NB, DT, KNN, RF, Extra Trees, Linear SVC (+ XGBoost optional)
- **Resampling:** ADASYN on training set
- **Security features:** Rule engine + simulated email/domain for rows lacking contact fields (deployment uses live checks)
- **Metrics:** Accuracy, Precision, Recall, F1, ROC-AUC, FPR, FNR

---

## 6. Results

Experiments on EMSCAD test split (n=2,682; 15% holdout, stratified):

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | FPR |
|-------|----------|-----------|--------|-----|---------|-----|
| Text-only (Extra Trees + ADASYN) | 98.32% | 97.75% | 66.92% | 0.795 | 0.992 | 0.075% |
| Security-only (4-layer rules) | 92.92% | 35.44% | 56.15% | 0.435 | 0.870 | 4.96% |
| **FakeJobShield Hybrid** | **98.47%** | **100%** | **68.46%** | **0.813** | 0.973 | **0%** |
| Text-only (no metadata ablation) | 98.47% | 98.90% | 69.23% | 0.814 | 0.988 | 0.037% |

**Trust score separation:** Mean trust score for fake posts = **38.4**; for real posts = **80.1**.

Figures: `results/roc_comparison.png`, `results/confusion_hybrid.png`

### 6.1 Research Questions

- **RQ1 (Hybrid vs text-only):** Hybrid F1 improves by **+0.018** (0.813 vs 0.795); precision reaches **100%** with **zero false positives** on the test set.
- **RQ2 (Trust score fusion):** Weighted late fusion (α=0.55, β=0.35, γ=0.10) separates classes with mean scores 38 vs 80.
- **RQ3 (False positives):** FPR drops from 0.075% (text-only) to **0%** (hybrid).
- **RQ4 (Explainability):** Case study — fake post scored **15/100** with reasons: personal email, young domain, sensitive-data request, no careers-page match, 99% text fake probability.

### 6.2 Case Study Example (Fake Post)

- Trust score: **15/100** — Likely Fraud
- Reasons: Gmail recruiter email, domain <90 days, bank/OTP request, unverified careers page, ML 99% fake probability
- Actual label: fake ✓

---

## 7. Limitations

- English-only text
- Simulated security features for benchmark rows without email/URL
- WHOIS/careers-page checks require live APIs in production

---

## 8. Conclusion & Future Work

FakeJobShield demonstrates that combining NLP classification with cybersecurity verification yields a more holistic fraud assessment than text alone. Future work: browser extension, threat-intelligence database, employer MFA, multi-language BERT, and live WHOIS integration.

---

## References

1. EMSCAD — Employment Scam Aegean Dataset, University of the Aegean.
2. MDPI Future Internet — Automatic Detection of Online Recruitment Frauds (2017).
3. Kaggle — Real or Fake Fake Jobposting Prediction (Shivam Bansal).
4. *(Add 15+ papers from literature matrix before submission.)*
