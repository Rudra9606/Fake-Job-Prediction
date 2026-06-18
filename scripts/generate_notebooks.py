import json
import os
import subprocess
import sys

def create_notebook(filename, cells):
    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 2
    }
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(notebook, f, indent=2)
    print(f"Created {filename}")

def c_cell(source):
    if isinstance(source, str):
        lines = [line + "\n" for line in source.split("\n")]
        if lines and lines[-1] == "\n":
            lines.pop()
    else:
        lines = source
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": lines
    }

def m_cell(source):
    if isinstance(source, str):
        lines = [line + "\n" for line in source.split("\n")]
        if lines and lines[-1] == "\n":
            lines.pop()
    else:
        lines = source
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": lines
    }

def build_01_eda():
    cells = [
        m_cell("# 01_EDA.ipynb\n## FakeJobShield: Exploratory Data Analysis\nThis notebook performs Exploratory Data Analysis (EDA) on the fake job postings dataset to understand its characteristics, distribution of labels, missing values, correlation patterns, and other key insights for publication."),
        c_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')

# Set style
sns.set_theme(style="whitegrid")
plt.rcParams["figure.figsize"] = (10, 6)
plt.rcParams["font.size"] = 12

# Create results dir
os.makedirs("results", exist_ok=True)
"""),
        c_cell("""# Load dataset
df = pd.read_csv("data/fake_job_postings.csv")
print("Dataset Shape:", df.shape)
print("\\nColumns:", df.columns.tolist())
"""),
        c_cell("""# Overview of data types and non-null values
df.info()
"""),
        c_cell("""# Target distribution (Class Imbalance)
fraud_counts = df["fraudulent"].value_counts()
print("Target Class Counts:")
print(fraud_counts)

# Normalize fraudulent representations (t/f or 1/0)
df['fraudulent_int'] = df['fraudulent'].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0}).fillna(0).astype(int)
print("\\nFraudulent ratio:", df['fraudulent_int'].mean() * 100, "%")

plt.figure(figsize=(6, 4))
sns.countplot(data=df, x='fraudulent_int', palette="muted")
plt.title("Distribution of Job Postings (0 = Genuine, 1 = Fraudulent)")
plt.xlabel("Class")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("results/class_distribution.png", dpi=150)
plt.show()
"""),
        c_cell("""# Missing Value Analysis
missing = df.isnull().sum()
missing_pct = (missing / len(df)) * 100
missing_df = pd.DataFrame({"Missing Count": missing, "Percentage": missing_pct}).sort_values(by="Missing Count", ascending=False)
print("Missing Values Analysis:")
print(missing_df[missing_df["Missing Count"] > 0])

# Plot missing values heatmap for text columns
plt.figure(figsize=(10, 5))
sns.heatmap(df.isnull(), cbar=False, yticklabels=False, cmap="viridis")
plt.title("Missing Values Heatmap")
plt.tight_layout()
plt.savefig("results/missing_values_heatmap.png", dpi=150)
plt.show()
"""),
        c_cell("""# Correlation analysis of numeric/binary fields
# Normalize other boolean columns
for col in ["telecommuting", "has_company_logo", "has_questions"]:
    df[col] = df[col].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0, True: 1, False: 0}).fillna(0).astype(int)

numeric_cols = ["telecommuting", "has_company_logo", "has_questions", "fraudulent_int"]
corr = df[numeric_cols].corr()
print("Correlation Matrix:")
print(corr)

plt.figure(figsize=(6, 5))
sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".3f", vmin=-1, vmax=1)
plt.title("Correlation Analysis of Binary Features")
plt.tight_layout()
plt.savefig("results/correlation_matrix.png", dpi=150)
plt.show()
"""),
        c_cell("""# Impact of Company Logo on Fraudulence
logo_fraud = pd.crosstab(df["has_company_logo"], df["fraudulent_int"], normalize="index") * 100
print("Logo presence vs Fraudulence (percentage):\\n", logo_fraud)

plt.figure(figsize=(6, 4))
sns.barplot(x=logo_fraud.index, y=logo_fraud[1], palette="Blues_d")
plt.title("Fraud Rate vs Presence of Company Logo")
plt.xlabel("Has Company Logo (0=No, 1=Yes)")
plt.ylabel("Fraud Rate (%)")
plt.tight_layout()
plt.savefig("results/logo_impact.png", dpi=150)
plt.show()
"""),
        c_cell("""# Impact of Telecommuting on Fraudulence
tele_fraud = pd.crosstab(df["telecommuting"], df["fraudulent_int"], normalize="index") * 100
print("Telecommuting vs Fraudulence (percentage):\\n", tele_fraud)

plt.figure(figsize=(6, 4))
sns.barplot(x=tele_fraud.index, y=tele_fraud[1], palette="Oranges_d")
plt.title("Fraud Rate vs Telecommuting Option")
plt.xlabel("Telecommuting (0=No, 1=Yes)")
plt.ylabel("Fraud Rate (%)")
plt.tight_layout()
plt.savefig("results/telecommuting_impact.png", dpi=150)
plt.show()
"""),
        c_cell("""# Industry-wise Fraud Analysis (Top 10 industries with highest fraud count)
industry_fraud = df[df["fraudulent_int"] == 1]["industry"].value_counts().head(10)
print("Top 10 Fraudulent Industries (Counts):\\n", industry_fraud)

plt.figure(figsize=(10, 5))
sns.barplot(x=industry_fraud.values, y=industry_fraud.index, palette="Reds_r")
plt.title("Top 10 Industries with Highest Fraud Advertisement Counts")
plt.xlabel("Fraud Count")
plt.ylabel("Industry")
plt.tight_layout()
plt.savefig("results/industry_fraud.png", dpi=150)
plt.show()
"""),
        c_cell("""# Education-wise Fraud Analysis
edu_fraud = df[df["fraudulent_int"] == 1]["required_education"].value_counts().head(10)
print("Top Fraudulent Required Educations:\\n", edu_fraud)

plt.figure(figsize=(10, 5))
sns.barplot(x=edu_fraud.values, y=edu_fraud.index, palette="Purples_r")
plt.title("Top Education Requirements in Fraudulent Job Postings")
plt.xlabel("Fraud Count")
plt.ylabel("Education")
plt.tight_layout()
plt.savefig("results/education_fraud.png", dpi=150)
plt.show()
"""),
        c_cell("""# WordClouds for Genuine vs Fraudulent descriptions
genuine_text = " ".join(df[df["fraudulent_int"] == 0]["description"].fillna("").astype(str).head(1000))
fraud_text = " ".join(df[df["fraudulent_int"] == 1]["description"].fillna("").astype(str).head(1000))

# WordCloud for Genuine
wc_gen = WordCloud(width=800, height=400, background_color="white", max_words=100).generate(genuine_text)
plt.figure(figsize=(10, 5))
plt.imshow(wc_gen, interpolation="bilinear")
plt.axis("off")
plt.title("WordCloud - Genuine Job Descriptions")
plt.tight_layout()
plt.savefig("results/wordcloud_genuine.png", dpi=150)
plt.show()

# WordCloud for Fraudulent
wc_fraud = WordCloud(width=800, height=400, background_color="black", max_words=100).generate(fraud_text)
plt.figure(figsize=(10, 5))
plt.imshow(wc_fraud, interpolation="bilinear")
plt.axis("off")
plt.title("WordCloud - Fraudulent Job Descriptions")
plt.tight_layout()
plt.savefig("results/wordcloud_fraudulent.png", dpi=150)
plt.show()
""")
    ]
    create_notebook("notebooks/01_EDA.ipynb", cells)

def build_02_preprocessing():
    cells = [
        m_cell("# 02_Preprocessing.ipynb\n## FakeJobShield: Text Cleaning and Preprocessing Pipeline\nThis notebook implements a complete text preprocessing pipeline, including: lowercasing, HTML tags removal, URL/email removal, special character cleaning, stopword filtering, tokenization, and lemmatization. It also combines multiple text fields to form a single combined textual feature."),
        c_cell("""import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')

# Download NLTK resources
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)
nltk.download('punkt', quiet=True)
"""),
        c_cell("""# Load dataset
df = pd.read_csv("data/fake_job_postings.csv")
print("Initial dataset shape:", df.shape)
"""),
        c_cell("""# Define combined text field
text_cols = ["title", "company_profile", "description", "requirements", "benefits"]

for col in text_cols:
    df[col] = df[col].fillna("").astype(str)

# Combine fields with spaces
df["combined_text"] = df["title"] + " " + df["company_profile"] + " " + df["description"] + " " + df["requirements"] + " " + df["benefits"]
print("Combined text sample (first 100 chars):")
print(df["combined_text"].iloc[0][:200])
"""),
        c_cell("""# Custom preprocessing function
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

def clean_text(text):
    if not isinstance(text, str):
        return ""
    
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove HTML Tags
    text = re.sub(r"<[^>]*>", " ", text)
    
    # 3. Remove URLs
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    
    # 4. Remove Emails
    text = re.sub(r"\S+@\S+", " ", text)
    
    # 5. Remove Special Characters & Digits, keep letters and spaces
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    
    # 6. Tokenize & Stopwords & Lemmatize
    tokens = nltk.word_tokenize(text)
    cleaned_tokens = [
        lemmatizer.lemmatize(word) for word in tokens if word not in stop_words and len(word) > 2
    ]
    
    return " ".join(cleaned_tokens)
"""),
        c_cell("""# Test cleaning function
sample = "Check out our site at https://example.com/careers or contact recruiters@example.com for <b>Data Scientist</b> positions!"
print("Original:\\n", sample)
print("Cleaned:\\n", clean_text(sample))
"""),
        c_cell("""# Apply preprocessing
print("Preprocessing combined_text...")
df["cleaned_text"] = df["combined_text"].apply(clean_text)
print("Preprocessing complete!")
"""),
        c_cell("""# Preview cleaned text vs original
print("Original Combined Text:")
print(df["combined_text"].iloc[1][:150])
print("\\nCleaned Combined Text:")
print(df["cleaned_text"].iloc[1][:150])
"""),
        c_cell("""# Save the cleaned dataset
os.makedirs("data", exist_ok=True)
df.to_csv("data/cleaned_fake_job_postings.csv", index=False)
print("Cleaned dataset saved successfully to 'data/cleaned_fake_job_postings.csv'")
""")
    ]
    create_notebook("notebooks/02_Preprocessing.ipynb", cells)

def build_03_feature_engineering():
    cells = [
        m_cell("# 03_Feature_Engineering.ipynb\n## FakeJobShield: Feature Extraction and Engineering Pipeline\nThis notebook extracts TF-IDF text features, encodes categorical metadata fields, extracts structured binary flags, and creates a combined sparse feature matrix for machine learning. It also exports the fitted TF-IDF Vectorizer and Label Encoders."),
        c_cell("""import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from scipy.sparse import hstack, csr_matrix
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')
"""),
        c_cell("""# Load Cleaned Dataset
df = pd.read_csv("data/cleaned_fake_job_postings.csv")
df["cleaned_text"] = df["cleaned_text"].fillna("")
print("Loaded cleaned dataset shape:", df.shape)
"""),
        c_cell("""# Extract TF-IDF features
print("Fitting TF-IDF Vectorizer...")
vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2), min_df=2)
x_tfidf = vectorizer.fit_transform(df["cleaned_text"])
print("TF-IDF matrix shape:", x_tfidf.shape)
"""),
        c_cell("""# Structured binary features
for col in ["telecommuting", "has_company_logo", "has_questions"]:
    df[col] = df[col].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0, True: 1, False: 0}).fillna(0).astype(int)

x_binary = df[["telecommuting", "has_company_logo", "has_questions"]].values
print("Binary features matrix shape:", x_binary.shape)
"""),
        c_cell("""# Categorical metadata features
cat_cols = ["employment_type", "required_experience", "required_education", "industry", "function"]
label_encoders = {}

encoded_cats = []
for col in cat_cols:
    df[col] = df[col].fillna("missing").astype(str)
    le = LabelEncoder()
    df[col + "_encoded"] = le.fit_transform(df[col])
    label_encoders[col] = le
    encoded_cats.append(df[col + "_encoded"].values.reshape(-1, 1))

x_categorical = np.hstack(encoded_cats)
print("Categorical features matrix shape:", x_categorical.shape)
"""),
        c_cell("""# Combine TF-IDF, binary, and categorical features
x_binary_sparse = csr_matrix(x_binary)
x_categorical_sparse = csr_matrix(x_categorical)

x_final = hstack([x_tfidf, x_binary_sparse, x_categorical_sparse])
print("Final Combined Feature Matrix shape:", x_final.shape)
"""),
        c_cell("""# Export the vectorizer, encoders, and pipelines
os.makedirs("models", exist_ok=True)
joblib.dump(vectorizer, "models/tfidf.pkl")
joblib.dump(label_encoders, "models/label_encoders.pkl")

feature_pipeline = {
    "vectorizer": vectorizer,
    "label_encoders": label_encoders,
    "cat_cols": cat_cols,
    "binary_cols": ["telecommuting", "has_company_logo", "has_questions"]
}
joblib.dump(feature_pipeline, "models/feature_pipeline.pkl")
print("Saved tfidf.pkl, label_encoders.pkl, and feature_pipeline.pkl")
""")
    ]
    create_notebook("notebooks/03_Feature_Engineering.ipynb", cells)

def build_04_ml_models():
    cells = [
        m_cell("# 04_ML_Models.ipynb\n## FakeJobShield: Machine Learning Models Benchmark\nThis notebook splits the dataset into stratified training and testing sets, performs cross-validation, trains 6 different machine learning models (Logistic Regression, Naive Bayes, Decision Tree, Random Forest, LightGBM, XGBoost) on TF-IDF + structured features, evaluates them on standard classification metrics, and automatically saves the comparison."),
        c_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from scipy.sparse import hstack, csr_matrix
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from lightgbm import LGBMClassifier
from xgboost import XGBClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, roc_curve, classification_report
)
import json
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')

sns.set_theme(style="whitegrid")
"""),
        c_cell("""# Load the cleaned dataset and reconstruct feature matrix
df = pd.read_csv("data/cleaned_fake_job_postings.csv")
df["fraudulent_int"] = df["fraudulent"].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0}).fillna(0).astype(int)
y = df["fraudulent_int"].values

# Load Vectorizer and Label Encoders
vectorizer = joblib.load("models/tfidf.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")

# Reconstruct final feature matrix
x_tfidf = vectorizer.transform(df["cleaned_text"].fillna(""))
for col in ["telecommuting", "has_company_logo", "has_questions"]:
    df[col] = df[col].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0, True: 1, False: 0}).fillna(0).astype(int)
x_binary = df[["telecommuting", "has_company_logo", "has_questions"]].values

encoded_cats = []
for col in ["employment_type", "required_experience", "required_education", "industry", "function"]:
    df[col] = df[col].fillna("missing").astype(str)
    le = label_encoders[col]
    df[col + "_encoded"] = le.transform(df[col])
    encoded_cats.append(df[col + "_encoded"].values.reshape(-1, 1))
x_categorical = np.hstack(encoded_cats)

x_final = hstack([x_tfidf, csr_matrix(x_binary), csr_matrix(x_categorical)]).tocsr()
print("Final Combined Feature Matrix shape:", x_final.shape)
"""),
        c_cell("""# Stratified Train-Test Split (85% Train, 15% Test)
x_train, x_test, y_train, y_test = train_test_split(
    x_final, y, test_size=0.15, stratify=y, random_state=42
)
print("Train set size:", x_train.shape[0])
print("Test set size:", x_test.shape[0])
"""),
        c_cell("""# Initialize models
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
    "Naive Bayes": MultinomialNB(),
    "Decision Tree": DecisionTreeClassifier(class_weight="balanced", random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=42, n_jobs=-1),
    "LightGBM": LGBMClassifier(class_weight="balanced", random_state=42, n_jobs=-1, verbose=-1),
    "XGBoost": XGBClassifier(scale_pos_weight=20, eval_metric="logloss", random_state=42, n_jobs=-1)
}
"""),
        c_cell("""# Train and evaluate models
results = {}
plt.figure(figsize=(10, 8))

for name, model in models.items():
    print(f"Training {name}...")
    model.fit(x_train, y_train)
    
    # Predict
    preds = model.predict(x_test)
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(x_test)[:, 1]
    else:
        probs = preds
        
    # Compute metrics
    acc = accuracy_score(y_test, preds)
    prec = precision_score(y_test, preds, zero_division=0)
    rec = recall_score(y_test, preds, zero_division=0)
    f1 = f1_score(y_test, preds, zero_division=0)
    auc = roc_auc_score(y_test, probs)
    
    results[name] = {
        "Accuracy": acc,
        "Precision": prec,
        "Recall": rec,
        "F1 Score": f1,
        "ROC AUC": auc
    }
    
    print(f"  F1: {f1:.4f} | ROC AUC: {auc:.4f}")
    
    # ROC Curves
    fpr, tpr, _ = roc_curve(y_test, probs)
    plt.plot(fpr, tpr, label=f"{name} (AUC = {auc:.3f})")

plt.plot([0, 1], [0, 1], 'k--', alpha=0.5)
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curves Comparison")
plt.legend(loc="lower right")
plt.tight_layout()
plt.savefig("results/ml_roc_comparison.png", dpi=150)
plt.show()
"""),
        c_cell("""# Convert results to DataFrame
comparison_df = pd.DataFrame(results).T
print("Model Comparison Table:")
print(comparison_df)

# Save results
comparison_df.to_csv("results/ml_model_comparison.csv")
with open("results/ml_model_metrics.json", "w") as f:
    json.dump(results, f, indent=2)
"""),
        c_cell("""# Plot confusion matrix of best baseline model
best_model_name = comparison_df["F1 Score"].idxmax()
print(f"Best model determined by F1 Score: {best_model_name}")

best_model = models[best_model_name]
test_preds = best_model.predict(x_test)
cm = confusion_matrix(y_test, test_preds)

plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["Genuine", "Fraudulent"], yticklabels=["Genuine", "Fraudulent"])
plt.title(f"Confusion Matrix - {best_model_name}")
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.tight_layout()
plt.savefig(f"results/best_baseline_confusion_matrix.png", dpi=150)
plt.show()
"""),
        c_cell("""# Save best baseline model
joblib.dump(best_model, f"models/best_baseline_{best_model_name.lower().replace(' ', '_')}.pkl")
print("Saved best baseline model.")
""")
    ]
    create_notebook("notebooks/04_ML_Models.ipynb", cells)

def build_05_xgboost_model():
    cells = [
        m_cell("# 05_XGBoost_Model.ipynb\n## FakeJobShield: XGBoost Hyperparameter Tuning\nThis notebook optimizes the XGBoost classifier using hyperparameter grid tuning over `max_depth`, `learning_rate`, `subsample`, and `n_estimators`. It then trains the best estimator, visualizes the feature importances, and exports the model."),
        c_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from scipy.sparse import hstack, csr_matrix
from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, roc_auc_score, classification_report
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')

sns.set_theme(style="whitegrid")
"""),
        c_cell("""# Load cleaned dataset and reconstruct feature matrix
df = pd.read_csv("data/cleaned_fake_job_postings.csv")
df["fraudulent_int"] = df["fraudulent"].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0}).fillna(0).astype(int)
y = df["fraudulent_int"].values

# Vectorizer & Encoders
vectorizer = joblib.load("models/tfidf.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")

# Features
x_tfidf = vectorizer.transform(df["cleaned_text"].fillna(""))
for col in ["telecommuting", "has_company_logo", "has_questions"]:
    df[col] = df[col].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0, True: 1, False: 0}).fillna(0).astype(int)
x_binary = df[["telecommuting", "has_company_logo", "has_questions"]].values

encoded_cats = []
for col in ["employment_type", "required_experience", "required_education", "industry", "function"]:
    df[col] = df[col].fillna("missing").astype(str)
    le = label_encoders[col]
    df[col + "_encoded"] = le.transform(df[col])
    encoded_cats.append(df[col + "_encoded"].values.reshape(-1, 1))
x_categorical = np.hstack(encoded_cats)

x_final = hstack([x_tfidf, csr_matrix(x_binary), csr_matrix(x_categorical)]).tocsr()
print("Final Combined Feature Matrix shape:", x_final.shape)
"""),
        c_cell("""# Split data
x_train, x_test, y_train, y_test = train_test_split(
    x_final, y, test_size=0.15, stratify=y, random_state=42
)
"""),
        c_cell("""# Setup XGBoost tuning grid
xgb = XGBClassifier(scale_pos_weight=20, eval_metric="logloss", random_state=42, n_jobs=-1)

param_grid = {
    'max_depth': [4, 6],
    'learning_rate': [0.1, 0.2],
    'n_estimators': [100, 150]
}

cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

print("Starting Grid Search...")
grid_search = GridSearchCV(
    estimator=xgb,
    param_grid=param_grid,
    scoring='f1',
    cv=cv,
    verbose=1,
    n_jobs=-1
)
grid_search.fit(x_train, y_train)
print("Grid Search Complete!")
print("Best Parameters:", grid_search.best_params_)
print("Best F1 Score in CV:", grid_search.best_score_)
"""),
        c_cell("""# Evaluate Best XGBoost Model
best_xgb = grid_search.best_estimator_
test_preds = best_xgb.predict(x_test)
test_probs = best_xgb.predict_proba(x_test)[:, 1]

print("Test Performance Report:")
print(classification_report(y_test, test_preds))
print("Test F1 Score:", f1_score(y_test, test_preds))
print("Test ROC AUC Score:", roc_auc_score(y_test, test_probs))
"""),
        c_cell("""# Plot Feature Importance
feature_names = (
    list(vectorizer.get_feature_names_out()) + 
    ["telecommuting", "has_company_logo", "has_questions"] + 
    ["employment_type", "required_experience", "required_education", "industry", "function"]
)

importances = best_xgb.feature_importances_
indices = np.argsort(importances)[::-1][:20]

plt.figure(figsize=(10, 6))
sns.barplot(x=importances[indices], y=[feature_names[i] for i in indices], palette="viridis")
plt.title("Top 20 Feature Importances - Best XGBoost")
plt.xlabel("Relative Importance")
plt.tight_layout()
plt.savefig("results/xgboost_feature_importance.png", dpi=150)
plt.show()
"""),
        c_cell("""# Save Best Tuned XGBoost Model
joblib.dump(best_xgb, "models/best_xgboost.pkl")
print("Saved tuned XGBoost model to 'models/best_xgboost.pkl'")
""")
    ]
    create_notebook("notebooks/05_XGBoost_Model.ipynb", cells)

def build_06_dl_models():
    cells = [
        m_cell("# 06_DL_Models.ipynb\n## FakeJobShield: Deep Learning Text Models\nThis notebook designs, trains, and evaluates three Keras recurrent neural networks (LSTM, Bidirectional LSTM, and GRU) on job text data. Early stopping and checkpoints are employed to prevent overfitting and save the best weights."),
        c_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import json
import joblib
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout, SpatialDropout1D, Bidirectional, GRU
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, roc_auc_score

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')

sns.set_theme(style="whitegrid")
"""),
        c_cell("""# Load dataset
df = pd.read_csv("data/cleaned_fake_job_postings.csv")
df["cleaned_text"] = df["cleaned_text"].fillna("")
df["fraudulent_int"] = df["fraudulent"].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0}).fillna(0).astype(int)

texts = df["cleaned_text"].values
labels = df["fraudulent_int"].values
"""),
        c_cell("""# Text Tokenization & Padding
MAX_WORDS = 10000
MAX_LEN = 200

tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)

sequences = tokenizer.texts_to_sequences(texts)
padded_seqs = pad_sequences(sequences, maxlen=MAX_LEN, padding="post", truncating="post")

print("Padded shape:", padded_seqs.shape)
"""),
        c_cell("""# Split Data
x_train, x_test, y_train, y_test = train_test_split(
    padded_seqs, labels, test_size=0.20, stratify=labels, random_state=42
)
x_train, x_val, y_train, y_val = train_test_split(
    x_train, y_train, test_size=0.10, stratify=y_train, random_state=42
)

print(f"Train size: {x_train.shape[0]} | Val size: {x_val.shape[0]} | Test size: {x_test.shape[0]}")
"""),
        c_cell("""early_stop = EarlyStopping(monitor="val_loss", patience=2, restore_best_weights=True)
"""),
        c_cell("""# 1. Simple LSTM Model
lstm_model = Sequential([
    Embedding(input_dim=MAX_WORDS, output_dim=64, input_length=MAX_LEN),
    SpatialDropout1D(0.2),
    LSTM(64, dropout=0.2, recurrent_dropout=0.0),
    Dense(32, activation="relu"),
    Dropout(0.3),
    Dense(1, activation="sigmoid")
])

lstm_model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
lstm_model.summary()

print("Training LSTM Model...")
lstm_hist = lstm_model.fit(
    x_train, y_train,
    epochs=3,
    batch_size=128,
    validation_data=(x_val, y_val),
    callbacks=[early_stop, ModelCheckpoint("models/lstm_best.keras", save_best_only=True)],
    verbose=1
)
"""),
        c_cell("""# 2. Bidirectional LSTM Model
bilstm_model = Sequential([
    Embedding(input_dim=MAX_WORDS, output_dim=64, input_length=MAX_LEN),
    SpatialDropout1D(0.2),
    Bidirectional(LSTM(64, dropout=0.2, recurrent_dropout=0.0)),
    Dense(32, activation="relu"),
    Dropout(0.3),
    Dense(1, activation="sigmoid")
])

bilstm_model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
bilstm_model.summary()

print("Training Bidirectional LSTM Model...")
bilstm_hist = bilstm_model.fit(
    x_train, y_train,
    epochs=3,
    batch_size=128,
    validation_data=(x_val, y_val),
    callbacks=[early_stop, ModelCheckpoint("models/bilstm_best.keras", save_best_only=True)],
    verbose=1
)
"""),
        c_cell("""# 3. GRU Model
gru_model = Sequential([
    Embedding(input_dim=MAX_WORDS, output_dim=64, input_length=MAX_LEN),
    SpatialDropout1D(0.2),
    GRU(64, dropout=0.2, recurrent_dropout=0.0),
    Dense(32, activation="relu"),
    Dropout(0.3),
    Dense(1, activation="sigmoid")
])

gru_model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
gru_model.summary()

print("Training GRU Model...")
gru_hist = gru_model.fit(
    x_train, y_train,
    epochs=3,
    batch_size=128,
    validation_data=(x_val, y_val),
    callbacks=[early_stop, ModelCheckpoint("models/gru_best.keras", save_best_only=True)],
    verbose=1
)
"""),
        c_cell("""# Plot curves
def plot_histories(histories, names):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    
    for hist, name in zip(histories, names):
        ax1.plot(hist.history["val_accuracy"], label=f"{name} Val Acc")
        ax2.plot(hist.history["val_loss"], label=f"{name} Val Loss")
        
    ax1.set_title("Validation Accuracy")
    ax1.set_xlabel("Epochs")
    ax1.set_ylabel("Accuracy")
    ax1.legend()
    
    ax2.set_title("Validation Loss")
    ax2.set_xlabel("Epochs")
    ax2.set_ylabel("Loss")
    ax2.legend()
    
    plt.tight_layout()
    plt.savefig("results/dl_val_curves.png", dpi=150)
    plt.show()

plot_histories([lstm_hist, bilstm_hist, gru_hist], ["LSTM", "BiLSTM", "GRU"])
"""),
        c_cell("""# Evaluate DL models
dl_results = {}
for model, name in [(lstm_model, "LSTM"), (bilstm_model, "BiLSTM"), (gru_model, "GRU")]:
    probs = model.predict(x_test).flatten()
    preds = (probs >= 0.5).astype(int)
    
    f1 = f1_score(y_test, preds)
    auc = roc_auc_score(y_test, probs)
    
    dl_results[name] = {
        "F1 Score": f1,
        "ROC AUC": auc
    }
    print(f"{name} Test Performance:")
    print(f"  F1: {f1:.4f} | ROC AUC: {auc:.4f}")

# Save DL comparison
with open("results/dl_model_metrics.json", "w") as f:
    json.dump(dl_results, f, indent=2)

# Save tokenizer and best model
joblib.dump(tokenizer, "models/dl_tokenizer.pkl")
bilstm_model.save("models/best_dl_model.keras")
print("Saved tokenizer and finished DL model benchmark.")
""")
    ]
    create_notebook("notebooks/06_DL_Models.ipynb", cells)

def build_07_bert_model():
    cells = [
        m_cell("# 07_BERT_Model.ipynb\n## FakeJobShield: BERT Fine-Tuning\nThis notebook implements Fine-Tuning of the HuggingFace `bert-base-uncased` transformer on the job text data. To ensure fast execution on CPU, we train on a representative subset of data while providing full training pipeline implementation."),
        c_cell("""import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.metrics import precision_recall_fscore_support, accuracy_score
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')
"""),
        c_cell("""# Load cleaned text data
df = pd.read_csv("data/cleaned_fake_job_postings.csv")
df["cleaned_text"] = df["cleaned_text"].fillna("")
df["fraudulent_int"] = df["fraudulent"].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0}).fillna(0).astype(int)

# Use subset of data for fast CPU execution
genuine_sub = df[df["fraudulent_int"] == 0].sample(n=100, random_state=42)
fraudulent_sub = df[df["fraudulent_int"] == 1].sample(n=50, random_state=42)
subset_df = pd.concat([genuine_sub, fraudulent_sub]).sample(frac=1.0, random_state=42).reset_index(drop=True)

print("Subset shape:", subset_df.shape)
"""),
        c_cell("""# Split subset into train/test
train_df = subset_df.sample(frac=0.8, random_state=42)
test_df = subset_df.drop(train_df.index).reset_index(drop=True)
train_df = train_df.reset_index(drop=True)

print(f"Train size: {train_df.shape[0]} | Test size: {test_df.shape[0]}")
"""),
        c_cell("""# Tokenize dataset using BERT Tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

def encode_texts(texts):
    return tokenizer(
        list(texts),
        padding="max_length",
        truncation=True,
        max_length=64,
        return_tensors="pt"
    )

print("Encoding train/test texts...")
train_encodings = encode_texts(train_df["cleaned_text"])
test_encodings = encode_texts(test_df["cleaned_text"])
print("Encoding complete!")
"""),
        c_cell("""# Custom PyTorch Dataset
class JobDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels
        
    def __getitem__(self, idx):
        item = {key: val[idx].clone().detach() for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item
        
    def __len__(self):
        return len(self.labels)

train_dataset = JobDataset(train_encodings, train_df["fraudulent_int"].values)
test_dataset = JobDataset(test_encodings, test_df["fraudulent_int"].values)
"""),
        c_cell("""# Metrics function
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average="binary")
    acc = accuracy_score(labels, preds)
    return {
        "accuracy": acc,
        "precision": precision,
        "recall": recall,
        "f1": f1
    }
"""),
        c_cell("""# Load pre-trained BERT
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
"""),
        c_cell("""# Define HuggingFace Trainer arguments
training_args = TrainingArguments(
    output_dir="./results/bert_checkpoints",
    num_train_epochs=1,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=5,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=5,
    eval_strategy="epoch",
    save_strategy="epoch",
    use_cpu=True
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics
)
"""),
        c_cell("""# Fine-tune model
print("Training BERT...")
trainer.train()
print("BERT Training complete!")
"""),
        c_cell("""# Evaluate model
eval_results = trainer.evaluate()
print("BERT Evaluation Results:")
print(eval_results)

# Save metrics
import json
with open("results/bert_metrics.json", "w") as f:
    json.dump(eval_results, f, indent=2)
"""),
        c_cell("""# Save BERT model
os.makedirs("models/bert_model", exist_ok=True)
model.save_pretrained("models/bert_model")
tokenizer.save_pretrained("models/bert_model")
print("Saved BERT model weights and tokenizer to 'models/bert_model/'")
""")
    ]
    create_notebook("notebooks/07_BERT_Model.ipynb", cells)

def build_08_cybersecurity_features():
    cells = [
        m_cell("# 08_Cybersecurity_Features.ipynb\n## FakeJobShield: Cybersecurity Indicator Engineering\nThis notebook designs and extracts custom cybersecurity indicators from job postings. These include detecting OTP requests, national identification requests (PAN, Aadhaar, Passport), financial details (Bank Account, Debit Card), and advance processing fees. It computes a combined `Sensitive_Data_Score`, suspicious keywords counts, and personal recruiter email checks, then merges them back into the main dataset."),
        c_cell("""import pandas as pd
import numpy as np
import re
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')
"""),
        c_cell("""# Load original raw dataset
df = pd.read_csv("data/fake_job_postings.csv")
print("Dataset columns:", df.columns.tolist())
"""),
        c_cell("""# Define free email domains lists
FREE_EMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "aol.com", "icloud.com", "protonmail.com", "mail.com", "yandex.com"
}

# Suspicious keyword lists
URGENCY_KEYWORDS = [
    "urgent", "immediately", "act now", "limited slots", "only few positions",
    "guaranteed", "no interview", "instant hire", "send details now", "quick money", "easy money"
]
"""),
        c_cell("""# Define cybersecurity extraction rules
def detect_pattern(text, pattern):
    if not isinstance(text, str):
        return 0
    return 1 if re.search(pattern, text, re.IGNORECASE) else 0

def calculate_cybersecurity_features(row):
    text = " ".join([
        str(row.get("title", "")),
        str(row.get("description", "")),
        str(row.get("requirements", "")),
        str(row.get("company_profile", "")),
        str(row.get("benefits", ""))
    ]).lower()
    
    req_otp = detect_pattern(text, r"\\botp\\b|one[- ]time[- ]password")
    req_aadhaar = detect_pattern(text, r"\\baadhaar\\b|\\baadhar\\b|uidai")
    req_pan = detect_pattern(text, r"\\bpan\\b|\\bpan card\\b|permanent account number")
    req_passport = detect_pattern(text, r"\\bpassport\\b")
    req_bank = detect_pattern(text, r"bank account|routing number|account number|routing no")
    req_card = detect_pattern(text, r"debit card|credit card|cvv|card number")
    req_reg_fee = detect_pattern(text, r"registration fee|processing fee|application fee|interview fee")
    req_proc_fee = detect_pattern(text, r"processing charge|equipment deposit|wire transfer|money deposit")
    
    sensitive_flags = [req_otp, req_aadhaar, req_pan, req_passport, req_bank, req_card, req_reg_fee, req_proc_fee]
    sensitive_data_score = sum(sensitive_flags) / len(sensitive_flags)
    
    urgency_count = sum(1 for kw in URGENCY_KEYWORDS if kw in text)
    
    has_personal_email = 0
    if re.search(r"\\b[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|mail|yandex)\\.com\\b", text, re.I):
        has_personal_email = 1
    
    has_suspicious_url = 0
    if re.search(r"bit\\.ly|tinyurl|goo\\.gl|\\.tk/", text, re.I):
        has_suspicious_url = 1
        
    return pd.Series({
        "req_otp": req_otp,
        "req_aadhaar": req_aadhaar,
        "req_pan": req_pan,
        "req_passport": req_passport,
        "req_bank": req_bank,
        "req_card": req_card,
        "req_reg_fee": req_reg_fee,
        "req_proc_fee": req_proc_fee,
        "sensitive_data_score": sensitive_data_score,
        "urgency_count": urgency_count,
        "has_personal_email": has_personal_email,
        "has_suspicious_url": has_suspicious_url
    })
"""),
        c_cell("""# Apply feature engineering
print("Extracting cybersecurity features from job posts...")
sec_features = df.apply(calculate_cybersecurity_features, axis=1)
print("Extraction complete!")
"""),
        c_cell("""# Merge back with original dataset
cyber_df = pd.concat([df, sec_features], axis=1)
print("New dataset shape:", cyber_df.shape)
print("Sensitive data score summary statistics:")
print(cyber_df["sensitive_data_score"].describe())
"""),
        c_cell("""# Save dataset
os.makedirs("data", exist_ok=True)
cyber_df.to_csv("data/cybersecurity_features.csv", index=False)
print("Saved cybersecurity enriched features dataset to 'data/cybersecurity_features.csv'")
""")
    ]
    create_notebook("notebooks/08_Cybersecurity_Features.ipynb", cells)

def build_09_shap_explainability():
    cells = [
        m_cell("# 09_SHAP_Explainability.ipynb\n## FakeJobShield: Explainable AI with SHAP\nThis notebook loads the trained XGBoost model and applies SHAP (SHapley Additive exPlanations) to explain predictions globally and locally. It outputs summary plots, feature importances, waterfalls, and local force plots explaining why specific jobs are flagged as fraudulent."),
        c_cell("""import pandas as pd
import numpy as np
import joblib
import shap
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.sparse import hstack, csr_matrix
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')

sns.set_theme(style="whitegrid")
"""),
        c_cell("""# Load best tuned XGBoost model
best_xgb = joblib.load("models/best_xgboost.pkl")

# Load feature pipeline & cleaned dataset
feature_pipeline = joblib.load("models/feature_pipeline.pkl")
df = pd.read_csv("data/cleaned_fake_job_postings.csv")
df["fraudulent_int"] = df["fraudulent"].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0}).fillna(0).astype(int)
y = df["fraudulent_int"].values

# Extract features
vectorizer = feature_pipeline["vectorizer"]
label_encoders = feature_pipeline["label_encoders"]

x_tfidf = vectorizer.transform(df["cleaned_text"].fillna(""))
for col in ["telecommuting", "has_company_logo", "has_questions"]:
    df[col] = df[col].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0, True: 1, False: 0}).fillna(0).astype(int)
x_binary = df[["telecommuting", "has_company_logo", "has_questions"]].values

encoded_cats = []
for col in ["employment_type", "required_experience", "required_education", "industry", "function"]:
    df[col] = df[col].fillna("missing").astype(str)
    le = label_encoders[col]
    df[col + "_encoded"] = le.transform(df[col])
    encoded_cats.append(df[col + "_encoded"].values.reshape(-1, 1))
x_categorical = np.hstack(encoded_cats)

x_final = hstack([x_tfidf, csr_matrix(x_binary), csr_matrix(x_categorical)]).tocsr()
"""),
        c_cell("""# Fit SHAP Explainer
bg_data = x_final[np.random.choice(x_final.shape[0], 100, replace=False)].toarray()
test_data = x_final[np.random.choice(x_final.shape[0], 100, replace=False)].toarray()

feature_names = (
    list(vectorizer.get_feature_names_out()) + 
    ["telecommuting", "has_company_logo", "has_questions"] + 
    ["employment_type", "required_experience", "required_education", "industry", "function"]
)

explainer = shap.TreeExplainer(best_xgb, bg_data)
shap_values = explainer(test_data)
print("SHAP Values computed successfully!")
"""),
        c_cell("""# 1. Global Summary Plot
plt.figure(figsize=(10, 6))
shap.summary_plot(shap_values, test_data, feature_names=feature_names, show=False)
plt.title("SHAP Global Summary Plot")
plt.tight_layout()
plt.savefig("results/shap_summary_plot.png", dpi=150)
plt.show()
"""),
        c_cell("""# 2. Global Feature Importance Plot
plt.figure(figsize=(10, 6))
shap.plots.bar(shap_values, max_display=15, show=False)
plt.title("SHAP Global Feature Importance")
plt.tight_layout()
plt.savefig("results/shap_feature_importance.png", dpi=150)
plt.show()
"""),
        c_cell("""# 3. Local Explanation (Waterfall Plot)
probs = best_xgb.predict_proba(test_data)[:, 1]
high_fraud_idx = np.argmax(probs)
print(f"Explaining test sample index {high_fraud_idx} with fraud probability: {probs[high_fraud_idx]:.4f}")

plt.figure(figsize=(10, 6))
shap.plots.waterfall(shap_values[high_fraud_idx], max_display=10, show=False)
plt.title(f"SHAP Waterfall Plot for Job Post (P_Fraud = {probs[high_fraud_idx]:.2f})")
plt.tight_layout()
plt.savefig("results/shap_local_waterfall.png", dpi=150)
plt.show()
"""),
        c_cell("""# 4. Local Explanation (Force Plot)
plt.figure(figsize=(12, 4))
shap.plots.force(shap_values[high_fraud_idx], matplotlib=True, show=False)
plt.title("SHAP Force Plot")
plt.tight_layout()
plt.savefig("results/shap_local_force_plot.png", dpi=150)
plt.show()
""")
    ]
    create_notebook("notebooks/09_SHAP_Explainability.ipynb", cells)

def build_10_hybrid_model():
    cells = [
        m_cell("# 10_Hybrid_Model.ipynb\n## FakeJobShield: proposed Hybrid XGBoost & Trust Score Generation\nThis notebook builds the final FakeJobShield Hybrid model. It combines text features (TF-IDF), cybersecurity feature indicators, and structured metadata. It trains a final XGBoost classifier, calculates a Trust Score using the formula: `Trust Score = (1 - Fraud Probability) * 100`, assigns jobs to risk bands, and saves the final models."),
        c_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from scipy.sparse import hstack, csr_matrix
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, f1_score, confusion_matrix
import os

# Adjust working directory if run from notebooks folder
if os.path.basename(os.getcwd()) == 'notebooks':
    os.chdir('..')

sns.set_theme(style="whitegrid")
"""),
        c_cell("""# Load combined text and cybersecurity dataset
df_cyber = pd.read_csv("data/cybersecurity_features.csv")
df_cleaned = pd.read_csv("data/cleaned_fake_job_postings.csv")

# Ensure target labels
df_cyber["fraudulent_int"] = df_cyber["fraudulent"].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0}).fillna(0).astype(int)
y = df_cyber["fraudulent_int"].values

# Load Vectorizer and Label Encoders
vectorizer = joblib.load("models/tfidf.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")

# TF-IDF Features
x_tfidf = vectorizer.transform(df_cleaned["cleaned_text"].fillna(""))

# Cybersecurity Features
cyber_cols = [
    "req_otp", "req_aadhaar", "req_pan", "req_passport", "req_bank", "req_card", 
    "req_reg_fee", "req_proc_fee", "sensitive_data_score", "urgency_count", 
    "has_personal_email", "has_suspicious_url"
]
x_cyber = df_cyber[cyber_cols].values

# Structured Categorical Features
cat_cols = ["employment_type", "required_experience", "required_education", "industry", "function"]
encoded_cats = []
for col in cat_cols:
    df_cyber[col] = df_cyber[col].fillna("missing").astype(str)
    le = label_encoders[col]
    df_cyber[col + "_encoded"] = le.transform(df_cyber[col])
    encoded_cats.append(df_cyber[col + "_encoded"].values.reshape(-1, 1))
x_categorical = np.hstack(encoded_cats)

# Structured Binary Features
for col in ["telecommuting", "has_company_logo", "has_questions"]:
    df_cyber[col] = df_cyber[col].map({'t': 1, 'f': 0, '1': 1, '0': 0, 1: 1, 0: 0, True: 1, False: 0}).fillna(0).astype(int)
x_binary = df_cyber[["telecommuting", "has_company_logo", "has_questions"]].values

# Combine everything
x_hybrid = hstack([x_tfidf, csr_matrix(x_cyber), csr_matrix(x_categorical), csr_matrix(x_binary)]).tocsr()
print("Hybrid Feature Matrix shape:", x_hybrid.shape)
"""),
        c_cell("""# Split Data
x_train, x_test, y_train, y_test = train_test_split(
    x_hybrid, y, test_size=0.15, stratify=y, random_state=42
)
"""),
        c_cell("""# Train Hybrid Model
hybrid_model = XGBClassifier(
    n_estimators=150,
    max_depth=6,
    learning_rate=0.1,
    scale_pos_weight=20,
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1
)

print("Training Hybrid Model...")
hybrid_model.fit(x_train, y_train)
print("Training Complete!")
"""),
        c_cell("""# Evaluate Hybrid Model
probs = hybrid_model.predict_proba(x_test)[:, 1]
preds = hybrid_model.predict(x_test)

print("Hybrid Model Evaluation:")
print(classification_report(y_test, preds))
print("Test F1 Score:", f1_score(y_test, preds))
print("Test ROC AUC Score:", roc_auc_score(y_test, probs))
"""),
        m_cell("## Trust Score Framework\\nWe calculate the Trust Score based on the formula: `Trust Score = (1 - Fraud Probability) * 100`\\n\\n**Trust Bands:**\\n* 81-100: **Trusted**\\n* 61-80: **Low Risk**\\n* 41-60: **Medium Risk**\\n* 21-40: **High Risk**\\n* 0-20: **Highly Fraudulent**"),
        c_cell("""# Calculate Trust Scores
trust_scores = (1 - probs) * 100

def get_risk_level(score):
    if score >= 81: return "Trusted"
    elif score >= 61: return "Low Risk"
    elif score >= 41: return "Medium Risk"
    elif score >= 21: return "High Risk"
    else: return "Highly Fraudulent"

risk_levels = [get_risk_level(s) for s in trust_scores]

# Distribution analysis
results_df = pd.DataFrame({
    "actual_label": y_test,
    "fraud_prob": probs,
    "trust_score": trust_scores,
    "risk_level": risk_levels
})

print("Average Trust Score for Genuine Job Postings (Label=0):")
print(results_df[results_df["actual_label"] == 0]["trust_score"].mean())

print("\\nAverage Trust Score for Fraudulent Job Postings (Label=1):")
print(results_df[results_df["actual_label"] == 1]["trust_score"].mean())
"""),
        c_cell("""# Plot trust score distribution
plt.figure(figsize=(10, 6))
sns.histplot(data=results_df, x="trust_score", hue="actual_label", kde=True, bins=25, palette="coolwarm", multiple="stack")
plt.title("Trust Score Distribution by Job Class (0=Genuine, 1=Fraudulent)")
plt.xlabel("Trust Score")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("results/trust_score_distribution.png", dpi=150)
plt.show()
"""),
        c_cell("""# Risk levels table
risk_summary = results_df.groupby(["risk_level", "actual_label"]).size().unstack(fill_value=0)
print("Risk Level Matrix (Risk Level vs Actual Label):")
print(risk_summary)
"""),
        c_cell("""# Export Hybrid Model & Metadata mapping
joblib.dump(hybrid_model, "models/hybrid_model.pkl")

# Save a configuration dictionary
hybrid_metadata = {
    "cyber_cols": cyber_cols,
    "cat_cols": cat_cols,
    "binary_cols": ["telecommuting", "has_company_logo", "has_questions"]
}
joblib.dump(hybrid_metadata, "models/hybrid_metadata.pkl")

print("Saved hybrid_model.pkl and hybrid_metadata.pkl to 'models/'")
""")
    ]
    create_notebook("notebooks/10_Hybrid_Model.ipynb", cells)

if __name__ == "__main__":
    print("Generating notebooks...")
    build_01_eda()
    build_02_preprocessing()
    build_03_feature_engineering()
    build_04_ml_models()
    build_05_xgboost_model()
    build_06_dl_models()
    build_07_bert_model()
    build_08_cybersecurity_features()
    build_09_shap_explainability()
    build_10_hybrid_model()
    print("All notebooks generated successfully!")
