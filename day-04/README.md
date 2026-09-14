# Day 4: Machine Learning

This project predicts whether a facility has **Low** or **High** hygiene risk.

## Features

- Cleanliness score
- Odor score
- Waste level
- Complaint count
- Footfall
- Hours since cleaning

## Workflow

1. `preprocessing/prepare_data.py` cleans the small dataset, turns waste level into a numeric value, and creates the hygiene-risk label.
2. `models/train_models.py` uses a 75/25 train/test split and compares Logistic Regression with a simple Decision Tree.
3. Results are saved in `evaluation/` and test predictions in `predictions/`.

## Run

```powershell
cd day-04
python -m pip install -r requirements.txt
python .\preprocessing\prepare_data.py
python .\models\train_models.py
```

## Results and selected model

Both models achieved 0.67 accuracy and an F1 score of 0.80 on the three-record test set. Logistic Regression is selected because it tied with the Decision Tree and is simpler to explain.

## Problems encountered

The dataset has only 12 records, and the risk label is rule-based for this demo. This makes the result useful for practice but not reliable for real facility decisions.

## Possible improvements

- Collect more facility inspections.
- Add weather, staff count, and cleaning-frequency data.
- Use real hygiene-risk labels from inspectors instead of a rule-based demo label.
