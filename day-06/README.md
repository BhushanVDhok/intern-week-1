# Day 6 — TypeScript + React

## What This Day Covers

Day 6 introduces **TypeScript** and **React** as a pair. TypeScript exercises focus on the type system, and the main project is a component-based **Employee Management Dashboard** rebuilt in React with full TypeScript support.

The goal is to experience how TypeScript enforces type safety across component props, state, and event handlers, and how React's component model and hooks provide a structured way to manage UI state.

---

## Objectives

- Understand TypeScript's type system: primitive types, interfaces, type aliases, generics, enums, union types
- Add type annotations to functions, parameters, return values, and objects
- Create a React application with TypeScript using Create React App
- Structure a UI into small, reusable components with clearly typed props
- Manage application state using React hooks: `useState`, `useEffect`, `useMemo`
- Implement a modal dialog pattern for add, edit, view, and delete operations
- Persist data in `localStorage`

---

## Folder Structure

```text
day-06/
├── typescript/
│   └── exercises/         # Standalone TypeScript practice files
├── react-app/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx          # Title bar with employee stats
│   │   │   ├── SearchFilter.tsx    # Search input, department dropdown, sort, add button
│   │   │   ├── EmployeeTable.tsx   # Data table with action buttons per row
│   │   │   ├── EmployeeForm.tsx    # Reusable form for add and edit
│   │   │   ├── EmployeeDetails.tsx # Read-only employee detail view
│   │   │   ├── Modal.tsx           # Reusable modal wrapper component
│   │   │   └── index.ts            # Re-exports all components
│   │   ├── App.tsx                 # Root component: state management and modal orchestration
│   │   ├── App.css                 # Global responsive styles
│   │   ├── types.ts                # TypeScript interfaces: Employee, FilterState, SortConfig
│   │   ├── index.tsx               # React DOM entry point
│   │   └── index.css
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## TypeScript Exercises

Topics covered by the standalone `.ts` exercise files:

| Topic | What Practised |
|-------|---------------|
| Primitive types | `string`, `number`, `boolean` annotations |
| Interfaces | Defining object shapes (`Employee`, `Department`) |
| Type aliases | `type ID = number`, union types (`string | null`) |
| Generics | `function identity<T>(arg: T): T`, typed arrays |
| Enums | `enum Status { Active, Inactive }` |
| Optional and readonly | `?` properties, `readonly` fields |
| Type narrowing | `typeof`, `instanceof`, `in` guards |
| Function types | Typed parameters, return types, overloads |

---

## React Application: Employee Management Dashboard

The React app is a refactoring of the Day 5 vanilla JS dashboard into a properly structured, type-safe component tree.

### TypeScript Interfaces (`types.ts`)

```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

interface FilterState {
  searchTerm: string;
  department: string;
  sortBy: 'name' | 'salary' | 'joinDate';
  sortOrder: 'asc' | 'desc';
}
```

### Component Responsibilities

| Component | Props | Purpose |
|-----------|-------|---------|
| `Header` | `employees: Employee[]` | Displays title, total count, and average salary |
| `SearchFilter` | `filters`, `onFilterChange`, `onAddClick` | Controls for search, department filter, sort, and add button |
| `EmployeeTable` | `employees`, `onView`, `onEdit`, `onDelete` | Renders the employee data table with action buttons |
| `EmployeeForm` | `employee?`, `onSave`, `onCancel` | Reusable form for both add (no employee) and edit (pre-filled) |
| `EmployeeDetails` | `employee`, `onClose` | Read-only view of all employee fields |
| `Modal` | `isOpen`, `title`, `onClose`, `children` | Wrapper component handling open/close state and backdrop |

### State Management in `App.tsx`

| State | Hook | Purpose |
|-------|------|---------|
| `employees` | `useState<Employee[]>` | The master list of all employee records |
| `filters` | `useState<FilterState>` | Current search, filter, and sort configuration |
| `modalType` | `useState<string | null>` | Which modal is currently open |
| `selectedEmployee` | `useState<Employee | null>` | Employee being viewed, edited, or deleted |
| `filteredEmployees` | `useMemo` | Derived list after applying current filters and sort |

### Features

- Full CRUD: add, edit, view details, delete (with confirmation)
- Real-time search by name, email, or department
- Department dropdown filter
- Column sort (name, salary, join date) with asc/desc toggle
- Client-side form validation with typed error messages
- `localStorage` persistence — data survives page refresh

---

## How to Run

```powershell
cd day-06/react-app
npm install
npm start
```

Opens at `http://localhost:3000`.

---

## Key Concepts Demonstrated

1. **TypeScript interfaces** define the shape of all data flowing between components; no `any` types used
2. **Props typing** — every component declares its props interface; TypeScript catches missing or wrong-type props at compile time
3. **`useState` with generics** — `useState<Employee[]>([])` makes the type of state explicit
4. **`useMemo` for derived state** — the filtered/sorted employee list is recomputed only when `employees` or `filters` change
5. **Controlled components** — all form inputs use `value` + `onChange` so React owns the input state
6. **Reusable `Modal` wrapper** — a single modal component handles all four use cases (add, edit, view, delete) via `children` prop

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Form component needing to handle both add (no initial data) and edit (pre-filled data) | Made the `employee` prop optional (`employee?: Employee`); the form checks for it to decide add vs edit mode |
| Recalculating the filtered list on every keystroke causing unnecessary work | Wrapped the filter/sort logic in `useMemo` with `[employees, filters]` as dependencies |
| TypeScript errors when accessing properties on a potentially-null selected employee | Used optional chaining (`selectedEmployee?.name`) and non-null assertions where the modal is only shown when the value is set |
