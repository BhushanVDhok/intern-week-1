# Day 2 — Python Development

## What This Day Covers

Day 2 focuses on **Python programming** through three deliverables:

1. **Python Exercises** — 9 standalone scripts covering Python fundamentals
2. **Employee Management System** — a menu-driven CLI application with JSON persistence and OOP design
3. **CSV Data Analysis** — a script that reads, validates, and summarises employee data from a CSV file

---

## Objectives

- Write Python programs using core language features: conditionals, loops, functions, list comprehensions, lambda expressions
- Apply object-oriented programming: classes, methods, encapsulation
- Handle file I/O and data persistence using JSON
- Parse and analyse structured data from CSV files using the standard library
- Handle exceptions and edge cases gracefully (invalid input, missing files, division by zero)

---

## Folder Structure

```text
day-02/
├── python-exercises/
│   ├── 01-evenOdd.py          # Check if a number is even or odd
│   ├── 02-largestNum.py       # Find the largest number in a list
│   ├── 03-countVowels.py      # Count vowels in a string
│   ├── 04-removeDupli.py      # Remove duplicate elements from a list
│   ├── 05-commonEl.py         # Find common elements between two lists
│   ├── 06-frequency_string.py # Character frequency map for a string
│   ├── 07-filterEven.py       # Filter even numbers using a lambda expression
│   ├── 08-calculator.py       # Basic calculator with divide-by-zero handling
│   └── 09-student_class.py    # Simple Student class with grade methods
├── management-system/
│   ├── app.py                 # Interactive CLI Employee Management System
│   └── data.json              # JSON data store (modified by the app at runtime)
├── csv-analysis/
│   ├── employee_data.csv      # Sample employee CSV dataset
│   └── analyze_csv.py         # Analysis script (reads CSV, prints summary report)
└── README.md
```

---

## Python Exercises

Each exercise is a standalone script. Topics covered:

| File | Topic |
|------|-------|
| `01-evenOdd.py` | Modulo operator, conditionals |
| `02-largestNum.py` | Built-in `max()`, manual comparison |
| `03-countVowels.py` | String iteration, counting |
| `04-removeDupli.py` | Sets, list comprehension |
| `05-commonEl.py` | Set intersection |
| `06-frequency_string.py` | Dictionary as a hash map |
| `07-filterEven.py` | `filter()` with a lambda expression |
| `08-calculator.py` | Functions, exception handling (`ZeroDivisionError`) |
| `09-student_class.py` | Class definition, instance methods, `__init__` |

### How to Run
```powershell
# From the day-02 directory:
python .\python-exercises\01-evenOdd.py
python .\python-exercises\08-calculator.py
```

---

## Employee Management System

`management-system/app.py` is a fully interactive CLI application that stores employee records in `data.json`.

### Data Model
Each employee record has: `id`, `name`, `department`, `salary`.

### Supported Operations
- **List all employees** — prints all records in a readable format
- **Add employee** — prompts for name, department, salary; auto-assigns an ID; saves to JSON
- **Update employee** — modify any field of an existing record by ID
- **Delete employee** — remove a record by ID
- **Search by name** — case-insensitive partial match
- **Search by ID** — exact match lookup
- **Filter by department** — show employees from a specific department
- **Sort by name or salary** — ascending order
- **Statistics** — total count, salary min/max/average, highest-paid employee, department breakdown

### Error Handling
- Missing or corrupted `data.json` initialises an empty store
- Duplicate IDs are rejected
- Invalid IDs for update/delete produce a clear error message
- Non-numeric salary input is caught and re-prompted

### How to Run
```powershell
python .\management-system\app.py
```
Changes are saved to `management-system/data.json` automatically.

---

## CSV Analysis

`csv-analysis/analyze_csv.py` reads `employee_data.csv` using Python's built-in `csv` module (no Pandas required).

### What the Script Reports
1. Total number of records in the file
2. Missing values — which columns have empty cells and how many
3. Duplicate rows — count and list of exact duplicate records
4. Salary statistics — minimum, maximum, average
5. Per-department summary — record count and average salary for each department

### How to Run
```powershell
python .\csv-analysis\analyze_csv.py
```

---

## Requirements

No third-party packages are required. Only the Python 3 standard library is used (`json`, `pathlib`, `csv`, `os`).

```powershell
python --version   # Python 3.8 or later recommended
```

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| `data.json` missing or empty on first run | Wrapped file reading in a `try/except` block; initialised to an empty list if the file is missing or invalid |
| Preventing invalid salary values (negative, non-numeric) | Used a `while` loop with `try/except ValueError` to re-prompt until a valid positive number is entered |
| Detecting duplicate rows in CSV | Compared each row tuple against a `set` of previously seen rows while parsing |
