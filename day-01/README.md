# Day 1 — Programming Fundamentals & Problem Solving

## What This Day Covers

Day 1 introduces the core building blocks of programming: control flow, data structures, algorithms, and time-complexity analysis. All work is in **JavaScript running on Node.js**.

The day has two deliverables:
1. **15 Programming Exercises** — each solving a well-defined algorithmic or data-structure problem
2. **Employee Management CLI** — an interactive command-line application demonstrating CRUD operations and data aggregation

---

## Objectives

- Practise fundamental programming constructs (loops, conditionals, functions, recursion)
- Apply common data structures: arrays, linked lists
- Implement and compare search and sort algorithms
- Analyse and document time complexity (Big-O notation) for every solution
- Build an interactive CLI application using Node.js standard library
- Use Git for version control and document the implementation

---

## Folder Structure

```text
day-01/
├── exercises/                 # 15 solved programming exercises (one file each)
│   ├── 01-print-numbers.js
│   ├── 02-sum-numbers.js
│   ├── 03-square-pattern.js
│   ├── 04-number-palindrome.js
│   ├── 05-reverse-number.js
│   ├── 06-reverse-array.js
│   ├── 07-find-largest.js
│   ├── 08-count-even-odd.js
│   ├── 09-linear-search.js
│   ├── 10-binary-search.js
│   ├── 11-bubble-sort.js
│   ├── 12-reverse-string.js
│   ├── 13-string-palindrome.js
│   ├── 14-char-frequency.js
│   └── 15-LL-implementation.js
├── employee-management/
│   ├── index.js               # Main CLI application (all logic in one file)
│   └── package.json
├── screenshots/
│   ├── employee-management-cli-add.png
│   └── employee-management-cli-list.png
└── README.md
```

---

## Exercise List with Time Complexity

| # | Exercise | Algorithm / Concept | Time Complexity |
|---|----------|---------------------|-----------------|
| 1 | Print numbers 1 to N | Loop | O(n) |
| 2 | Sum of N numbers | Loop / reduce | O(n) |
| 3 | Square star pattern | Nested loops | O(n²) |
| 4 | Number palindrome | Digit extraction | O(log n) |
| 5 | Reverse a number | Digit extraction | O(log n) |
| 6 | Reverse an array | Two-pointer / slice | O(n) |
| 7 | Find largest element | Linear scan | O(n) |
| 8 | Count even and odd elements | Linear scan | O(n) |
| 9 | Linear search | Sequential search | O(n) |
| 10 | Binary search (sorted array) | Divide and conquer | O(log n) |
| 11 | Bubble sort | Comparison sort | O(n²) |
| 12 | Reverse a string | Array reversal | O(n) |
| 13 | String palindrome check | Two-pointer | O(n) |
| 14 | Character frequency map | Hash map | O(n) |
| 15 | Linked list — implementation & traversal | Pointer traversal | O(n) |

Each source file includes a comment at the top stating its time complexity.

---

## Employee Management CLI

The CLI runs interactively in the terminal. Employee data is stored in memory for the duration of the session (not persisted to disk).

### Supported Operations

- **Add employee** — enter name, department, position, and salary; ID is auto-assigned
- **Update employee** — change any field of an existing record by ID
- **Delete employee** — remove a record by ID
- **Search by ID** — retrieve a specific employee record
- **Search by name** — case-insensitive partial match
- **List all employees** — display all records in a formatted table
- **Filter by department** — show only employees in a chosen department
- **Highest salary** — find and display the top-paid employee
- **Average salary** — compute the mean salary across all employees

### Input Validation

- Name must be a non-empty string
- Salary must be a positive number (non-negative float)
- ID must correspond to an existing record for update/delete/search

### Technology

- JavaScript (ES6+) — no third-party packages
- Node.js built-in `readline/promises` module for interactive prompts
- `console.table()` for formatted tabular output

---

## How to Run

### Prerequisites
- Node.js v18 or later

### Running the exercises
```powershell
# Run any single exercise file, e.g.:
node day-01/exercises/01-print-numbers.js
node day-01/exercises/15-LL-implementation.js
```

### Running the Employee Management CLI
```powershell
cd day-01/employee-management
node index.js
```
Follow the numbered menu printed to the terminal.

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Console output becoming hard to read for employee lists | Used Node's built-in `console.table()` to render objects as a visual table |
| Computing salary aggregates correctly with variable-length lists | Used `Array.prototype.reduce()` for sum and `Array.prototype.filter()` for department grouping |
| Avoiding duplicate IDs when adding employees | Initialised `nextId` to one more than the highest existing ID in the seed data |
