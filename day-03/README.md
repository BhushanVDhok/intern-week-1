# Day 3 — Data Analysis with Python

## What This Day Covers

Day 3 introduces **exploratory data analysis (EDA)** using Python's data science libraries. The work involves cleaning a real-world-style dataset, computing descriptive statistics, identifying patterns, and producing charts that communicate those findings visually.

The dataset is a synthetic **Facility Hygiene Dataset** — 1,000 records of facility inspection measurements. It deliberately contains duplicate rows, out-of-range values, and missing cells to practise data cleaning.

---

## Objectives

- Load and inspect a structured Excel dataset using Pandas
- Identify and handle data quality issues: duplicates, missing values, out-of-range measurements
- Compute descriptive statistics and group-based aggregations
- Produce publication-quality charts using Matplotlib
- Save a clean, analysis-ready CSV for downstream use

---

## Folder Structure

```text
day-03/
├── dataset/
│   ├── facility_hygiene_ml_dataset.xlsx   # Source data (do not modify)
│   └── cleaned_facility_hygiene_data.csv  # Output of clean_data.py (created at runtime)
├── data-cleaning/
│   └── clean_data.py                      # Step 1: data cleaning pipeline
├── analysis/
│   └── analyze_data.py                    # Step 2: descriptive statistics and group analysis
├── visualizations/
│   ├── visualize_data.py                  # Step 3: produce all five charts
│   ├── hygiene_risk_distribution.png
│   ├── risk_score_comparison.png
│   ├── complaints_by_location.png
│   ├── footfall_histogram.png
│   └── cleanliness_vs_waste.png
└── README.md
```

**Run order:** cleaning → analysis → visualisations. The analysis and chart scripts depend on the cleaned CSV produced by the first script.

---

## Dataset Description

The Excel workbook (`facility_hygiene_ml_dataset.xlsx`) has three sheets:

| Sheet | Content |
|-------|---------|
| Facility Hygiene Dataset | 1,000 inspection records used by the scripts |
| Data Dictionary | Column descriptions and data types |
| README | Notes on deliberate data quality issues |

### Columns (12 total)

| Column | Type | Description |
|--------|------|-------------|
| `facility_id` | String | Unique zone identifier |
| `location` | String | Building or terminal name |
| `facility_type` | String | Type of facility (Restroom, Lounge, etc.) |
| `cleanliness_score` | Float | Inspector cleanliness rating (1–10) |
| `odor_score` | Float | Odor intensity rating (1–10) |
| `waste_level` | String | Low / Medium / High |
| `water_availability` | Boolean | Whether water was available |
| `footfall` | Int | Estimated daily visitor count |
| `complaints` | Int | Number of complaints in the period |
| `inspection_date` | Date | Date of the inspection |
| `hours_since_cleaning` | Float | Hours elapsed since last cleaning |
| `hygiene_risk` | String | Low / Medium / High (target label) |

---

## Step 1: Data Cleaning (`clean_data.py`)

| Operation | Detail |
|-----------|--------|
| Duplicate removal | Removes 5 exact duplicate rows |
| Text trimming | Strips leading/trailing whitespace from all string columns |
| Out-of-range check | Flags `cleanliness_score` and `odor_score` values outside 1–10; replaces with NaN |
| Missing value imputation | Numeric columns → column median; `water_availability` → mode |
| Output | Saves 995 cleaned records to `dataset/cleaned_facility_hygiene_data.csv` |

---

## Step 2: Analysis (`analyze_data.py`)

The analysis script reads the cleaned CSV and prints:

- **Overall summary** — total records, column types, missing value counts
- **Per-column statistics** — mean, median, std, min, max for numeric columns
- **Group-based aggregates** — average cleanliness, odor, complaints, and hours by `hygiene_risk` level
- **High-footfall outliers** — zones above the IQR upper fence
- **Location with highest average complaints**

---

## Step 3: Visualisations (`visualize_data.py`)

Five charts are saved to the `visualizations/` folder:

| File | Chart Type | What It Shows |
|------|-----------|---------------|
| `hygiene_risk_distribution.png` | Bar chart | Count of Low, Medium, High risk records |
| `risk_score_comparison.png` | Grouped bar chart | Average cleanliness and odor scores by risk level |
| `complaints_by_location.png` | Horizontal bar chart | Average complaints per inspection by location |
| `footfall_histogram.png` | Histogram | Distribution of daily footfall across all facilities |
| `cleanliness_vs_waste.png` | Scatter plot (colour-coded) | Cleanliness score vs waste level, coloured by hygiene risk |

---

## Requirements

```powershell
pip install pandas numpy matplotlib openpyxl
```

Python 3.8 or later.

---

## How to Run

```powershell
# From the day-03 directory:
python .\data-cleaning\clean_data.py
python .\analysis\analyze_data.py
python .\visualizations\visualize_data.py
```

Run the cleaning script first; the other two depend on its output file.

---

## Key Findings

Calculated from the cleaned dataset at analysis time:

- High-risk facilities have noticeably **lower cleanliness scores** and **higher odor scores** than Low-risk facilities
- `waste_level = 'High'` is strongly associated with higher complaint counts
- Some locations consistently appear as outliers for high-footfall and high-complaint rates
- The IQR method flags a small number of facilities with unusually high daily footfall
