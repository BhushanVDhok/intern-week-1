# Day 10 — Final Project: Smart Facility Management System

## What This Day Covers

Day 10 is the **capstone day** of the 10-Day Intern Technical Training program. The task is to build a complete, end-to-end full-stack web application that integrates all Web Development skills practised across Days 5–9:

- **Frontend**: Semantic HTML5 + vanilla CSS + vanilla JavaScript (ES6+) with Fetch API
- **Backend**: Node.js + Express.js REST API with layered architecture (routes, controllers, models)
- **Database**: PostgreSQL with relational schema, FK constraints, transactions, and an analytical view

The domain for this final project is **Web Development only** (no AI/ML).

---

## Project Summary

The application is a **Smart Facility Management Dashboard** for a transit campus (terminals, restrooms, lounges). Facility operators can use it to:

- View live hygiene scores and status across all monitored zones
- Log physical inspection audits; scores are updated atomically in PostgreSQL
- Submit and resolve complaint tickets with priority levels

The frontend includes a full in-memory fallback dataset so the dashboard works without a running database.

---

## Contents

```text
day-10/
└── final-project/          # Complete full-stack application
    ├── frontend/           # HTML5, CSS, Vanilla JS dashboard
    ├── backend/            # Node.js/Express REST API
    ├── database/           # PostgreSQL schema and seed SQL
    └── README.md           # Detailed project documentation
```

See [final-project/README.md](./final-project/README.md) for the full technical documentation, API reference, and step-by-step run instructions.

---

## How to Run (Quick Start)

```powershell
# Terminal 1: Start the API
cd day-10/final-project/backend
npm install
npm start
# API → http://localhost:5000

# Terminal 2: Start the frontend
cd day-10/final-project/frontend
npm install
npm start
# Dashboard → http://localhost:3000
```

Or simply open `day-10/final-project/frontend/index.html` directly in a browser — the dashboard will use built-in sample data.
