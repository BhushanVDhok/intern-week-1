from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "dataset" / "facility_hygiene_data.csv"
OUTPUT_FILE = BASE_DIR / "dataset" / "prepared_facility_data.csv"


def main():
    data = pd.read_csv(INPUT_FILE)
    data = data.drop_duplicates().dropna().copy()

    waste_scores = {"Low": 0, "Medium": 2, "High": 4}
    data["waste_score"] = data["waste_level"].map(waste_scores)
    risk_score = (
        (10 - data["cleanliness_score"])
        + data["odor_score"]
        + data["waste_score"]
        + (data["complaints"] * 0.3)
        + (data["hours_since_cleaning"] * 0.25)
    )
    data["hygiene_risk"] = risk_score.ge(16).map({True: "High", False: "Low"})

    data.to_csv(OUTPUT_FILE, index=False)
    print(f"Prepared {len(data)} records: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
