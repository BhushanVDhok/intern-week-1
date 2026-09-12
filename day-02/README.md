# Day 2: Python Development

## Overview

This submission contains a simple JSON-based Employee Management System and two data-analysis scripts. It demonstrates Python basics, functions, lists/dictionaries, file handling, CRUD operations, filtering, sorting, statistics, and exception handling.

## Structure

```text
day-02/
|- management-system/
|  |- app.py
|  `- data.json
|- python-exercises/
|  |- exercise.py
|  `- data.json
`- csv-analysis/
   |- employee_data.csv
```

## Features

- Add, update, delete, search, filter, sort, and list employees.
- Store employee records in a JSON file.
- Calculate total employees, salary statistics, highest-paid employee, and department counts.
- Analyze JSON and CSV data for record count, missing values, duplicates, average/minimum/maximum salary, and department-wise statistics.
- Handle invalid menu choices, invalid numeric input, missing files, invalid JSON, duplicate IDs, and unknown employee IDs.

## Technology

Python 3 standard library only: `json`, `csv`, and `pathlib`.

## Run the programs

Run these commands from the `day-02` folder:

```powershell
python .\management-system\app.py
python .\python-exercises\exercise.py
python .\csv-analysis\employee_data.py
```

## Data design

Every employee has `id`, `name`, `department`, and `salary`. JSON is used by the CLI because a list of dictionaries can be saved directly. CSV is used in the separate analysis exercise to demonstrate tabular-data reading.

## Challenges and solutions

- **Handling incomplete salary data:** One employee record in the practice data has an empty salary. Using that value directly in `sum()`, `min()`, or `max()` would cause an error. The analysis scripts first create a separate list containing only available salaries. The empty value is still counted in the missing-values report, so it is not silently ignored.

- **Avoiding duplicate employee IDs:** An ID is used to find, update, and delete an employee. If two employees had the same ID, those operations could affect the wrong record. Before adding an employee, the program checks the existing records and shows a message if the ID is already present.

- **Keeping file data safe to use:** The app reads from a JSON file every time it starts. A missing file, invalid JSON, or a file with the wrong structure should not make the program stop unexpectedly. The file-reading code uses `try/except` and returns an empty list with a clear error message when it cannot load valid data.

- **Invalid input from the menu:** Values such as employee ID and salary must be numbers, but users can type anything. The input helper catches conversion errors and asks again instead of ending the application. The salary is also checked so that a negative value cannot be saved.

## Future improvements

- Add automated tests to make sure each feature works correctly after future changes.
- Store employee data in a database instead of a JSON file. This will make the app easier to manage as the amount of data grows.
- Create a web API so a website or mobile app can use the employee-management features.
