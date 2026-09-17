# Day 2: Python Development

This folder contains a menu-driven Employee Management System, nine standalone Python practice exercises, and a sample employee CSV file.

## Project structure

```text
day-02/
├── management-system/
│   ├── app.py                 # interactive JSON-based employee manager
│   └── data.json              # employee records used by the app
├── python-exercises/
│   ├── 01-evenOdd.py
│   ├── 02-largestNum.py
│   ├── 03-countVowels.py
│   ├── 04-removeDupli.py
│   ├── 05-commonEl.py
│   ├── 06-frequency_string.py
│   ├── 07-filterEven.py
│   ├── 08-calculator.py
│   └── 09-student_class.py
└── csv-analysis/
    └── employee_data.csv      # sample CSV; no analysis script is included
```

## Employee Management System

`management-system/app.py` uses Python's standard library (`json` and `pathlib`) and stores employee records in `data.json`. Each employee has an ID, name, department, and salary.

Available menu actions:

- List, add, update, and delete employees.
- Search by employee name or ID.
- Filter by department.
- Sort by name or salary.
- Display employee count, salary statistics, highest-paid employee, and department counts.

The app handles missing or invalid JSON files, duplicate IDs, unknown IDs, invalid menu selections, invalid numeric input, and negative salaries.

Run it from `day-02`:

```powershell
python .\management-system\app.py
```

The app changes `management-system/data.json` when an employee is added, updated, or deleted.

## Python exercises

Run any exercise from `day-02` by using its actual filename, for example:

```powershell
python .\python-exercises\01-evenOdd.py
python .\python-exercises\08-calculator.py
```

The exercises cover even/odd checking, largest-number search, vowel counting, duplicate removal, common list elements, character frequency, lambda filtering, a calculator with divide-by-zero handling, and a simple `Student` class.

## CSV sample

`csv-analysis/employee_data.csv` is a small practice dataset with employee ID, name, department, and salary fields. It contains an empty salary field and a duplicate row, but this repository does not currently include a CSV-analysis program.

## Requirements

Python 3 is the only requirement. No third-party packages are needed.

```powershell
python --version
```
