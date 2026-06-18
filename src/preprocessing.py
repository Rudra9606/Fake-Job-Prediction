from __future__ import annotations

import re
from typing import Any

import numpy as np
import pandas as pd

from src.config import METADATA_COLUMNS, TEXT_COLUMNS


def _safe_str(value: Any) -> str:
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return ""
    return str(value)


def combine_text(row: pd.Series) -> str:
    parts = [_safe_str(row.get(col, "")) for col in TEXT_COLUMNS]
    return " ".join(p for p in parts if p).strip()


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def build_text_series(df: pd.DataFrame) -> pd.Series:
    combined = df.apply(combine_text, axis=1)
    return combined.map(preprocess_text)


def extract_metadata_features(df: pd.DataFrame) -> np.ndarray:
    meta = []
    for col in METADATA_COLUMNS:
        if col in df.columns:
            meta.append(df[col].fillna(0).astype(float).values)
        else:
            meta.append(np.zeros(len(df)))
    profile_len = (
        df["company_profile"].fillna("").astype(str).str.len().values
        if "company_profile" in df.columns
        else np.zeros(len(df))
    )
    meta.append((profile_len < 50).astype(float))
    return np.column_stack(meta)


def job_post_from_row(row: pd.Series) -> dict[str, Any]:
    return {
        "title": _safe_str(row.get("title")),
        "description": _safe_str(row.get("description")),
        "company_profile": _safe_str(row.get("company_profile")),
        "requirements": _safe_str(row.get("requirements")),
        "benefits": _safe_str(row.get("benefits")),
        "salary_range": _safe_str(row.get("salary_range")),
        "department": _safe_str(row.get("department")),
        "location": _safe_str(row.get("location")),
        "telecommuting": bool(row.get("telecommuting", 0)),
        "has_company_logo": bool(row.get("has_company_logo", 0)),
        "has_questions": bool(row.get("has_questions", 0)),
        "contact_email": _safe_str(row.get("contact_email", "")),
        "job_url": _safe_str(row.get("job_url", "")),
        "company_name": _safe_str(row.get("company_profile", ""))[:80],
    }
