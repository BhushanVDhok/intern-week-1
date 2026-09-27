# 10-Day Intern Technical Training & Domain Assessment Program

This repository contains the complete implementation of the **10-Day Intern Technical Training & Domain Assessment Program**. The program progresses from programming fundamentals through Python, data analysis, machine learning, and all major Web Development technologies, concluding with a full-stack capstone project.

---

## Repository Structure

```text
intern-week-1/
├── day-01/   # Programming Fundamentals & Problem Solving (JS, DSA, Employee CLI)
├── day-02/   # Python Development (OOP, JSON persistence, CSV analysis)
├── day-03/   # Data Analysis (Pandas, NumPy, Matplotlib EDA & visualisations)
├── day-04/   # Machine Learning (Scikit-learn classifiers, evaluation, predictions)
├── day-05/   # Modern JavaScript (ES6+, Fetch API, Employee Dashboard)
├── day-06/   # TypeScript + React (Component architecture, hooks, state management)
├── day-07/   # Next.js + Node.js (App Router, Express REST API, dynamic routes)
├── day-08/   # Database + Laravel (PostgreSQL schema, SQL queries, CRUD API)
├── day-09/   # Angular + TypeScript (SPA, RxJS, Reactive Forms, API integration)
├── day-10/   # Final Project — Smart Facility Management System (Web Dev capstone)
└── README.md
```

---

## Technology Stack by Day

| Day | Domain | Technologies |
|-----|--------|-------------|
| Day 1  | Programming Fundamentals | JavaScript (ES6+), Node.js, Linked Lists, DSA |
| Day 2  | Python Development | Python 3, OOP, JSON, CSV, standard library |
| Day 3  | Data Analysis | Pandas, NumPy, Matplotlib, openpyxl |
| Day 4  | Machine Learning | Scikit-learn, Logistic Regression, Decision Tree |
| Day 5  | Modern JavaScript | ES6+ features, Fetch API, Async/Await, localStorage |
| Day 6  | TypeScript + React | React 18, TypeScript, Hooks (useState, useEffect, useMemo) |
| Day 7  | Next.js + Node.js | Next.js 14 App Router, Express.js, axios, dynamic routes |
| Day 8  | Database + Laravel | PostgreSQL 15, Laravel 11, Eloquent ORM, DB transactions |
| Day 9  | Angular + TypeScript | Angular 17, TypeScript strict, RxJS, Reactive Forms |
| Day 10 | **Final Project (Web Dev)** | **PostgreSQL + Node.js/Express REST API + HTML/CSS/JS** |

---

## Quick Execution Guide

### Day 1 — JavaScript Programming Exercises & CLI
```powershell
node day-01/exercises/01-print-numbers.js
node day-01/exercises/15-LL-implementation.js
node day-01/employee-management/index.js
```

### Day 2 — Python Management System & CSV Analysis
```powershell
python day-02/python-exercises/01-evenOdd.py
python day-02/management-system/app.py
python day-02/csv-analysis/analyze_csv.py
```

### Day 3 — Data Analysis & Visualisations
```powershell
cd day-03
python data-cleaning/clean_data.py
python analysis/analyze_data.py
python visualizations/visualize_data.py
```

### Day 4 — Machine Learning Pipeline
```powershell
cd day-04
python -m pip install -r requirements.txt
python preprocessing/prepare_data.py
python models/train_models.py
```

### Day 5 — JavaScript Employee Dashboard
Open `day-05/employee-dashboard/index.html` in a browser, or:
```powershell
cd day-05/employee-dashboard
npm install && npm start
```

### Day 6 — React + TypeScript Application
```powershell
cd day-06/react-app
npm install
npm start
```
Runs at `http://localhost:3000`

### Day 7 — Next.js + Express Full-Stack Application
```powershell
# Terminal 1 — Express API
cd day-07/node-api
npm install && npm start

# Terminal 2 — Next.js App
cd day-07/nextjs-app
npm install && npm run dev
```
API: `http://localhost:3001` | Frontend: `http://localhost:3000`

### Day 8 — PostgreSQL Database & API
```powershell
# Set up PostgreSQL
psql -U postgres -d postgres -f day-08/database/init_postgres.sql

# Option A: Laravel (PHP required)
cd day-08/laravel-api && composer install && php artisan serve --port=8000

# Option B: Node.js runner (no PHP needed)
cd day-08/laravel-api && node postgres_api_runner.js
```
API: `http://localhost:8000/api/facilities`

### Day 9 — Angular Facility Inspection Dashboard
```powershell
# Terminal 1 — API Server
cd day-09/api-integration
npm install && npm start

# Terminal 2 — Angular App
cd day-09/angular-app
npm install && npm start
```
Dashboard: `http://localhost:4200`

### Day 10 — Final Project: Smart Facility Management System
```powershell
# Optional: initialise the PostgreSQL database
psql -U postgres -c "CREATE DATABASE facility_mgmt_db;"
psql -U postgres -d facility_mgmt_db -f day-10/final-project/database/schema.sql
psql -U postgres -d facility_mgmt_db -f day-10/final-project/database/seed.sql

# Terminal 1 — Backend REST API
cd day-10/final-project/backend
npm install && npm start

# Terminal 2 — Frontend Dashboard
cd day-10/final-project/frontend
npm install && npm start
```
API: `http://localhost:5000` | Dashboard: `http://localhost:3000`

Or open `day-10/final-project/frontend/index.html` directly in a browser — the dashboard uses built-in fallback data without requiring a running server.

---

## Daily Submission Checklist

- [x] Day 1: Programming Fundamentals, DSA & Employee CLI
- [x] Day 2: Python Development, JSON Store & CSV Analysis
- [x] Day 3: Data Analysis, Cleaning & Matplotlib Visualisations
- [x] Day 4: Machine Learning Pipelines, Evaluation & Predictions
- [x] Day 5: Modern JavaScript Async API & Employee Dashboard
- [x] Day 6: TypeScript + React Dashboard with Custom Hooks & Types
- [x] Day 7: Next.js App Router Dynamic Pages & Express Backend
- [x] Day 8: PostgreSQL Relational Schema, SQL Queries & Laravel API
- [x] Day 9: Angular Facility Inspection Dashboard, RxJS State & Reactive Forms
- [x] Day 10: Final Project — Smart Facility Management System (Web Development)
- [x] Descriptive README files in every day's folder and at the repository root
