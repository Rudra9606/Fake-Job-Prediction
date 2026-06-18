"""Train all baseline models and save best artifact."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from src.config import MODELS_DIR, RESULTS_DIR
from src.data_loader import load_dataset
from src.models import evaluate_predictions, get_sklearn_models, predict_text_proba, train_model
from sklearn.model_selection import train_test_split
from src.config import RANDOM_SEED


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    df = load_dataset()
    y = df["fraudulent"].astype(int).values
    _, test_df, _, y_test = train_test_split(
        df, y, test_size=0.15, random_state=RANDOM_SEED, stratify=y
    )

    summary = {}
    best_f1 = -1.0
    best_name = "extra_trees"

    for name in get_sklearn_models():
        print(f"Training {name}...")
        artifacts = train_model(df, model_name=name, use_adasyn=True, use_metadata=True)
        probs = predict_text_proba(artifacts, test_df)
        metrics = evaluate_predictions(y_test, probs)
        summary[name] = metrics
        print(f"  F1={metrics['f1']:.4f} AUC={metrics['roc_auc']:.4f}")
        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            best_name = name

    out = RESULTS_DIR / "baseline_metrics.json"
    out.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"\nBest text-only model: {best_name} (F1={best_f1:.4f})")
    print(f"Saved metrics to {out}")


if __name__ == "__main__":
    main()
