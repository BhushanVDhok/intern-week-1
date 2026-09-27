-- ====================================================================
-- DAY 8: Relational Database Schema
-- System: Smart Facility Management & Employee System
-- Compatible with PostgreSQL and MySQL
-- ====================================================================

-- 1. USERS TABLE (Authentication & Role Management)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'inspector' CHECK (role IN ('admin', 'manager', 'inspector', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS TABLE (Organizational Units)
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    budget DECIMAL(12, 2) DEFAULT 0.00,
    head_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. EMPLOYEES TABLE (Staff Directory)
CREATE TABLE IF NOT EXISTS employees (
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

-- 4. FACILITIES TABLE (Monitored Locations)
CREATE TABLE IF NOT EXISTS facilities (
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

-- 5. INSPECTIONS TABLE (Audit Records)
CREATE TABLE IF NOT EXISTS inspections (
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

-- 6. COMPLAINTS TABLE (User & Staff Feedback)
CREATE TABLE IF NOT EXISTS complaints (
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

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_facilities_status ON facilities(status);
CREATE INDEX IF NOT EXISTS idx_inspections_facility ON inspections(facility_id);
CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_complaints_facility ON complaints(facility_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);

-- ====================================================================
-- VIEWS FOR AGGREGATED REPORTING
-- ====================================================================
CREATE OR REPLACE VIEW view_department_summary AS
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    d.budget,
    COUNT(e.id) AS total_employees,
    COALESCE(ROUND(AVG(e.salary), 2), 0.00) AS average_salary,
    COALESCE(MAX(e.salary), 0.00) AS highest_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name, d.budget;

CREATE OR REPLACE VIEW view_facility_hygiene_summary AS
SELECT 
    f.id AS facility_id,
    f.name AS facility_name,
    f.location,
    f.status,
    COUNT(DISTINCT i.id) AS total_inspections,
    COALESCE(ROUND(AVG(i.cleanliness_score), 1), f.cleanliness_score) AS avg_cleanliness,
    COUNT(DISTINCT c.id) AS total_complaints,
    COUNT(DISTINCT CASE WHEN c.status = 'Pending' THEN c.id END) AS pending_complaints
FROM facilities f
LEFT JOIN inspections i ON f.id = i.facility_id
LEFT JOIN complaints c ON f.id = c.facility_id
GROUP BY f.id, f.name, f.location, f.status, f.cleanliness_score;