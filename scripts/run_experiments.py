"""Run full FakeJobShield experiments: text-only vs hybrid vs ablation."""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_auc_score, roc_curve

from src.config import RANDOM_SEED, RESULTS_DIR
from src.data_loader import load_dataset
from src.fusion import analyze_dataframe_row
from src.models import TrainArtifacts, evaluate_predictions, predict_text_proba, train_model
from src.preprocessing import job_post_from_row
from src.security import analyze_security, simulate_security_features_for_training
from sklearn.model_selection import train_test_split


def hybrid_prob(p_text: float, p_sec: float, sensitive: bool) -> float:
    from src.config import TRUST_WEIGHTS

    penalty = 1.0 if sensitive else 0.0
    risk = (
        TRUST_WEIGHTS["alpha"] * p_text
        + TRUST_WEIGHTS["beta"] * p_sec
        + TRUST_WEIGHTS["gamma"] * penalty
    )
    return min(1.0, risk)


def security_only_prob(post: dict, sim: dict) -> float:
    post = dict(post)
    post["contact_email"] = sim.get("simulated_email", "")
    result = analyze_security(
        post,
        simulated_domain_age_days=sim.get("simulated_domain_age_days"),
        simulated_careers_match=sim.get("simulated_careers_match"),
    )
    return result.p_fake_sec


def save_roc(y_true, curves: dict[str, np.ndarray], path: Path) -> None:
    plt.figure(figsize=(8, 6))
    for name, scores in curves.items():
        fpr, tpr, _ = roc_curve(y_true, scores)
        auc = roc_auc_score(y_true, scores)
        plt.plot(fpr, tpr, label=f"{name} (AUC={auc:.3f})")
    plt.plot([0, 1], [0, 1], "k--", alpha=0.4)
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("FakeJobShield — ROC Comparison")
    plt.legend()
    plt.tight_layout()
    plt.savefig(path, dpi=150)
    plt.close()


def save_confusion(y_true, y_prob, title: str, path: Path) -> None:
    y_pred = (y_prob >= 0.5).astype(int)
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["Real", "Fake"], yticklabels=["Real", "Fake"])
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title(title)
    plt.tight_layout()
    plt.savefig(path, dpi=150)
    plt.close()


def main() -> None:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(RANDOM_SEED)

    df = load_dataset()
    y = df["fraudulent"].astype(int).values
    _, test_df, _, y_test = train_test_split(
        df, y, test_size=0.15, random_state=RANDOM_SEED, stratify=y
    )

    print("Training primary model (extra_trees + ADASYN)...")
    artifacts = train_model(df, model_name="extra_trees", use_adasyn=True, use_metadata=True)
    text_probs = predict_text_proba(artifacts, test_df)

    sim_features = simulate_security_features_for_training(y_test, rng)
    sec_probs = []
    hybrid_probs = []
    trust_scores = []

    for idx, (_, row) in enumerate(test_df.iterrows()):
        sim = sim_features[idx]
        post = job_post_from_row(row)
        post["contact_email"] = sim["simulated_email"]
        sec = analyze_security(
            post,
            simulated_domain_age_days=sim["simulated_domain_age_days"],
            simulated_careers_match=sim["simulated_careers_match"],
        )
        p_text = float(text_probs[idx])
        p_sec = sec.p_fake_sec
        p_hybrid = hybrid_prob(p_text, p_sec, sec.requests_sensitive_data)
        sec_probs.append(p_sec)
        hybrid_probs.append(p_hybrid)
        trust_scores.append(round(100 * (1 - p_hybrid)))

    sec_probs = np.array(sec_probs)
    hybrid_probs = np.array(hybrid_probs)

    metrics = {
        "text_only_extra_trees": evaluate_predictions(y_test, text_probs),
        "security_only": evaluate_predictions(y_test, sec_probs),
        "fakejobshield_hybrid": evaluate_predictions(y_test, hybrid_probs),
    }

    # Ablation: text without metadata
    print("Ablation: text without metadata...")
    artifacts_no_meta = train_model(df, model_name="extra_trees", use_adasyn=True, use_metadata=False)
    text_no_meta = predict_text_proba(artifacts_no_meta, test_df)
    metrics["text_only_no_metadata"] = evaluate_predictions(y_test, text_no_meta)

    # Case studies
    fake_idx = np.where(y_test == 1)[0][:2]
    real_idx = np.where(y_test == 0)[0][:2]
    case_studies = []
    for i in list(fake_idx) + list(real_idx):
        row = test_df.iloc[i]
        result = analyze_dataframe_row(row, artifacts, sim_features[i])
        result["actual_label"] = "fake" if y_test[i] == 1 else "real"
        case_studies.append(result)

    save_roc(
        y_test,
        {
            "Text-only (Extra Trees)": text_probs,
            "Security-only": sec_probs,
            "FakeJobShield Hybrid": hybrid_probs,
        },
        RESULTS_DIR / "roc_comparison.png",
    )
    save_confusion(y_test, hybrid_probs, "FakeJobShield Hybrid", RESULTS_DIR / "confusion_hybrid.png")

    output = {
        "research_questions_addressed": {
            "RQ1_hybrid_vs_text": metrics["fakejobshield_hybrid"]["f1"]
            - metrics["text_only_extra_trees"]["f1"],
            "RQ3_fpr_improvement": metrics["text_only_extra_trees"]["false_positive_rate"]
            - metrics["fakejobshield_hybrid"]["false_positive_rate"],
        },
        "metrics": metrics,
        "trust_score_stats": {
            "mean_fake": float(np.mean([trust_scores[i] for i in range(len(y_test)) if y_test[i] == 1])),
            "mean_real": float(np.mean([trust_scores[i] for i in range(len(y_test)) if y_test[i] == 0])),
        },
        "case_studies": case_studies,
    }

    (RESULTS_DIR / "experiment_results.json").write_text(
        json.dumps(output, indent=2), encoding="utf-8"
    )
    print(json.dumps(metrics, indent=2))
    print(f"\nResults saved to {RESULTS_DIR}")


if __name__ == "__main__":
    main()
