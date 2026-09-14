from math import exp
from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "dataset" / "prepared_facility_data.csv"
EVALUATION_DIR = BASE_DIR / "evaluation"
PREDICTIONS_DIR = BASE_DIR / "predictions"
FEATURES = ["cleanliness_score", "odor_score", "waste_score", "complaints", "footfall", "hours_since_cleaning"]


def sigmoid(value):
    return 1 / (1 + exp(-max(min(value, 500), -500)))


def train_logistic_regression(train_features, train_labels):
    means = train_features.mean()
    scales = train_features.std().replace(0, 1)
    values = ((train_features - means) / scales).values.tolist()
    weights = [0.0] * (len(FEATURES) + 1)

    for _ in range(800):
        gradients = [0.0] * len(weights)
        for row, label in zip(values, train_labels):
            probability = sigmoid(weights[0] + sum(weight * value for weight, value in zip(weights[1:], row)))
            error = probability - label
            gradients[0] += error
            for index, value in enumerate(row, start=1):
                gradients[index] += error * value
        for index in range(len(weights)):
            weights[index] -= 0.1 * gradients[index] / len(values)

    def predict(test_features):
        values = ((test_features - means) / scales).values.tolist()
        return [int(sigmoid(weights[0] + sum(weight * value for weight, value in zip(weights[1:], row))) >= 0.5) for row in values]

    return predict


def train_decision_stump(train_features, train_labels):
    best_rule = None
    best_accuracy = -1

    for feature in FEATURES:
        unique_values = sorted(train_features[feature].unique())
        for left, right in zip(unique_values, unique_values[1:]):
            threshold = (left + right) / 2
            for high_if_greater in [True, False]:
                predicted = (train_features[feature] >= threshold).astype(int)
                if not high_if_greater:
                    predicted = 1 - predicted
                accuracy = sum(value == label for value, label in zip(predicted.tolist(), train_labels))
                if accuracy > best_accuracy:
                    best_accuracy = accuracy
                    best_rule = (feature, threshold, high_if_greater)

    def predict(test_features):
        feature, threshold, high_if_greater = best_rule
        predicted = (test_features[feature] >= threshold).astype(int)
        if not high_if_greater:
            predicted = 1 - predicted
        return predicted.tolist()

    return predict


def metrics(actual, predicted):
    true_positive = sum(a == 1 and p == 1 for a, p in zip(actual, predicted))
    false_positive = sum(a == 0 and p == 1 for a, p in zip(actual, predicted))
    false_negative = sum(a == 1 and p == 0 for a, p in zip(actual, predicted))
    true_negative = sum(a == 0 and p == 0 for a, p in zip(actual, predicted))
    precision = true_positive / (true_positive + false_positive) if true_positive + false_positive else 0
    recall = true_positive / (true_positive + false_negative) if true_positive + false_negative else 0
    f1_score = 2 * precision * recall / (precision + recall) if precision + recall else 0
    return {
        "accuracy": round((true_positive + true_negative) / len(actual), 2),
        "precision": round(precision, 2),
        "recall": round(recall, 2),
        "f1_score": round(f1_score, 2),
        "matrix": [[true_negative, false_positive], [false_negative, true_positive]],
    }


def main():
    EVALUATION_DIR.mkdir(exist_ok=True)
    PREDICTIONS_DIR.mkdir(exist_ok=True)
    data = pd.read_csv(DATA_FILE)
    test_data = data.groupby("hygiene_risk", group_keys=False).sample(frac=0.25, random_state=42)
    train_data = data.drop(test_data.index)
    train_features, test_features = train_data[FEATURES], test_data[FEATURES]
    train_labels = (train_data["hygiene_risk"] == "High").astype(int).tolist()
    actual = (test_data["hygiene_risk"] == "High").astype(int).tolist()

    models = {
        "logistic_regression": train_logistic_regression(train_features, train_labels),
        "decision_tree": train_decision_stump(train_features, train_labels),
    }
    results = []
    predictions = test_data[["facility_id", "hygiene_risk"]].rename(columns={"hygiene_risk": "actual_risk"}).copy()

    for name, model in models.items():
        predicted = model(test_features)
        scores = metrics(actual, predicted)
        predictions[f"{name}_prediction"] = ["High" if value else "Low" for value in predicted]
        results.append({"model": name, **{key: scores[key] for key in ["accuracy", "precision", "recall", "f1_score"]}})
        pd.DataFrame(scores["matrix"], index=["actual_low", "actual_high"], columns=["predicted_low", "predicted_high"]).to_csv(
            EVALUATION_DIR / f"{name}_confusion_matrix.csv"
        )

    pd.DataFrame(results).to_csv(EVALUATION_DIR / "model_comparison.csv", index=False)
    predictions.to_csv(PREDICTIONS_DIR / "test_predictions.csv", index=False)
    print("Model comparison saved to evaluation/model_comparison.csv")


if __name__ == "__main__":
    main()
