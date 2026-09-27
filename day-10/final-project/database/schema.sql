-- ====================================================================
-- DAY 10 FINAL PROJECT: PostgreSQL Database Schema
-- System: Smart Facility Management System
-- Tables: users, departments, facilities, inspections, complaints
-- ====================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  DEFAULT 'inspector' CHECK (role IN ('admin', 'manager', 'inspector', 'staff')),
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    code         VARCHAR(50)  UNIQUE NOT NULL,
    budget       DECIMAL(12, 2) DEFAULT 0.00,
    head_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 3. FACILITIES TABLE
CREATE TABLE IF NOT EXISTS facilities (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    location            VARCHAR(255) NOT NULL,
    capacity            INT          DEFAULT 100  CHECK (capacity >= 0),
    status              VARCHAR(50)  DEFAULT 'Good'
                            CHECK (status IN ('Good', 'Needs Cleaning', 'Under Maintenance', 'Critical')),
    cleanliness_score   DECIMAL(3, 1) DEFAULT 8.0 CHECK (cleanliness_score BETWEEN 1.0 AND 10.0),
    odor_score          DECIMAL(3, 1) DEFAULT 2.0 CHECK (odor_score BETWEEN 1.0 AND 10.0),
    waste_level         VARCHAR(50)  DEFAULT 'Low' CHECK (waste_level IN ('Low', 'Medium', 'High')),
    footfall            INT          DEFAULT 0 CHECK (footfall >= 0),
    hours_since_cleaning INT         DEFAULT 2 CHECK (hours_since_cleaning >= 0),
    created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 4. INSPECTIONS TABLE (Audit Records)
-- Submission of an inspection atomically updates the parent facility's scores.
CREATE TABLE IF NOT EXISTS inspections (
    id                BIGSERIAL PRIMARY KEY,
    facility_id       BIGINT NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    inspector_id      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    cleanliness_score INT    NOT NULL CHECK (cleanliness_score BETWEEN 1 AND 10),
    odor_score        INT    NOT NULL CHECK (odor_score BETWEEN 1 AND 10),
    waste_level       VARCHAR(50) NOT NULL CHECK (waste_level IN ('Low', 'Medium', 'High')),
    water_available   BOOLEAN     DEFAULT TRUE,
    notes             TEXT,
    inspection_date   DATE        NOT NULL,
    created_at        TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

-- 5. COMPLAINTS TABLE (Incident Tickets)
CREATE TABLE IF NOT EXISTS complaints (
    id               BIGSERIAL PRIMARY KEY,
    facility_id      BIGINT NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    complaint_title  VARCHAR(255) NOT NULL,
    description      TEXT         NOT NULL,
    priority         VARCHAR(50)  DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status           VARCHAR(50)  DEFAULT 'Pending'
                         CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Dismissed')),
    assigned_to      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_facilities_status       ON facilities(status);
CREATE INDEX IF NOT EXISTS idx_inspections_facility    ON inspections(facility_id);
CREATE INDEX IF NOT EXISTS idx_inspections_date        ON inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_complaints_facility     ON complaints(facility_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status       ON complaints(status);

-- ====================================================================
-- ANALYTICAL VIEW
-- Summarises each facility with live inspection and complaint counts.
-- ====================================================================
CREATE OR REPLACE VIEW view_facility_overview AS
SELECT
    f.id,
    f.name,
    f.location,
    f.status,
    f.cleanliness_score,
    f.odor_score,
    f.waste_level,
    f.footfall,
    f.hours_since_cleaning,
    COUNT(DISTINCT c.id) FILTER (WHERE c.status != 'Resolved') AS active_complaints,
    COUNT(DISTINCT i.id)                                        AS total_inspections
FROM facilities f
LEFT JOIN complaints  c ON f.id = c.facility_id
LEFT JOIN inspections i ON f.id = i.facility_id
GROUP BY f.id, f.name, f.location, f.status,
         f.cleanliness_score, f.odor_score, f.waste_level,
         f.footfall, f.hours_since_cleaning;
