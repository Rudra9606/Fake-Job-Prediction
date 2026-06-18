from __future__ import annotations

import pandas as pd

from src.config import DATASET_PATH


def _tf_to_int(series: pd.Series) -> pd.Series:
    mapping = {"t": 1, "f": 0, "true": 1, "false": 0, True: 1, False: 0, 1: 1, 0: 0}
    return series.map(lambda x: mapping.get(x, mapping.get(str(x).lower(), 0))).astype(int)


def load_dataset(path=DATASET_PATH) -> pd.DataFrame:
    df = pd.read_csv(path, low_memory=False)
    df["fraudulent"] = _tf_to_int(df["fraudulent"])
    for col in ("telecommuting", "has_company_logo", "has_questions"):
        if col in df.columns:
            df[col] = _tf_to_int(df[col])
    return df
