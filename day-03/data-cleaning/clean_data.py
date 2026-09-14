from pathlib import Path

import numpy as np
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
RAW_FILE = BASE_DIR / "dataset" / "facility_data.csv"
CLEAN_FILE = BASE_DIR / "dataset" / "cleaned_facility_data.csv"


def main():
    data = pd.read_csv(RAW_FILE)
    print(f"Rows before cleaning: {len(data)}")
    print("Missing values before cleaning:")
    print(data.isna().sum())
    print("Duplicate facility IDs:", int(data.duplicated(subset="facility_id").sum()))

    data = data.drop_duplicates(subset="facility_id").copy()
    data["waste_level"] = data["waste_level"].str.strip().str.title()
    data["water_availability"] = data["water_availability"].replace({"Unknown": np.nan})

    for column in ["cleanliness_score", "odor_score", "footfall", "complaints"]:
        data[column] = pd.to_numeric(data[column], errors="coerce")

    invalid_cleanliness = data["cleanliness_score"].notna() & ~data["cleanliness_score"].between(0, 10)
    invalid_odor = data["odor_score"].notna() & ~data["odor_score"].between(0, 10)
    invalid_counts = {
        "cleanliness_score": int(invalid_cleanliness.sum()),
        "odor_score": int(invalid_odor.sum()),
        "footfall": int((data["footfall"] < 0).sum()),
        "complaints": int((data["complaints"] < 0).sum()),
    }
    print("Invalid values:", invalid_counts)
    data.loc[invalid_cleanliness, "cleanliness_score"] = np.nan
    data.loc[invalid_odor, "odor_score"] = np.nan
    data.loc[data["footfall"] < 0, "footfall"] = np.nan
    data.loc[data["complaints"] < 0, "complaints"] = np.nan

    for column in ["cleanliness_score", "odor_score", "footfall", "complaints"]:
        data[column] = data[column].fillna(data[column].median())
    data["water_availability"] = data["water_availability"].fillna("Yes")
    data["inspection_date"] = pd.to_datetime(data["inspection_date"])

    data.to_csv(CLEAN_FILE, index=False)
    print(f"Rows after cleaning: {len(data)}")
    print(f"Cleaned dataset saved to: {CLEAN_FILE}")


if __name__ == "__main__":
    main()
