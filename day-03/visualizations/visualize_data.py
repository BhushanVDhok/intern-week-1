"""Create charts from the cleaned facility-hygiene dataset."""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "dataset" / "cleaned_facility_hygiene_data.csv"
OUTPUT_DIR = Path(__file__).resolve().parent
RISK_ORDER = ["Low", "Medium", "High"]
RISK_COLORS = {"Low": "#22c55e", "Medium": "#f59e0b", "High": "#dc2626"}


def save_plot(filename):
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / filename, dpi=150)
    plt.close()


def main():
    data = pd.read_csv(DATA_FILE)
    risk_counts = data["hygiene_risk"].value_counts().reindex(RISK_ORDER, fill_value=0)
    risk_counts.plot(kind="bar", color=[RISK_COLORS[risk] for risk in RISK_ORDER])
    plt.title("Inspection Records by Hygiene Risk")
    plt.xlabel("Hygiene risk")
    plt.ylabel("Number of records")
    plt.xticks(rotation=0)
    save_plot("hygiene_risk_distribution.png")

    risk_means = data.groupby("hygiene_risk")[["cleanliness_score", "odor_score"]].mean().reindex(RISK_ORDER)
    risk_means.plot(kind="bar", color=["#2563eb", "#9333ea"])
    plt.title("Average Cleanliness and Odor by Hygiene Risk")
    plt.xlabel("Hygiene risk")
    plt.ylabel("Average score")
    plt.xticks(rotation=0)
    save_plot("risk_score_comparison.png")

    data.groupby("location")["complaints"].mean().sort_values(ascending=False).plot(kind="bar", color="#dc2626")
    plt.title("Average Complaints by Location")
    plt.xlabel("Location")
    plt.ylabel("Average complaints per inspection")
    plt.xticks(rotation=35, ha="right")
    save_plot("complaints_by_location.png")

    plt.hist(data["footfall"], bins=20, color="#16a34a", edgecolor="black")
    plt.title("Facility Footfall Distribution")
    plt.xlabel("Footfall")
    plt.ylabel("Number of inspection records")
    save_plot("footfall_histogram.png")

    for risk in RISK_ORDER:
        subset = data[data["hygiene_risk"] == risk]
        plt.scatter(subset["cleanliness_score"], subset["waste_level"], label=risk, color=RISK_COLORS[risk], alpha=0.65, s=28)
    plt.title("Cleanliness Score vs Waste Level")
    plt.xlabel("Cleanliness score")
    plt.ylabel("Waste level (%)")
    plt.legend(title="Hygiene risk")
    save_plot("cleanliness_vs_waste.png")
    print("Saved 5 charts in:", OUTPUT_DIR)


if __name__ == "__main__":
    main()
