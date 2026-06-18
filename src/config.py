from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
MODELS_DIR = ROOT / "models"
RESULTS_DIR = ROOT / "results"

DATASET_PATH = DATA_DIR / "fakeJobDataset.csv"
RANDOM_SEED = 42

TEXT_COLUMNS = [
    "title",
    "department",
    "company_profile",
    "description",
    "requirements",
    "benefits",
    "salary_range",
]

METADATA_COLUMNS = [
    "telecommuting",
    "has_company_logo",
    "has_questions",
]

FREE_EMAIL_DOMAINS = {
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
    "mail.com",
    "yandex.com",
}

SENSITIVE_KEYWORDS = [
    "pan",
    "aadhaar",
    "aadhar",
    "bank account",
    "routing number",
    "ssn",
    "social security",
    "password",
    "otp",
    "credit card",
    "processing fee",
    "registration fee",
    "equipment fee",
    "wire transfer",
]

URGENCY_KEYWORDS = [
    "urgent",
    "immediately",
    "act now",
    "limited slots",
    "only few positions",
    "guaranteed",
    "no interview",
    "instant hire",
    "send details now",
    "quick money",
    "easy money",
]

TRUST_WEIGHTS = {
    "alpha": 0.55,
    "beta": 0.35,
    "gamma": 0.10,
}

SECURITY_RULE_WEIGHTS = {
    "uses_personal_email": 0.20,
    "email_domain_mismatch": 0.15,
    "young_domain": 0.15,
    "suspicious_url": 0.15,
    "requests_sensitive_data": 0.25,
    "high_urgency": 0.10,
    "no_careers_match": 0.10,
    "weak_company_profile": 0.10,
}
