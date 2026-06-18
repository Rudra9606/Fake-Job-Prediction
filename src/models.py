from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import joblib
import numpy as np
from scipy.sparse import hstack, spmatrix
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier
from imblearn.over_sampling import ADASYN
from imblearn.pipeline import Pipeline as ImbPipeline

try:
    from xgboost import XGBClassifier

    HAS_XGB = True
except ImportError:
    HAS_XGB = False

from src.config import MODELS_DIR, RANDOM_SEED
from src.preprocessing import build_text_series, extract_metadata_features


@dataclass
class TrainArtifacts:
    vectorizer: TfidfVectorizer
    model: Any
    model_name: str
    use_metadata: bool


def get_sklearn_models() -> dict[str, Any]:
    models: dict[str, Any] = {
        "logistic_regression": LogisticRegression(max_iter=1000, class_weight="balanced"),
        "naive_bayes": MultinomialNB(),
        "decision_tree": DecisionTreeClassifier(class_weight="balanced", random_state=RANDOM_SEED),
        "knn": KNeighborsClassifier(n_neighbors=5),
        "random_forest": RandomForestClassifier(
            n_estimators=200, class_weight="balanced", random_state=RANDOM_SEED, n_jobs=-1
        ),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=300, class_weight="balanced", random_state=RANDOM_SEED, n_jobs=-1
        ),
        "linear_svc": LinearSVC(class_weight="balanced", random_state=RANDOM_SEED),
    }
    if HAS_XGB:
        models["xgboost"] = XGBClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            scale_pos_weight=20,
            random_state=RANDOM_SEED,
            eval_metric="logloss",
        )
    return models


def _build_features(
    vectorizer: TfidfVectorizer,
    df,
    fit: bool,
    use_metadata: bool,
) -> spmatrix | np.ndarray:
    texts = build_text_series(df)
    if fit:
        x_text = vectorizer.fit_transform(texts)
    else:
        x_text = vectorizer.transform(texts)
    if not use_metadata:
        return x_text
    meta = extract_metadata_features(df)
    return hstack([x_text, meta])


def train_model(
    df,
    model_name: str = "extra_trees",
    *,
    use_adasyn: bool = True,
    use_metadata: bool = True,
) -> TrainArtifacts:
    y = df["fraudulent"].astype(int).values
    vectorizer = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        min_df=2,
        stop_words="english",
        sublinear_tf=True,
    )

    x_train_df, x_test_df, y_train, y_test = train_test_split(
        df, y, test_size=0.15, random_state=RANDOM_SEED, stratify=y
    )
    x_train_df, x_val_df, y_train, y_val = train_test_split(
        x_train_df, y_train, test_size=0.176, random_state=RANDOM_SEED, stratify=y_train
    )

    x_train = _build_features(vectorizer, x_train_df, fit=True, use_metadata=use_metadata)
    x_val = _build_features(vectorizer, x_val_df, fit=False, use_metadata=use_metadata)

    models = get_sklearn_models()
    if model_name not in models:
        raise ValueError(f"Unknown model: {model_name}")

    base = models[model_name]

    if use_adasyn and model_name != "naive_bayes":
        clf = ImbPipeline([("adasyn", ADASYN(random_state=RANDOM_SEED)), ("clf", base)])
    else:
        clf = base

    clf.fit(x_train, y_train)
    val_probs = _predict_proba(clf, x_val, model_name)
    val_auc = roc_auc_score(y_val, val_probs)

    artifacts = TrainArtifacts(
        vectorizer=vectorizer,
        model=clf,
        model_name=model_name,
        use_metadata=use_metadata,
    )
    joblib.dump(
        {
            "vectorizer": vectorizer,
            "model": clf,
            "model_name": model_name,
            "use_metadata": use_metadata,
            "val_auc": val_auc,
        },
        MODELS_DIR / f"{model_name}_model.joblib",
    )
    return artifacts


def _predict_proba(clf, x, model_name: str) -> np.ndarray:
    if model_name == "linear_svc":
        scores = clf.decision_function(x)
        return 1 / (1 + np.exp(-scores))
    if hasattr(clf, "predict_proba"):
        return clf.predict_proba(x)[:, 1]
    if hasattr(clf, "named_steps"):
        inner = clf.named_steps.get("clf", clf)
        if hasattr(inner, "predict_proba"):
            return inner.predict_proba(x)[:, 1]
    preds = clf.predict(x)
    return preds.astype(float)


def predict_text_proba(artifacts: TrainArtifacts, df) -> np.ndarray:
    x = _build_features(
        artifacts.vectorizer, df, fit=False, use_metadata=artifacts.use_metadata
    )
    return _predict_proba(artifacts.model, x, artifacts.model_name)


def evaluate_predictions(y_true: np.ndarray, y_prob: np.ndarray, threshold: float = 0.5) -> dict:
    y_pred = (y_prob >= threshold).astype(int)
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_true, y_prob)),
        "false_positive_rate": float(np.mean((y_pred == 1) & (y_true == 0))),
        "false_negative_rate": float(np.mean((y_pred == 0) & (y_true == 1))),
    }


def load_best_model() -> dict:
    path = MODELS_DIR / "extra_trees_model.joblib"
    if not path.exists():
        path = MODELS_DIR / "random_forest_model.joblib"
    return joblib.load(path)
