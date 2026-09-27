-- ====================================================================
-- PostgreSQL Initialization Script for Facility Management System
-- Run this in psql: \i init_postgres.sql or:
-- psql -U postgres -d postgres -f init_postgres.sql
-- ====================================================================

-- 1. Create Database if not exists
SELECT 'CREATE DATABASE facility_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'facility_db')\gexec

\c facility_db;

-- 2. Drop old tables in cascade order if re-initializing
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Create Users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'inspector' CHECK (role IN ('admin', 'manager', 'inspector', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Departments
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    budget DECIMAL(12, 2) DEFAULT 0.00,
    head_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Employees
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL CHECK (salary >= 0),
    join_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Facilities
CREATE TABLE facilities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT DEFAULT 100 CHECK (capacity >= 0),
    status VARCHAR(50) DEFAULT 'Good' CHECK (status IN ('Good', 'Needs Cleaning', 'Under Maintenance', 'Critical')),
    cleanliness_score DECIMAL(3, 1) DEFAULT 8.0 CHECK (cleanliness_score BETWEEN 1.0 AND 10.0),
    odor_score DECIMAL(3, 1) DEFAULT 2.0 CHECK (odor_score BETWEEN 1.0 AND 10.0),
    waste_level VARCHAR(50) DEFAULT 'Low' CHECK (waste_level IN ('Low', 'Medium', 'High')),
    footfall INT DEFAULT 0 CHECK (footfall >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Inspections
CREATE TABLE inspections (
    id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    inspector_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    cleanliness_score INT NOT NULL CHECK (cleanliness_score BETWEEN 1 AND 10),
    odor_score INT NOT NULL CHECK (odor_score BETWEEN 1 AND 10),
    waste_level VARCHAR(50) NOT NULL CHECK (waste_level IN ('Low', 'Medium', 'High')),
    water_available BOOLEAN DEFAULT TRUE,
    notes TEXT,
    inspection_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Complaints
CREATE TABLE complaints (
    id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    complaint_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Dismissed')),
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Performance Indexes
CREATE INDEX idx_emp_dept ON employees(department_id);
CREATE INDEX idx_emp_email ON employees(email);
CREATE INDEX idx_fac_status ON facilities(status);
CREATE INDEX idx_insp_fac ON inspections(facility_id);
CREATE INDEX idx_insp_date ON inspections(inspection_date);
CREATE INDEX idx_comp_fac ON complaints(facility_id);
CREATE INDEX idx_comp_stat ON complaints(status);

-- 10. Seed Data
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Admin Supervisor', 'admin@facility.com', '$2y$10$e8Z4w...', 'admin'),
(2, 'Sarah Inspector', 'sarah@facility.com', '$2y$10$e8Z4w...', 'inspector'),
(3, 'Marcus Tech', 'marcus@facility.com', '$2y$10$e8Z4w...', 'staff'),
(4, 'Elena Vance', 'elena@facility.com', '$2y$10$e8Z4w...', 'manager');

INSERT INTO departments (id, name, code, budget, head_user_id) VALUES
(1, 'Facility Maintenance', 'FM-01', 150000.00, 4),
(2, 'Health & Safety', 'HS-02', 120000.00, 1),
(3, 'Operations & Logistics', 'OP-03', 200000.00, 4),
(4, 'Sanitation Services', 'SS-04', 90000.00, 3);

INSERT INTO employees (id, department_id, name, email, position, salary, join_date, status) VALUES
(1, 1, 'John Smith', 'john.smith@facility.com', 'Senior Technician', 72000.00, '2022-03-15', 'active'),
(2, 1, 'Alice Walker', 'alice.walker@facility.com', 'HVAC Specialist', 68000.00, '2023-01-10', 'active'),
(3, 2, 'David Miller', 'david.miller@facility.com', 'Safety Auditor', 85000.00, '2021-08-01', 'active'),
(4, 2, 'Clara Oswald', 'clara.oswald@facility.com', 'Hygiene Inspector', 64000.00, '2022-11-20', 'active'),
(5, 3, 'Robert Vance', 'robert.vance@facility.com', 'Operations Lead', 94000.00, '2020-05-12', 'active'),
(6, 4, 'Carlos Mendez', 'carlos.mendez@facility.com', 'Sanitation Lead', 58000.00, '2023-04-18', 'active'),
(7, 4, 'Fatima Al-Sayed', 'fatima.sayed@facility.com', 'Sanitation Staff', 46000.00, '2023-09-01', 'active');

INSERT INTO facilities (id, name, location, capacity, status, cleanliness_score, odor_score, waste_level, footfall) VALUES
(1, 'Terminal 1 Restrooms', 'Building A - Concourse 1', 120, 'Good', 8.5, 2.0, 'Low', 1250),
(2, 'Food Court Washrooms', 'Building B - Level 2', 200, 'Needs Cleaning', 4.2, 7.5, 'High', 3400),
(3, 'Central Atrium Restrooms', 'Main Hub - Floor 1', 150, 'Under Maintenance', 6.0, 4.0, 'Medium', 1800),
(4, 'East Wing Restrooms', 'Building C - Floor 3', 80, 'Good', 9.0, 1.5, 'Low', 620),
(5, 'Cargo Bay Washrooms', 'Hangar 4 - Ground', 50, 'Critical', 3.1, 8.8, 'High', 450);

INSERT INTO inspections (id, facility_id, inspector_id, cleanliness_score, odor_score, waste_level, water_available, notes, inspection_date) VALUES
(1, 1, 2, 9, 2, 'Low', TRUE, 'All soap dispensers replenished and clean floors.', '2026-09-20'),
(2, 1, 2, 8, 3, 'Low', TRUE, 'Regular morning audit, good condition.', '2026-09-24'),
(3, 2, 4, 4, 7, 'High', TRUE, 'Heavy footfall overflow, immediate trash clearing required.', '2026-09-22'),
(4, 2, 2, 3, 8, 'High', FALSE, 'Water tap sensor offline, odor high.', '2026-09-25'),
(5, 3, 4, 6, 4, 'Medium', TRUE, 'Tile repair in progress in stall 2.', '2026-09-21'),
(6, 4, 2, 9, 1, 'Low', TRUE, 'Spotless condition.', '2026-09-23'),
(7, 5, 2, 3, 9, 'High', FALSE, 'Drainage backup detected, high odor warning.', '2026-09-25');

INSERT INTO complaints (id, facility_id, complaint_title, description, priority, status, assigned_to) VALUES
(1, 2, 'Trash overflow', 'Trash bin next to entrance overflowing into corridor.', 'High', 'Pending', 3),
(2, 2, 'Soap dispenser broken', 'Dispenser in stall 3 not providing soap.', 'Medium', 'In Progress', 3),
(3, 5, 'Strong sewer odor', 'Persistent odor reported near cargo bay washrooms.', 'Urgent', 'Pending', 1),
(4, 3, 'Leaking flush valve', 'Stall 1 toilet continuously leaking water onto floor.', 'Medium', 'Resolved', 1),
(5, 1, 'Empty paper towels', 'Paper towel roll was empty at 11 AM.', 'Low', 'Resolved', 3);

-- Reset sequence IDs to prevent conflicts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));
SELECT setval('facilities_id_seq', (SELECT MAX(id) FROM facilities));
SELECT setval('inspections_id_seq', (SELECT MAX(id) FROM inspections));
SELECT setval('complaints_id_seq', (SELECT MAX(id) FROM complaints));
