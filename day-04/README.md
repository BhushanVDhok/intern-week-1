# Day 4 — Machine Learning: Hygiene Risk Prediction

## What This Day Covers

Day 4 applies **supervised machine learning** to the cleaned facility hygiene dataset from Day 3. The goal is to train a binary classifier that predicts whether a facility inspection will result in a **High** or **Low** hygiene risk rating, compare two model types, and evaluate them using standard classification metrics.

---

## Objectives

- Prepare a dataset for machine learning: select features, encode categorical columns, create binary target labels
- Split data into training and test sets using a 75/25 ratio
- Train two classification models: Logistic Regression and Decision Tree
- Evaluate both models using accuracy, precision, recall, F1-score, and a confusion matrix
- Save evaluation results and test-set predictions to disk

---

## Folder Structure

```text
day-04/
├── dataset/
│   └── facility_hygiene_ml_dataset.xlsx  # Raw source data (from Day 3)
├── preprocessing/
│   └── prepare_data.py                   # Feature selection, encoding, label creation, train/test split
├── models/
│   └── train_models.py                   # Train Logistic Regression + Decision Tree, evaluate, save results
├── evaluation/
│   ├── logistic_regression_report.txt    # Classification report for Logistic Regression
│   └── decision_tree_report.txt          # Classification report for Decision Tree
├── predictions/
│   └── test_predictions.csv              # Actual vs predicted labels for the test set
├── requirements.txt                      # Python package list
└── README.md
```

---

## Features Used

The following six inspection-level features are used as model inputs:

| Feature | Type | Description |
|---------|------|-------------|
| `cleanliness_score` | Float | Inspector cleanliness rating (1–10) |
| `odor_score` | Float | Odor intensity rating (1–10) |
| `waste_level` | Encoded int | Low=0, Medium=1, High=2 |
| `complaints` | Int | Number of complaints in the period |
| `footfall` | Int | Estimated daily visitor count |
| `hours_since_cleaning` | Float | Time since last cleaning in hours |

---

## Workflow

### Step 1: Preprocessing (`preprocessing/prepare_data.py`)

1. Loads the Excel dataset using Pandas
2. Selects the six features above
3. Encodes `waste_level` from string to integer (ordinal encoding)
4. Creates a binary target label: `hygiene_risk_binary` where `High` = 1, `Low/Medium` = 0
5. Splits into 75% training, 25% test set (`random_state=42` for reproducibility)
6. Saves `X_train`, `X_test`, `y_train`, `y_test` as CSV files for use by the training script

### Step 2: Training & Evaluation (`models/train_models.py`)

1. Loads the prepared train/test splits
2. Trains a **Logistic Regression** model (scikit-learn, `max_iter=200`)
3. Trains a **Decision Tree Classifier** (scikit-learn, `max_depth=5`)
4. For each model, computes: accuracy, precision, recall, F1-score, confusion matrix
5. Saves a text classification report to the `evaluation/` directory
6. Saves actual vs predicted labels to `predictions/test_predictions.csv`

---

## Results

Both models achieved the same accuracy (0.67) and F1-score (0.80) on the 3-record test set.

| Metric | Logistic Regression | Decision Tree |
|--------|---------------------|---------------|
| Accuracy | 0.67 | 0.67 |
| F1-score | 0.80 | 0.80 |

**Selected model:** Logistic Regression — chosen because it ties with the Decision Tree on all metrics and is simpler to interpret and explain.

> **Note:** The dataset used in Day 4 has only 12 records. Results on this size of data are useful for practising the pipeline but are not statistically reliable for real-world decisions.

---

## Requirements

```powershell
pip install -r requirements.txt
# requirements.txt contains: pandas, scikit-learn, openpyxl
```

Python 3.8 or later.

---

## How to Run

```powershell
cd day-04
python -m pip install -r requirements.txt
python .\preprocessing\prepare_data.py
python .\models\train_models.py
```

Outputs appear in `evaluation/` and `predictions/`.

---

## Limitations & Possible Improvements

| Limitation | Improvement |
|------------|-------------|
| Only 12 records — results are not statistically meaningful | Collect a larger dataset of real inspection records |
| Target label is rule-based (derived from `hygiene_risk` column) | Use labels assigned by actual hygiene inspectors |
| No feature normalisation applied | Add `StandardScaler` before Logistic Regression for better convergence |
| No cross-validation | Apply k-fold cross-validation to get a more reliable accuracy estimate |
