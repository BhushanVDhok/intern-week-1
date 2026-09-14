from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "dataset" / "cleaned_facility_data.csv"
OUTPUT_DIR = Path(__file__).resolve().parent


def save_plot(filename):
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / filename)
    plt.close()


def main():
    data = pd.read_csv(DATA_FILE)

    data.groupby("location")["cleanliness_score"].mean().plot(kind="bar", color="#4f46e5")
    plt.title("Average Cleanliness by Location")
    plt.ylabel("Cleanliness score")
    save_plot("cleanliness_by_location.png")

    data.groupby("location")["complaints"].sum().plot(kind="bar", color="#dc2626")
    plt.title("Total Complaints by Location")
    plt.ylabel("Complaints")
    save_plot("complaints_by_location.png")

    plt.hist(data["footfall"], bins=5, color="#16a34a", edgecolor="black")
    plt.title("Facility Footfall Distribution")
    plt.xlabel("Footfall")
    plt.ylabel("Number of facilities")
    save_plot("footfall_histogram.png")

    plt.scatter(data["cleanliness_score"], data["complaints"], c=data["odor_score"], cmap="Oranges", s=80)
    plt.colorbar(label="Odor score")
    plt.title("Cleanliness Score vs Complaints")
    plt.xlabel("Cleanliness score")
    plt.ylabel("Complaints")
    save_plot("cleanliness_vs_complaints.png")

    data["waste_level"].value_counts().plot(kind="pie", autopct="%1.0f%%", ylabel="", colors=["#22c55e", "#facc15", "#ef4444"])
    plt.title("Waste Level Distribution")
    save_plot("waste_level_distribution.png")

    print("Saved 5 charts in:", OUTPUT_DIR)


if __name__ == "__main__":
    main()
