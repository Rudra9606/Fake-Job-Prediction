from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np
import re
import os
from scipy.sparse import hstack, csr_matrix

# Initialize FastAPI App
app = FastAPI(
    title="FakeJobShield API",
    description="Explainable Hybrid AI and Cybersecurity Framework for Fraudulent Job Advertisement Detection",
    version="1.0.0"
)

# Define Model paths
MODELS_DIR = "models"
TFIDF_PATH = os.path.join(MODELS_DIR, "tfidf.pkl")
ENCODERS_PATH = os.path.join(MODELS_DIR, "label_encoders.pkl")
HYBRID_MODEL_PATH = os.path.join(MODELS_DIR, "hybrid_model.pkl")

# Global variables for loaded models
vectorizer = None
label_encoders = None
hybrid_model = None

# Free email domains list
FREE_EMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "aol.com", "icloud.com", "protonmail.com", "mail.com", "yandex.com"
}

# Suspicious urgency keywords
URGENCY_KEYWORDS = [
    "urgent", "immediately", "act now", "limited slots", "only few positions",
    "guaranteed", "no interview", "instant hire", "send details now", "quick money", "easy money"
]

class JobPredictRequest(BaseModel):
    title: str = Field(..., example="Senior Data Entry Operator")
    description: str = Field(..., example="We are looking for a remote operator. Earn $50/hour. No experience needed.")
    requirements: str = Field(..., example="Must have a bank account for wire transfers. Send processing fee of $25 via debit card.")
    benefits: str = Field(default="", example="Work from home, quick payouts.")

class JobPredictResponse(BaseModel):
    fraud_probability: float
    trust_score: float
    risk_level: str
    explanation: list[str]

@app.on_event("startup")
def load_models():
    global vectorizer, label_encoders, hybrid_model
    try:
        if not os.path.exists(TFIDF_PATH) or not os.path.exists(ENCODERS_PATH) or not os.path.exists(HYBRID_MODEL_PATH):
            print("WARNING: Models files not found. They will be loaded when a request is made or once notebooks complete.")
            return
        vectorizer = joblib.load(TFIDF_PATH)
        label_encoders = joblib.load(ENCODERS_PATH)
        hybrid_model = joblib.load(HYBRID_MODEL_PATH)
        print("Successfully loaded model artifacts!")
    except Exception as e:
        print(f"Error loading model artifacts during startup: {e}")

def get_lazy_models():
    global vectorizer, label_encoders, hybrid_model
    if vectorizer is None or label_encoders is None or hybrid_model is None:
        if not os.path.exists(TFIDF_PATH) or not os.path.exists(ENCODERS_PATH) or not os.path.exists(HYBRID_MODEL_PATH):
            raise HTTPException(
                status_code=503, 
                detail="Model artifacts are still being trained. Please try again in a few minutes."
            )
        vectorizer = joblib.load(TFIDF_PATH)
        label_encoders = joblib.load(ENCODERS_PATH)
        hybrid_model = joblib.load(HYBRID_MODEL_PATH)
    return vectorizer, label_encoders, hybrid_model

# Text cleaning logic
def clean_text_local(text):
    text = text.lower()
    text = re.sub(r"<[^>]*>", " ", text) # html tags
    text = re.sub(r"http\S+|www\.\S+", " ", text) # URLs
    text = re.sub(r"\S+@\S+", " ", text) # Emails
    text = re.sub(r"[^a-zA-Z\s]", " ", text) # non-alphabetic characters
    # Simple whitespace tokenization & filtering stopwords (nltk equivalent)
    tokens = text.split()
    # basic common English stopwords list
    stopwords_list = {
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", 
        "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", 
        "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", 
        "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", 
        "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", 
        "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", 
        "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", 
        "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", 
        "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", 
        "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", 
        "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", 
        "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"
    }
    cleaned = [t for t in tokens if t not in stopwords_list and len(t) > 2]
    return " ".join(cleaned)

def extract_cybersecurity_indicators(text):
    req_otp = 1 if re.search(r"\botp\b|one[- ]time[- ]password", text, re.I) else 0
    req_aadhaar = 1 if re.search(r"\baadhaar\b|\baadhar\b|uidai", text, re.I) else 0
    req_pan = 1 if re.search(r"\bpan\b|\bpan card\b|permanent account number", text, re.I) else 0
    req_passport = 1 if re.search(r"\bpassport\b", text, re.I) else 0
    req_bank = 1 if re.search(r"bank account|routing number|account number", text, re.I) else 0
    req_card = 1 if re.search(r"debit card|credit card|cvv|card number", text, re.I) else 0
    req_reg_fee = 1 if re.search(r"registration fee|processing fee|application fee|interview fee", text, re.I) else 0
    req_proc_fee = 1 if re.search(r"processing charge|equipment deposit|wire transfer|money deposit", text, re.I) else 0
    
    sensitive_flags = [req_otp, req_aadhaar, req_pan, req_passport, req_bank, req_card, req_reg_fee, req_proc_fee]
    sensitive_data_score = sum(sensitive_flags) / len(sensitive_flags)
    
    urgency_count = sum(1 for kw in URGENCY_KEYWORDS if kw in text.lower())
    
    has_personal_email = 1 if re.search(r"\b[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|mail|yandex)\.com\b", text, re.I) else 0
    has_suspicious_url = 1 if re.search(r"bit\.ly|tinyurl|goo\.gl|\.tk/", text, re.I) else 0
    
    return [
        req_otp, req_aadhaar, req_pan, req_passport, req_bank, req_card, 
        req_reg_fee, req_proc_fee, sensitive_data_score, urgency_count, 
        has_personal_email, has_suspicious_url
    ]

@app.post("/predict", response_model=JobPredictResponse)
def predict(job: JobPredictRequest):
    # Retrieve models
    vec, encs, model = get_lazy_models()
    
    # 1. Clean combined text
    combined_raw_text = f"{job.title} {job.description} {job.requirements} {job.benefits}"
    cleaned_text = clean_text_local(combined_raw_text)
    
    # 2. Extract TF-IDF
    x_tfidf = vec.transform([cleaned_text])
    
    # 3. Extract Cybersecurity indicators
    cyber_features = extract_cybersecurity_indicators(combined_raw_text)
    x_cyber = np.array(cyber_features).reshape(1, -1)
    
    # 4. Extract structured categoricals (default to encoded 'missing')
    encoded_cats = []
    cat_cols = ["employment_type", "required_experience", "required_education", "industry", "function"]
    for col in cat_cols:
        le = encs[col]
        # Get encoded value for 'missing' or default to 0 if 'missing' is not encoded
        val = "missing" if "missing" in le.classes_ else le.classes_[0]
        encoded_val = le.transform([val])[0]
        encoded_cats.append(encoded_val)
    x_categorical = np.array(encoded_cats).reshape(1, -1)
    
    # 5. Extract structured binaries (default to 0)
    x_binary = np.array([0, 1, 0]).reshape(1, -1) # telecommuting=0, has_company_logo=1, has_questions=0
    
    # 6. Combine Features
    x_hybrid = hstack([x_tfidf, csr_matrix(x_cyber), csr_matrix(x_categorical), csr_matrix(x_binary)]).tocsr()
    
    # 7. Predict Probability
    fraud_prob = float(model.predict_proba(x_hybrid)[0, 1])
    
    # 8. Compute Trust Score & Risk Level
    trust_score = (1.0 - fraud_prob) * 100
    
    if trust_score >= 81:
        risk_level = "Trusted"
    elif trust_score >= 61:
        risk_level = "Low Risk"
    elif trust_score >= 41:
        risk_level = "Medium Risk"
    elif trust_score >= 21:
        risk_level = "High Risk"
    else:
        risk_level = "Highly Fraudulent"
        
    # 9. Generate Explanation Reasons
    explanation = []
    if cyber_features[0]: explanation.append("Alert: Job posting requests One-Time Password (OTP).")
    if cyber_features[1]: explanation.append("Alert: Job posting requests national identifier Aadhaar card details.")
    if cyber_features[2]: explanation.append("Alert: Job posting requests national identifier PAN card details.")
    if cyber_features[3]: explanation.append("Alert: Job posting requests passport details.")
    if cyber_features[4]: explanation.append("Alert: Job posting requests bank account or routing details.")
    if cyber_features[5]: explanation.append("Alert: Job posting requests credit or debit card details.")
    if cyber_features[6]: explanation.append("Alert: Job posting requests upfront registration or application fees.")
    if cyber_features[7]: explanation.append("Alert: Job posting requests processing/equipment deposit fees.")
    if cyber_features[9] > 1: explanation.append("Alert: High-pressure urgency language detected in job details.")
    if cyber_features[10]: explanation.append("Alert: Personal recruiter email (Gmail/Yahoo/etc.) detected in text.")
    if cyber_features[11]: explanation.append("Alert: Shortened or suspicious URL detected.")
    
    if fraud_prob >= 0.5:
        explanation.append("ML Hybrid Model: High textual and metadata fraud characteristics detected.")
    else:
        explanation.append("ML Hybrid Model: Textual characteristics correspond to standard genuine job posts.")
        
    if not explanation or fraud_prob < 0.2:
        explanation.insert(0, "Post contains standard job posting structure and no known fraud indicators.")
        
    return JobPredictResponse(
        fraud_probability=round(fraud_prob, 4),
        trust_score=round(trust_score, 2),
        risk_level=risk_level,
        explanation=explanation[:5]
    )

@app.get("/health")
def health():
    status = "ready" if (vectorizer is not None and hybrid_model is not None) else "training"
    return {"status": status, "service": "FakeJobShield"}
