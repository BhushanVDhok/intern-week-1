# Day 3: Facility Hygiene Data Analysis

This project cleans, analyses, and visualises the supplied **synthetic Facility Hygiene ML Dataset**. It uses the workbook in `dataset/facility_hygiene_ml_dataset.xlsx`; it does not use the earlier CSV dataset.

## Dataset

The supplied Excel workbook has three sheets:

- **Facility Hygiene Dataset** — 1,000 facility-inspection records used by the scripts.
- **Data Dictionary** — field descriptions and suggested ML roles.
- **README** — notes that the dataset is synthetic and includes deliberate cleaning practice issues.

The analysis sheet contains 12 columns: `facility_id`, `location`, `facility_type`, `cleanliness_score`, `odor_score`, `waste_level`, `water_availability`, `footfall`, `complaints`, `inspection_date`, `hours_since_cleaning`, and `hygiene_risk`. `hygiene_risk` has the values Low, Medium, and High.

Important: this is generated training data, not real facility measurements.

## Cleaning performed

`data-cleaning/clean_data.py` removes the 5 exact duplicate rows, trims text fields, checks expected numeric ranges, replaces invalid values with missing values, fills numeric missing values with each column's median, and fills missing water availability with its most common value. It saves 995 cleaned records to `dataset/cleaned_facility_hygiene_data.csv`.

## Requirements

Install Python 3, then install the packages needed for Excel input, analysis, and charts:

```powershell
python --version
pip install pandas numpy matplotlib openpyxl
```

## Run

From the `day-03` directory, run:

```powershell
python .\data-cleaning\clean_data.py
python .\analysis\analyze_data.py
python .\visualizations\visualize_data.py
```

Run the cleaning script first because the analysis and visualisation scripts use the cleaned CSV it creates.

## Outputs

- `dataset/cleaned_facility_hygiene_data.csv` — cleaned analysis-ready data.
- `visualizations/hygiene_risk_distribution.png` — count of Low, Medium, and High risk records.
- `visualizations/risk_score_comparison.png` — average cleanliness and odor scores by risk level.
- `visualizations/complaints_by_location.png` — average complaints per inspection by location.
- `visualizations/footfall_histogram.png` — facility footfall distribution.
- `visualizations/cleanliness_vs_waste.png` — cleanliness versus waste level, coloured by risk.

## Key findings

The analysis is calculated from the cleaned file every time it runs. In the supplied data, high-risk records have lower average cleanliness and higher odor, waste, complaint, and time-since-cleaning values than low-risk records. The output also identifies the location with the highest average complaints and reports high-footfall outliers using the IQR method.
