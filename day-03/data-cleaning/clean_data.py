"""Clean the supplied facility-hygiene Excel dataset for Day 3 analysis."""
from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_FILE = BASE_DIR / "dataset" / "facility_hygiene_ml_dataset.xlsx"
CLEAN_FILE = BASE_DIR / "dataset" / "cleaned_facility_hygiene_data.csv"
DATA_SHEET = "Facility Hygiene Dataset"


def main():
    data = pd.read_excel(SOURCE_FILE, sheet_name=DATA_SHEET)
    print(f"Rows before cleaning: {len(data)}")
    print("Missing values before cleaning:")
    print(data.isna().sum())
    print("Exact duplicate rows:", int(data.duplicated().sum()))

    data = data.drop_duplicates().copy()
    for column in ["facility_id", "location", "facility_type", "water_availability", "hygiene_risk"]:
        data[column] = data[column].str.strip()

    numeric_columns = [
        "cleanliness_score", "odor_score", "waste_level", "footfall",
        "complaints", "hours_since_cleaning",
    ]
    for column in numeric_columns:
        data[column] = pd.to_numeric(data[column], errors="coerce")

    valid_ranges = {
        "cleanliness_score": (1, 10), "odor_score": (1, 10),
        "waste_level": (0, 100), "footfall": (0, None),
        "complaints": (0, None), "hours_since_cleaning": (0, None),
    }
    invalid_values = {}
    for column, (minimum, maximum) in valid_ranges.items():
        invalid = data[column].notna() & (data[column] < minimum)
        if maximum is not None:
            invalid |= data[column].notna() & (data[column] > maximum)
        invalid_values[column] = int(invalid.sum())
        data.loc[invalid, column] = pd.NA
    print("Out-of-range values converted to missing:", invalid_values)

    for column in numeric_columns:
        data[column] = data[column].fillna(data[column].median())
    data["water_availability"] = data["water_availability"].fillna(data["water_availability"].mode()[0])
    data["inspection_date"] = pd.to_datetime(data["inspection_date"], errors="coerce")

    data.to_csv(CLEAN_FILE, index=False)
    print(f"Rows after cleaning: {len(data)}")
    print("Missing values after cleaning:")
    print(data.isna().sum())
    print(f"Cleaned dataset saved to: {CLEAN_FILE}")


if __name__ == "__main__":
    main()
