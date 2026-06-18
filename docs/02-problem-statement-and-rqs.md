# Problem Statement & Research Questions

## Problem Statement

Online job portals have significantly transformed the recruitment process by providing easy access to employment opportunities. However, the rapid growth of online recruitment has also led to an increase in fraudulent job advertisements designed to deceive job seekers through phishing attacks, identity theft, financial scams, and unauthorized collection of sensitive personal information.

Existing fake job detection systems primarily rely on textual analysis and machine learning classification techniques. While these approaches can identify suspicious linguistic patterns, they often fail to consider important cybersecurity indicators such as company domain authenticity, email legitimacy, website credibility, suspicious hyperlinks, and requests for sensitive information. As a result, many fraudulent job postings remain undetected, while some legitimate advertisements may be incorrectly classified as fraudulent.

Therefore, there is a need for a comprehensive and explainable detection framework that combines Natural Language Processing (NLP), Machine Learning (ML), Deep Learning (DL), and cybersecurity verification techniques to improve the accuracy and reliability of fake job detection. The proposed system aims to analyze both textual and cybersecurity-related features to generate a trust score and fraud risk assessment, enabling job seekers to make safer decisions when applying for online job opportunities.

**Extension:** Prior approaches treat job fraud as a pure text-classification problem. FakeJobShield explicitly models cybersecurity evidence and fuses it with AI predictions to produce a calibrated trust score that users can interpret before applying.

## Research Questions

| ID | Research Question |
|----|-------------------|
| **RQ1** | Can a hybrid framework combining NLP-based classification and cybersecurity verification outperform text-only ML/DL models for fake job detection? |
| **RQ2** | How should textual fraud probability and security-layer risk be fused into a single, interpretable trust score? |
| **RQ3** | Does the hybrid approach reduce false positives on legitimate corporate job postings compared to text-only classifiers? |
| **RQ4** | Can explainability (feature importance and rule-based security reasons) improve transparency of fraud risk for end users? |

## Hypotheses

- **H1:** Hybrid FakeJobShield achieves higher F1 and lower false-negative rate than text-only baselines.
- **H2:** Adding cybersecurity features improves detection of scams that use plausible text but suspicious domains/emails.
- **H3:** Weighted late fusion of text + security scores yields better calibration than text probability alone.

## Success Criteria

- Beat text-only Random Forest baseline on F1 and ROC-AUC.
- Demonstrate ≥5% improvement in recall on security-enriched fake samples (simulated domain/email features).
- Trust score bands align with expert review on case-study posts.
