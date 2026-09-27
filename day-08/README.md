# Day 8 — Database + Laravel (PostgreSQL & REST API)

## What This Day Covers

Day 8 focuses on **relational database design** with PostgreSQL and **backend API development** with Laravel 11. The system models a Facility Hygiene & Employee Management platform with six interrelated tables, enforces data integrity with constraints and foreign keys, and exposes a structured RESTful API.

---

## Objectives

- Design a normalised relational schema with 6 tables, primary keys, foreign key references, check constraints, and indexes
- Write practical SQL queries: joins, aggregations, GROUP BY, subqueries
- Build a REST API using the Laravel 11 framework (PHP 8.2+)
- Use Laravel's Eloquent ORM to define model relationships (`hasMany`, `belongsTo`)
- Implement DB transactions (`DB::transaction`) for atomic score updates
- Run migrations and seeders to set up the database programmatically
- Alternatively run the same endpoints via a Node.js API runner for environments without PHP

---

## Folder Structure

```text
day-08/
├── sql/
│   ├── schema.sql        # PostgreSQL DDL: 6 tables, check constraints, indexes, views
│   ├── queries.sql       # 10+ practical SQL queries demonstrating joins, aggregations
│   └── seeds.sql         # INSERT statements for test data
├── database/
│   ├── init_postgres.sql # Combined init script with sequence resets for clean re-runs
│   └── setup_database.py # Python script that runs the SQL files via psycopg2
├── laravel-api/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── FacilityController.php     # CRUD endpoints for facilities
│   │   │   ├── InspectionController.php   # Audit logging with DB transaction
│   │   │   └── ComplaintController.php    # Complaint registration and resolution
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Department.php
│   │       ├── Employee.php
│   │       ├── Facility.php
│   │       ├── Inspection.php
│   │       └── Complaint.php
│   ├── database/
│   │   ├── migrations/   # 6 Laravel migration files, one per table
│   │   └── seeders/      # DatabaseSeeder with realistic sample data
│   ├── routes/
│   │   └── api.php       # REST API route definitions
│   ├── .env.example      # PostgreSQL connection template
│   ├── composer.json
│   └── postgres_api_runner.js  # Node.js API server matching all endpoints (no PHP needed)
└── README.md
```

---

## Database Schema (6 Tables)

### Table Relationships

```
users ──< departments (head_user_id)
departments ──< employees (department_id)
users ──< inspections (inspector_id)
users ──< complaints (assigned_to)
facilities ──< inspections (facility_id)
facilities ──< complaints (facility_id)
```

### Table Definitions

| Table | Key Columns | Constraints |
|-------|------------|-------------|
| `users` | `id`, `name`, `email`, `role` | `email` UNIQUE; `role` CHECK IN ('admin','manager','inspector','staff') |
| `departments` | `id`, `name`, `code`, `budget`, `head_user_id` | `code` UNIQUE; FK to `users` ON DELETE SET NULL |
| `employees` | `id`, `department_id`, `name`, `email`, `salary`, `status` | `email` UNIQUE; `salary` CHECK >= 0; FK to `departments` |
| `facilities` | `id`, `name`, `location`, `cleanliness_score`, `odor_score`, `waste_level`, `status` | CHECK constraints on scores (1–10) and status values |
| `inspections` | `id`, `facility_id`, `inspector_id`, `cleanliness_score`, `odor_score` | FK to `facilities` ON DELETE CASCADE |
| `complaints` | `id`, `facility_id`, `complaint_title`, `priority`, `status` | FK to `facilities` ON DELETE CASCADE; CHECK on priority and status |

### Indexes

| Index | Column(s) |
|-------|-----------|
| `idx_employees_department` | `employees.department_id` |
| `idx_inspections_facility` | `inspections.facility_id` |
| `idx_inspections_date` | `inspections.inspection_date` |
| `idx_complaints_facility` | `complaints.facility_id` |
| `idx_complaints_status` | `complaints.status` |

---

## Practical SQL Queries (`queries.sql`)

The queries file demonstrates:

1. List all facilities with their latest cleanliness score
2. Count inspections per facility in the last 30 days
3. Average cleanliness score grouped by facility status
4. Facilities with at least one Urgent complaint
5. Top 3 departments by total employee salary budget
6. All employees with their department names (INNER JOIN)
7. Inspector names with their inspection counts (GROUP BY + HAVING)
8. Facilities with no inspections recorded (LEFT JOIN + IS NULL)
9. Monthly inspection trend (DATE_TRUNC aggregation)
10. Facility overview with active complaints and total inspection counts (subqueries)

---

## REST API Endpoints

### Facilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/facilities` | List all facilities |
| GET | `/api/facilities/{id}` | Get facility with inspections and complaints |
| POST | `/api/facilities` | Create a new facility |
| PUT | `/api/facilities/{id}` | Update facility details |

### Inspections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inspections` | List all inspections (supports `?facility_id=`) |
| POST | `/api/inspections` | Log an inspection — atomically updates facility scores |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/complaints` | List all complaints |
| POST | `/api/complaints` | Register a new complaint |
| PUT | `/api/complaints/{id}` | Update complaint status |

---

## How to Run

### Option A — Laravel (PHP required)
```powershell
# 1. Set up PostgreSQL database
psql -U postgres -d postgres -f day-08/database/init_postgres.sql

# 2. Install and run Laravel
cd day-08/laravel-api
composer install
copy .env.example .env
# Edit .env: set DB_PASSWORD, APP_KEY
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```
API runs at `http://localhost:8000/api/facilities`.

### Option B — Node.js runner (no PHP needed)
```powershell
cd day-08/laravel-api
node postgres_api_runner.js
```
Starts an Express server on port 8000 that implements all the same endpoints.

---

## Key Concepts Demonstrated

1. **Normalised relational schema** — data split across 6 related tables to eliminate redundancy
2. **Foreign key constraints** with `ON DELETE CASCADE` and `ON DELETE SET NULL`
3. **Check constraints** — enforce valid domain values directly in the DB (`salary >= 0`, status check)
4. **Atomic DB transaction** in `InspectionController` — inserting the inspection row and updating the facility score are wrapped in `DB::transaction()` so both succeed or both roll back
5. **Eloquent relationships** — `Facility::hasMany(Inspection::class)`, `Inspection::belongsTo(Facility::class)`
6. **Laravel migrations** — version-controlled, repeatable database schema management
7. **Laravel seeders** — deterministic test data using `DatabaseSeeder`

---

## Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Atomic score update: inserting an inspection must also update the facility | Wrapped both queries in `DB::transaction()` — if the facility update fails, the insertion is rolled back |
| Running and testing the Laravel API without a PHP environment | Wrote `postgres_api_runner.js` — an Express server that implements the same endpoints against the same PostgreSQL database |
| Foreign key violations when seeding in the wrong order | Ordered seeder calls so that referenced tables (`users`, `departments`) are seeded before dependent tables |
