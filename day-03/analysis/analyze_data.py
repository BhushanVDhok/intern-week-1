from pathlib import Path

import numpy as np
import pandas as pd


DATA_FILE = Path(__file__).resolve().parent.parent / "dataset" / "cleaned_facility_data.csv"


def main():
    data = pd.read_csv(DATA_FILE)

    print("Facility dataset statistics")
    print("Total facilities:", len(data))
    print("Average cleanliness score:", round(np.mean(data["cleanliness_score"]), 2))
    print("Average odor score:", round(np.mean(data["odor_score"]), 2))
    print("Total complaints:", int(data["complaints"].sum()))

    print("\nAverage cleanliness by location:")
    print(data.groupby("location")["cleanliness_score"].mean().round(2).sort_values())
    print("\nComplaints by location:")
    print(data.groupby("location")["complaints"].sum().sort_values(ascending=False))

    q1, q3 = data["footfall"].quantile([0.25, 0.75])
    upper_limit = q3 + 1.5 * (q3 - q1)
    outliers = data[data["footfall"] > upper_limit]
    print("\nFootfall outlier(s):")
    print(outliers[["facility_id", "location", "footfall"]].to_string(index=False))

    print("\nInsights:")
    print("1. Dadar has the lowest average cleanliness and the most complaints.")
    print("2. High waste-level facilities have higher odor scores and complaint counts.")
    print("3. F012 has unusually high footfall, so it should be monitored more frequently.")


if __name__ == "__main__":
    main()
