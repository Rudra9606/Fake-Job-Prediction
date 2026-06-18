# FakeJobShield — Step-by-Step Completion Log

All phases from the research plan have been applied in this folder.

## Phase 1 — Foundation ✅

| Step | File |
|------|------|
| Research scope | `docs/01-research-scope.md` |
| Problem statement + RQs | `docs/02-problem-statement-and-rqs.md` |
| Literature matrix (15 entries) | `docs/03-literature-matrix.md` |
| Dataset specification | `docs/04-dataset-spec.md` |
| Dataset downloaded | `data/fakeJobDataset.csv` (EMSCAD, 17,880 rows) |

## Phase 2 — Design ✅

| Step | File |
|------|------|
| System architecture | `docs/05-architecture.md` |
| Feature engineering | `docs/06-feature-engineering.md` |
| Trust score formula | `docs/07-trust-score-design.md` |

## Phase 3 — Build ✅

| Component | Location |
|-----------|----------|
| Data loader (t/f → 0/1) | `src/data_loader.py` |
| NLP preprocessing | `src/preprocessing.py` |
| ML models (8 classifiers) | `src/models.py` |
| Cybersecurity 4-layer module | `src/security.py` |
| Trust score engine | `src/trust_score.py` |
| Hybrid fusion | `src/fusion.py` |
| FastAPI + demo UI | `src/api.py`, `static/index.html` |
| Dependencies | `requirements.txt` |

## Phase 4 — Evaluate ✅

| Output | Location |
|--------|----------|
| Full experiment run | `scripts/run_experiments.py` |
| Metrics JSON | `results/experiment_results.json` |
| ROC comparison plot | `results/roc_comparison.png` |
| Hybrid confusion matrix | `results/confusion_hybrid.png` |
| Trained model | `models/extra_trees_model.joblib` |

### Key Results

- **Hybrid F1:** 0.813 vs text-only 0.795 (+1.8 pp)
- **Hybrid precision:** 100% (0 false positives on test set)
- **Trust scores:** fake avg 38.4, real avg 80.1

## Phase 5 — Write ✅

| Deliverable | Location |
|-------------|----------|
| Full paper draft (with results) | `paper/full-paper-draft.md` |
| Project README | `README.md` |

## How to Run

```powershell
cd "Research- FakeJobShield"
$env:PYTHONPATH = (Get-Location).Path
python scripts/run_experiments.py
uvicorn src.api:app --reload --port 8000
```

## Your Remaining Manual Steps

1. Expand references in `paper/full-paper-draft.md` with full IEEE citations.
2. Add author names, affiliation, and venue formatting.
3. Optional: run `python scripts/train_baselines.py` for all 8 model comparisons.
4. Optional: integrate live WHOIS API in `src/security.py` for deployment section.
