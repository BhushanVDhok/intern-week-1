
import json
from pathlib import Path

DATA_FILE = Path(__file__).with_name("data.json")


def main():
    try:
        with DATA_FILE.open(encoding="utf-8") as file:
            records = json.load(file)
    except (OSError, json.JSONDecodeError) as error:
        print(f"Could not read JSON data: {error}")
        return

    columns = {key for record in records for key in record}
    missing = {column: sum(record.get(column) in (None, "") for record in records) for column in columns}
    seen = set()
    duplicates = 0
    for record in records:
        signature = tuple(sorted(record.items()))
        if signature in seen:
            duplicates += 1
        seen.add(signature)
    salaries = [record["salary"] for record in records if record.get("salary") is not None]
    departments = {}
    for record in records:
        departments.setdefault(record["department"], []).append(record.get("salary"))

    print("--- JSON Data Analysis Report ---")
    print(f"Record count: {len(records)}")
    print("Missing values:")
    for column, count in missing.items():
        print(f"- {column}: {count}")
    print(f"Duplicate records: {duplicates}")
    print(f"Average salary: {sum(salaries) / len(salaries):.2f}")
    print(f"Minimum salary: {min(salaries):.2f}")
    print(f"Maximum salary: {max(salaries):.2f}")
    print("Category-wise statistics (department):")
    for department, values in departments.items():
        valid = [value for value in values if value is not None]
        average = sum(valid) / len(valid) if valid else 0
        print(f"- {department}: {len(values)} employees, average salary {average:.2f}")


if __name__ == "__main__":
    main()
