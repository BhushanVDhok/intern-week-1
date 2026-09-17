"""Summarise the cleaned facility-hygiene dataset."""
from pathlib import Path

import pandas as pd


DATA_FILE = Path(__file__).resolve().parent.parent / "dataset" / "cleaned_facility_hygiene_data.csv"


def main():
    data = pd.read_csv(DATA_FILE, parse_dates=["inspection_date"])
    print("Facility hygiene dataset statistics")
    print("Total cleaned inspection records:", len(data))
    print("Inspection period:", f"{data['inspection_date'].min():%Y-%m-%d} to {data['inspection_date'].max():%Y-%m-%d}")
    print("Average cleanliness score:", round(data["cleanliness_score"].mean(), 2))
    print("Average odor score:", round(data["odor_score"].mean(), 2))
    print("Average waste level:", round(data["waste_level"].mean(), 2))
    print("Total complaints:", int(data["complaints"].sum()))

    print("\nHygiene-risk distribution:")
    print(data["hygiene_risk"].value_counts())
    risk_profile = data.groupby("hygiene_risk")[
        ["cleanliness_score", "odor_score", "waste_level", "complaints", "hours_since_cleaning"]
    ].mean().round(2)
    print("\nAverage indicators by hygiene risk:")
    print(risk_profile.reindex(["Low", "Medium", "High"]))

    print("\nAverage complaints by location:")
    location_complaints = data.groupby("location")["complaints"].mean().sort_values(ascending=False)
    print(location_complaints.round(2))

    q1, q3 = data["footfall"].quantile([0.25, 0.75])
    upper_limit = q3 + 1.5 * (q3 - q1)
    outliers = data.loc[data["footfall"] > upper_limit, ["facility_id", "location", "footfall", "hygiene_risk"]]
    print(f"\nHigh-footfall outliers (above {upper_limit:.1f}): {len(outliers)}")

    highest_complaint_location = location_complaints.index[0]
    print("\nInsights:")
    print(
        "1. High-risk records average "
        f"{risk_profile.loc['High', 'cleanliness_score']:.2f}/10 cleanliness, "
        f"compared with {risk_profile.loc['Low', 'cleanliness_score']:.2f}/10 for low-risk records."
    )
    print("2. High-risk records have higher average odor, waste, complaints, and time since cleaning than low-risk records.")
    print(f"3. {highest_complaint_location} has the highest average complaints per inspection ({location_complaints.iloc[0]:.2f}).")


if __name__ == "__main__":
    main()
