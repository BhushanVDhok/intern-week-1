# Day 3: Data Analysis & Python for AI/ML

This small project cleans, analyzes, and visualizes facility-inspection data with pandas, NumPy, and Matplotlib.

## Included work

- A raw facility dataset with missing, duplicate, and invalid data.
- A cleaning script that removes duplicates and fills corrected missing values.
- An analysis script with statistics, a footfall outlier, and three useful insights.
- Five charts: two bar charts, a histogram, a scatter plot, and a pie chart.

## Python setup

Install Python 3 from [python.org](https://www.python.org/downloads/) and select **Add Python to PATH** during installation. Check the version, then install the required libraries:

```powershell
python --version
pip install pandas numpy matplotlib
```

## Run

From `day-03`, run:

```powershell
python .\data-cleaning\clean_data.py
python .\analysis\analyze_data.py
python .\visualizations\visualize_data.py
```

The cleaned data is saved in `dataset/cleaned_facility_data.csv`; chart PNG files are saved in `visualizations/`.

## Findings

1. Dadar has the lowest cleanliness average and the most complaints.
2. High waste-level facilities have worse odor scores and more complaints.
3. F012 is a footfall outlier and may need more frequent cleaning.
