import csv
from collections import defaultdict
from pathlib import Path

def analyze_employee_csv(file_path):
    path = Path(file_path)
    if not path.exists():
        print(f"File not found: {file_path}")
        return

    print("=" * 55)
    print(f"   CSV ANALYSIS REPORT: {path.name}")
    print("=" * 55)

    records = []
    headers = []
    with open(path, mode="r", encoding="utf-8") as f:
        reader = csv.reader(f)
        try:
            headers = next(reader)
        except StopIteration:
            print("CSV file is empty.")
            return

        for row in reader:
            if not row or all(field.strip() == "" for field in row):
                continue
            records.append(row)

    total_records = len(records)
    print(f"Total Rows (excluding header): {total_records}")

    # Missing values check per column
    missing_counts = {header: 0 for header in headers}
    for row in records:
        for idx, header in enumerate(headers):
            val = row[idx].strip() if idx < len(row) else ""
            if val == "":
                missing_counts[header] += 1

    print("\n--- Missing Values Per Column ---")
    for header, count in missing_counts.items():
        print(f"  - {header}: {count} missing value(s)")

    # Duplicate rows check
    seen = set()
    duplicates = []
    for idx, row in enumerate(records, start=1):
        row_tuple = tuple(field.strip() for field in row)
        if row_tuple in seen:
            duplicates.append((idx, row))
        else:
            seen.add(row_tuple)

    print(f"\n--- Duplicate Rows ---")
    print(f"Total Duplicate Rows: {len(duplicates)}")
    for row_num, dup in duplicates:
        print(f"  Line {row_num + 1}: {dup}")

    # Salary statistics & Department category statistics
    salaries = []
    dept_salaries = defaultdict(list)
    dept_counts = defaultdict(int)

    for row in records:
        if len(row) >= 4:
            dept = row[2].strip() or "Unknown"
            dept_counts[dept] += 1
            salary_str = row[3].strip()
            if salary_str != "":
                try:
                    sal = float(salary_str)
                    salaries.append(sal)
                    dept_salaries[dept].append(sal)
                except ValueError:
                    pass

    print("\n--- Salary Statistics ---")
    if salaries:
        avg_sal = sum(salaries) / len(salaries)
        print(f"  Valid Salary Records: {len(salaries)}")
        print(f"  Minimum Salary: ${min(salaries):,.2f}")
        print(f"  Maximum Salary: ${max(salaries):,.2f}")
        print(f"  Average Salary: ${avg_sal:,.2f}")
    else:
        print("  No valid salary data found.")

    print("\n--- Category-wise (Department) Statistics ---")
    for dept, count in dept_counts.items():
        dept_sal = dept_salaries.get(dept, [])
        if dept_sal:
            dept_avg = sum(dept_sal) / len(dept_sal)
            print(f"  Department: {dept}")
            print(f"    - Headcount: {count}")
            print(f"    - Avg Salary: ${dept_avg:,.2f}")
            print(f"    - Min Salary: ${min(dept_sal):,.2f}")
            print(f"    - Max Salary: ${max(dept_sal):,.2f}")
        else:
            print(f"  Department: {dept} (Headcount: {count}, No valid salaries)")
    print("=" * 55)

if __name__ == "__main__":
    csv_path = Path(__file__).parent / "employee_data.csv"
    analyze_employee_csv(csv_path)
