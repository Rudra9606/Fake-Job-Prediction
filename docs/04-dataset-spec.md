# Dataset Specification

## Primary Dataset

**Name:** Real or Fake Job Posting Prediction (Employment Scam Detection)

**Source:** [Kaggle — Real or Fake Job Posting Prediction](https://www.kaggle.com/datasets/shadab007/fake-job-posting-detection)

**File:** `fakeJobDataset.csv` (also known as employment scam dataset)

| Field | Type | Use |
|-------|------|-----|
| `job_id` | int | Identifier |
| `title` | string | NLP feature |
| `location` | string | NLP / metadata |
| `department` | string | NLP feature |
| `salary_range` | string | NLP feature (suspicious patterns) |
| `company_profile` | string | NLP + company text |
| `description` | string | Primary NLP text |
| `requirements` | string | NLP feature |
| `benefits` | string | NLP feature |
| `telecommuting` | binary | Metadata |
| `has_company_logo` | binary | Metadata |
| `has_questions` | binary | Metadata |
| `employment_type` | string | Metadata |
| `required_experience` | string | Metadata |
| `required_education` | string | Metadata |
| `industry` | string | Metadata |
| `function` | string | Metadata |
| `fraudulent` | 0/1 | **Label** (1 = fake) |

## Train / Validation / Test Split

- 70% train / 15% validation / 15% test
- Stratified by `fraudulent`
- Random seed: `42`

## Synthetic Cybersecurity Features (Module C)

Public dataset lacks email/URL fields. For hybrid evaluation we **derive/simulate** security features:

| Feature | Derivation |
|---------|------------|
| `contact_email_domain` | Simulated: fake posts → higher rate of gmail/yahoo/hotmail |
| `uses_personal_email` | 1 if free provider (rule) |
| `domain_age_days` | Simulated: fake → younger domains (random conditioned on label) |
| `careers_page_match` | Simulated: real → higher match probability |
| `requests_sensitive_data` | Regex on description (PAN, Aadhaar, bank, OTP, password, SSN) |
| `phishing_urgency_score` | Keyword count (urgent, immediate, limited slots, act now) |
| `suspicious_url_pattern` | Regex for bit.ly, tinyurl, .tk domains in text |

> **Paper note:** State clearly that security features are simulated from label-correlated rules for ablation; live API checks are described in architecture for deployment.

## Ethics & Privacy

- Public dataset only; no personal applicant data collected.
- Scraping live job boards requires robots.txt compliance and anonymization if used in future work.
- No storage of real user PAN/bank data in prototype.

## Class Balance

- Dataset is imbalanced (~14% fraudulent).
- Apply **ADASYN** or `class_weight='balanced'` for sklearn models; report metrics with and without resampling.

## Minimum Viable Size

- Full dataset: ~17,880 rows — sufficient for ML baselines and hybrid fusion experiments.
