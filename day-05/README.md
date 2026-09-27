# Day 5 — Modern JavaScript & Employee Dashboard

## What This Day Covers

Day 5 introduces **modern JavaScript (ES6+)** and asynchronous programming concepts. The day covers core language features through standalone exercises and then applies them to build a complete, interactive **Employee Management Dashboard** — a frontend-only web application using vanilla HTML, CSS, and JavaScript with no frameworks.

---

## Objectives

- Understand and apply ES6+ features: `let`/`const`, arrow functions, template literals, destructuring, spread/rest, modules
- Write asynchronous JavaScript using `Promise` and `async/await`
- Use the `Fetch API` to consume external REST APIs
- Build an interactive browser application using DOM manipulation
- Manage client-side state and persist data with `localStorage`
- Create a responsive layout using CSS Flexbox and CSS Grid

---

## Folder Structure

```text
day-05/
├── javascript/
│   ├── exercises/         # JS fundamentals practice files (ES6 features, async/await, Fetch)
│   └── ...
├── employee-dashboard/
│   ├── index.html         # Main dashboard page (semantic HTML5)
│   ├── styles.css         # Responsive CSS (Flexbox + Grid layout)
│   ├── app.js             # All application logic (EmployeeManager class)
│   └── package.json       # Metadata + `npx serve` start script
└── README.md
```

---

## JavaScript Exercises

Topics covered by the standalone exercise scripts:

| Topic | Concepts |
|-------|---------|
| Variable declarations | `let`, `const`, block scoping |
| Arrow functions | Syntax, implicit return, `this` binding |
| Template literals | Multi-line strings, interpolation |
| Destructuring | Array and object destructuring |
| Spread and rest | `...` operator in function calls and array literals |
| Array methods | `map`, `filter`, `reduce`, `find`, `some`, `every` |
| Promises | `new Promise()`, `.then()`, `.catch()`, `Promise.all()` |
| Async/await | `async` functions, `await`, error handling with `try/catch` |
| Fetch API | `fetch()`, consuming a public REST API, parsing JSON |

---

## Employee Management Dashboard

A browser-based single-page application (SPA) that manages employee records entirely in the browser. No backend server is required.

### Features

| Feature | Description |
|---------|-------------|
| Employee list | Displays all employees in a sortable data table |
| Real-time search | Filter by name, email, or department as you type |
| Department filter | Dropdown to show only employees from a selected department |
| Sorting | Sort by name, salary, or join date (ascending/descending) |
| Add employee | Modal form with validation (name, email format, positive salary) |
| Edit employee | Pre-filled modal form to update any field |
| View details | Read-only modal showing all employee information |
| Delete employee | Confirmation dialog before removing a record |
| Statistics | Live total employee count and average salary in the header |
| Data persistence | All changes saved to `localStorage`; survive page refresh |

### Architecture

The application is built around a single `EmployeeManager` class:

| Method | Responsibility |
|--------|---------------|
| `loadData()` | Read from `localStorage` or initialise with sample data |
| `saveData()` | Persist the current employee list to `localStorage` |
| `addEmployee(data)` | Validate and add a new employee record |
| `updateEmployee(id, data)` | Validate and update an existing record |
| `deleteEmployee(id)` | Remove a record by ID |
| `applyFilters()` | Apply search term, department filter, and sort to produce a display list |
| `render()` | Update the DOM table and statistics based on current state |
| `openModal(type)` / `closeModal()` | Show and hide the add/edit/view/delete modals |

### Technology

- **Language**: Vanilla JavaScript (ES6+) — no frameworks or libraries
- **HTML**: HTML5 semantic elements
- **CSS**: Vanilla CSS with Flexbox and CSS Grid
- **Storage**: Browser `localStorage` API

---

## How to Run

### Option A — Open directly in browser (simplest)
```powershell
# Double-click index.html in Windows Explorer, or:
start day-05\employee-dashboard\index.html
```

### Option B — Serve via `npx serve`
```powershell
cd day-05/employee-dashboard
npm install
npm start
```
Open `http://localhost:3000` in your browser.

---

## Key JavaScript Concepts Demonstrated

1. **Class-based OOP in JavaScript** — `EmployeeManager` encapsulates all state and behaviour
2. **DOM manipulation** — `document.getElementById`, `innerHTML`, `addEventListener`
3. **Event delegation** — a single listener on the table handles all row-level button clicks
4. **Array functional methods** — `filter`, `sort`, `reduce` used for search, sorting, and statistics
5. **`localStorage` API** — `JSON.stringify` / `JSON.parse` for client-side data persistence
6. **Form validation** — checking required fields, email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), and positive salary

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Re-rendering the entire table on every state change causes event listeners to be removed | Used event delegation on a parent element so listeners survive DOM re-renders |
| Sorting by different columns while preserving search filter | Applied filter first, then sort on the already-filtered array before rendering |
| Data lost on page refresh | Saved the employee array to `localStorage` on every add, update, and delete |
