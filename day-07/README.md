# Day 7 — Next.js + Node.js (Full-Stack Application)

## What This Day Covers

Day 7 introduces a full-stack JavaScript architecture: a **Next.js 14 frontend** (App Router, React 18, TypeScript) paired with a separate **Express.js REST API backend** (Node.js). The two processes communicate over HTTP with JSON.

The application is an **Employee Management System** with dynamic routes, server-side-capable pages, and a modular layered API.

---

## Objectives

- Build a Next.js application using the App Router (`app/` directory) with TypeScript
- Implement server-rendered and client-rendered pages using Next.js conventions
- Create dynamic route segments (`/employees/[id]`) for individual employee views
- Build a modular Express REST API with separate route files, controller functions, a service layer, and validation middleware
- Connect the Next.js frontend to the Express API using `axios`
- Handle loading states and API errors gracefully in the UI

---

## Folder Structure

```text
day-07/
├── nextjs-app/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── globals.css             # Global responsive styles
│   │   ├── page.tsx                # Home page — employee list dashboard
│   │   └── employees/
│   │       ├── page.tsx            # /employees — employee list
│   │       ├── create/
│   │       │   └── page.tsx        # /employees/create — add form
│   │       └── [id]/
│   │           └── page.tsx        # /employees/[id] — view/edit individual employee
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
├── node-api/
│   ├── server.js                   # Express app setup, middleware, route mounting
│   ├── src/
│   │   ├── routes/
│   │   │   └── employeeRoutes.js   # Route definitions for /api/employees
│   │   ├── controllers/
│   │   │   └── employeeController.js # Request handlers for each endpoint
│   │   ├── services/
│   │   │   └── employeeService.js  # Business logic, in-memory data store
│   │   ├── middleware/
│   │   │   └── validation.js       # Input validation middleware
│   │   └── models/
│   │       └── employee.js         # Employee model / data structure definition
│   └── package.json
└── README.md
```

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend  | Next.js 14 (App Router), React 18, TypeScript |
| Backend   | Node.js, Express.js 4 |
| HTTP Client | axios |
| Styling   | Vanilla CSS (globals.css) |
| API format | JSON over HTTP |

---

## Backend API (Express) — Port 3001

The Express API is structured in four layers:

```
Request → Routes → Middleware (validation) → Controllers → Services → Response
```

### API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/employees` | List all employees (supports `?department=`, `?search=`) |
| GET    | `/api/employees/:id` | Get a single employee by ID |
| POST   | `/api/employees` | Create a new employee |
| PUT    | `/api/employees/:id` | Update an existing employee |
| DELETE | `/api/employees/:id` | Delete an employee |
| GET    | `/api/health` | Server health check |

### Sample POST /api/employees Payload
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "department": "Engineering",
  "position": "Software Developer",
  "salary": 75000,
  "joinDate": "2024-03-15"
}
```

### Validation Middleware
The validation middleware (`middleware/validation.js`) checks POST and PUT requests:
- `name` — required, non-empty string
- `email` — required, valid email format
- `salary` — required, positive number
- `joinDate` — required, valid date string

Returns `422 Unprocessable Entity` with a descriptive error if validation fails.

---

## Frontend (Next.js) — Port 3000

### Pages and Routes

| URL | Page File | Purpose |
|-----|-----------|---------|
| `/` | `app/page.tsx` | Home — employee stats and table |
| `/employees` | `app/employees/page.tsx` | Full employee management dashboard |
| `/employees/create` | `app/employees/create/page.tsx` | Form to add a new employee |
| `/employees/[id]` | `app/employees/[id]/page.tsx` | View and edit a specific employee |

### Key Next.js Features Used
- **App Router** — all pages use the `app/` directory convention
- **Dynamic segments** — `[id]` in the route path maps to `params.id` in the page component
- **Client components** — pages marked with `'use client'` to enable React hooks and event handlers
- **`useEffect` for data fetching** — API calls made after mount using axios
- **`useRouter`** — programmatic navigation after form submission

---

## How to Run

### Terminal 1: Start the Express API
```powershell
cd day-07/node-api
npm install
npm start
```
API runs at `http://localhost:3001`.

### Terminal 2: Start the Next.js App
```powershell
cd day-07/nextjs-app
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

Visit `http://localhost:3000/employees` to use the dashboard.

---

## Key Concepts Demonstrated

1. **Next.js App Router** — file-system routing using the `app/` directory; `layout.tsx` wraps all pages
2. **Dynamic routes** — `/employees/[id]` — `params.id` is available as a prop in the page component
3. **Layered API architecture** — separating routes, controllers, services, middleware, and models keeps each file focused and testable
4. **Validation middleware** — a reusable Express middleware function intercepts POST/PUT requests before they reach the controller
5. **CORS** — configured on the Express server to allow the Next.js dev server (different port) to make API requests
6. **LocalStorage fallback** — the frontend stores the last fetched employee list in localStorage so it can display data even if the API is briefly unreachable

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| CORS error when Next.js (port 3000) calls Express (port 3001) | Added the `cors` package to Express and configured it to allow the frontend origin |
| Dynamic route `[id]` page needs to fetch data after knowing the ID | Used `useEffect` with `params.id` as a dependency so the fetch runs when the ID is available |
| Form validation errors shown inline per field | Stored a `errors: Record<string, string>` object in state; each input checks `errors[fieldName]` to show its error message |
