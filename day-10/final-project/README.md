# Day 10 — Final Project: Smart Facility Management System

## Overview

Day 10 is the capstone of the 10-Day Intern Technical Training program. The goal is to integrate the Web Development skills practised across Days 5 through 9 into a single, end-to-end full-stack web application.

The project is a **Smart Facility Management System** — a web dashboard used by facility operators to monitor hygiene conditions across multiple zones, log physical inspection audits, and track complaint tickets. It demonstrates:

- A relational PostgreSQL database with referential integrity and a DB transaction for atomic score updates
- A modular Node.js/Express REST API with controllers, routes, and a DB connection pool
- A responsive frontend built with semantic HTML5, vanilla CSS, and ES6+ JavaScript that consumes the API

The frontend includes an in-memory fallback dataset so the dashboard can be demoed without a running PostgreSQL server.

---

## Project Structure

```text
day-10/final-project/
├── frontend/
│   ├── index.html        # Semantic HTML5 dashboard (4-tab SPA layout)
│   ├── styles.css        # Clean, responsive CSS design system
│   ├── app.js            # Vanilla JS: tab navigation, Fetch API calls, DOM rendering
│   └── package.json      # Serves frontend via npx serve
├── backend/
│   ├── server.js         # Express app: middleware, route mounting, error handlers
│   ├── .env.example      # Environment variable template (DB credentials, PORT)
│   ├── package.json      # Dependencies: express, pg, cors, dotenv
│   └── src/
│       ├── models/
│       │   └── db.js                    # pg connection pool with connectivity check
│       ├── controllers/
│       │   ├── facilityController.js    # CRUD + stats endpoint; in-memory fallback
│       │   ├── inspectionController.js  # Audit logging with atomic DB transaction
│       │   └── complaintController.js   # Complaint creation and status update
│       └── routes/
│           ├── facilityRoutes.js        # GET /facilities, POST /facilities, GET /facilities/stats
│           ├── inspectionRoutes.js      # GET /inspections, POST /inspections
│           └── complaintRoutes.js       # GET /complaints, POST /complaints, PUT /complaints/:id
└── database/
    ├── schema.sql         # DDL: 5 tables, check constraints, foreign keys, indexes, view
    └── seed.sql           # INSERT seed data for 6 facilities, users, inspections, complaints
```

---

## Technology Stack

| Layer    | Technology                             |
|----------|----------------------------------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend  | Node.js 18+, Express.js 4             |
| Database | PostgreSQL 15+ (`pg` connection pool)  |

No frontend frameworks, no AI/ML libraries.

---

## Database Design

Five tables with referential integrity and check constraints:

### `facilities`
| Column              | Type         | Notes                                           |
|---------------------|--------------|-------------------------------------------------|
| `id`                | BIGSERIAL PK |                                                 |
| `name`              | VARCHAR      |                                                 |
| `location`          | VARCHAR      |                                                 |
| `capacity`          | INT          | CHECK >= 0                                      |
| `status`            | VARCHAR      | CHECK IN ('Good', 'Needs Cleaning', 'Under Maintenance', 'Critical') |
| `cleanliness_score` | DECIMAL(3,1) | CHECK BETWEEN 1.0 AND 10.0                      |
| `odor_score`        | DECIMAL(3,1) | CHECK BETWEEN 1.0 AND 10.0                      |
| `waste_level`       | VARCHAR      | CHECK IN ('Low', 'Medium', 'High')              |
| `footfall`          | INT          |                                                 |
| `hours_since_cleaning` | INT      |                                                 |

### `inspections`
Linked to `facilities` via FK with `ON DELETE CASCADE`. Each POST to `/api/inspections` runs inside a `BEGIN...COMMIT` transaction that inserts the audit record **and** updates the parent facility's scores atomically.

### `complaints`
Linked to `facilities` via FK. Supports priority levels (`Low`, `Medium`, `High`, `Urgent`) and status lifecycle (`Pending` → `In Progress` → `Resolved`).

Also includes `users` and `departments` tables for role-based ownership.

**Analytical view:** `view_facility_overview` — returns each facility with live `active_complaints` and `total_inspections` counts.

---

## REST API Endpoints

| Method | Endpoint                  | Description                                         |
|--------|---------------------------|-----------------------------------------------------|
| GET    | `/api/health`             | Server and DB connectivity health check             |
| GET    | `/api/facilities`         | List all facilities with inspection/complaint counts |
| GET    | `/api/facilities/stats`   | KPI aggregates (avg cleanliness, critical count)    |
| POST   | `/api/facilities`         | Create a new facility zone                          |
| GET    | `/api/inspections`        | List audits; supports `?facility_id=` filter        |
| POST   | `/api/inspections`        | Log a new inspection; updates facility atomically   |
| GET    | `/api/complaints`         | List complaints; supports `?facility_id=` filter    |
| POST   | `/api/complaints`         | Register a new complaint ticket                     |
| PUT    | `/api/complaints/:id`     | Update complaint status (Pending / In Progress / Resolved) |

### Sample POST /api/inspections payload
```json
{
  "facility_id": 2,
  "cleanliness_score": 4,
  "odor_score": 7,
  "waste_level": "High",
  "water_available": true,
  "notes": "Trash can overflowing near sinks."
}
```

---

## How to Run

### Prerequisites
- Node.js v18+
- PostgreSQL 15+ (optional — dashboard works without it via in-memory fallback)

### 1. Set up the Database (optional)
```powershell
psql -U postgres -c "CREATE DATABASE facility_mgmt_db;"
psql -U postgres -d facility_mgmt_db -f day-10/final-project/database/schema.sql
psql -U postgres -d facility_mgmt_db -f day-10/final-project/database/seed.sql
```

### 2. Start the Backend API
```powershell
cd day-10/final-project/backend
copy .env.example .env
# Edit .env and set DB_PASSWORD to your PostgreSQL password
npm install
npm start
```
API will be available at `http://localhost:5000`.

### 3. Start the Frontend
```powershell
cd day-10/final-project/frontend
npm install
npm start
```
Open `http://localhost:3000` in your browser.

Alternatively, open `index.html` directly in a browser — the dashboard will operate using fallback in-memory data.

---

## Dashboard Features

The frontend is a single-page application with 4 tabs:

| Tab | What It Does |
|-----|-------------|
| **Dashboard** | KPI cards (total facilities, average cleanliness, critical zones, open complaints) plus a zone overview table |
| **Facilities** | Full table of all monitored facilities with scores, status badges, and a quick "Log Inspection" button |
| **Log Inspection** | Form to submit a physical audit (cleanliness score, odor score, waste level, water availability, notes). On submit, facility scores update immediately in the UI and are sent to the API. |
| **Complaints** | Left: form to register a new complaint ticket with priority. Right: active complaint queue with one-click resolve. |

---

## Key Technical Concepts Demonstrated

1. **PostgreSQL relational schema** with foreign keys, check constraints, composite indexes, and an analytical view.
2. **Atomic database transactions** (`BEGIN`/`COMMIT`/`ROLLBACK`) in `inspectionController.js` to ensure that logging an inspection and updating the facility score either both succeed or both fail.
3. **Layered Express API** — routes, controllers, and a shared DB model are separate concerns.
4. **Fetch API with error handling** — the frontend tries the live API and silently falls back to in-memory data so the UI is always functional.
5. **DOM manipulation with vanilla JavaScript** — no framework; data is rendered into the DOM using template literals.
6. **Responsive CSS** — CSS Grid and media queries for a layout that works on desktop and tablet screens.
7. **Graceful degradation** — the system works with or without a running PostgreSQL server.

---

## Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Keeping facility scores in sync after an audit | Used a PostgreSQL transaction (`BEGIN…COMMIT`) to atomically insert the inspection row and run the `UPDATE facilities SET ...` in one operation. |
| Demoing without PostgreSQL installed | Built an in-memory fallback store in every controller so the API and frontend work end-to-end even without a DB connection. |
| Frontend state consistency after form submit | After every form submission, local state is updated immediately before re-rendering the relevant table and metrics, so there is no need to re-fetch from the API. |
