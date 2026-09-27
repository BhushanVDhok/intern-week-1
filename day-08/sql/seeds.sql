-- ====================================================================
-- DAY 8: Seed Data for Testing SQL Queries
-- ====================================================================

-- 1. Users
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Admin Supervisor', 'admin@facility.com', '$2y$10$e8Z4w...', 'admin'),
(2, 'Sarah Inspector', 'sarah@facility.com', '$2y$10$e8Z4w...', 'inspector'),
(3, 'Marcus Tech', 'marcus@facility.com', '$2y$10$e8Z4w...', 'staff'),
(4, 'Elena Vance', 'elena@facility.com', '$2y$10$e8Z4w...', 'manager')
ON CONFLICT (id) DO NOTHING;

-- 2. Departments
INSERT INTO departments (id, name, code, budget, head_user_id) VALUES
(1, 'Facility Maintenance', 'FM-01', 150000.00, 4),
(2, 'Health & Safety', 'HS-02', 120000.00, 1),
(3, 'Operations & Logistics', 'OP-03', 200000.00, 4),
(4, 'Sanitation Services', 'SS-04', 90000.00, 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Employees
INSERT INTO employees (id, department_id, name, email, position, salary, join_date, status) VALUES
(1, 1, 'John Smith', 'john.smith@facility.com', 'Senior Technician', 72000.00, '2022-03-15', 'active'),
(2, 1, 'Alice Walker', 'alice.walker@facility.com', 'HVAC Specialist', 68000.00, '2023-01-10', 'active'),
(3, 2, 'David Miller', 'david.miller@facility.com', 'Safety Auditor', 85000.00, '2021-08-01', 'active'),
(4, 2, 'Clara Oswald', 'clara.oswald@facility.com', 'Hygiene Inspector', 64000.00, '2022-11-20', 'active'),
(5, 3, 'Robert Vance', 'robert.vance@facility.com', 'Operations Lead', 94000.00, '2020-05-12', 'active'),
(6, 4, 'Carlos Mendez', 'carlos.mendez@facility.com', 'Sanitation Lead', 58000.00, '2023-04-18', 'active'),
(7, 4, 'Fatima Al-Sayed', 'fatima.sayed@facility.com', 'Sanitation Staff', 46000.00, '2023-09-01', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Facilities
INSERT INTO facilities (id, name, location, capacity, status, cleanliness_score, odor_score, waste_level, footfall) VALUES
(1, 'Terminal 1 Restrooms', 'Building A - Concourse 1', 120, 'Good', 8.5, 2.0, 'Low', 1250),
(2, 'Food Court Washrooms', 'Building B - Level 2', 200, 'Needs Cleaning', 4.2, 7.5, 'High', 3400),
(3, 'Central Atrium Restrooms', 'Main Hub - Floor 1', 150, 'Under Maintenance', 6.0, 4.0, 'Medium', 1800),
(4, 'East Wing Restrooms', 'Building C - Floor 3', 80, 'Good', 9.0, 1.5, 'Low', 620),
(5, 'Cargo Bay Washrooms', 'Hangar 4 - Ground', 50, 'Critical', 3.1, 8.8, 'High', 450)
ON CONFLICT (id) DO NOTHING;

-- 5. Inspections
INSERT INTO inspections (id, facility_id, inspector_id, cleanliness_score, odor_score, waste_level, water_available, notes, inspection_date) VALUES
(1, 1, 2, 9, 2, 'Low', TRUE, 'All soap dispensers replenished and clean floors.', '2026-09-20'),
(2, 1, 2, 8, 3, 'Low', TRUE, 'Regular morning audit, good condition.', '2026-09-24'),
(3, 2, 4, 4, 7, 'High', TRUE, 'Heavy footfall overflow, immediate trash clearing required.', '2026-09-22'),
(4, 2, 2, 3, 8, 'High', FALSE, 'Water tap sensor offline, odor high.', '2026-09-25'),
(5, 3, 4, 6, 4, 'Medium', TRUE, 'Tile repair in progress in stall 2.', '2026-09-21'),
(6, 4, 2, 9, 1, 'Low', TRUE, 'Spotless condition.', '2026-09-23'),
(7, 5, 2, 3, 9, 'High', FALSE, 'Drainage backup detected, high odor warning.', '2026-09-25')
ON CONFLICT (id) DO NOTHING;

-- 6. Complaints
INSERT INTO complaints (id, facility_id, complaint_title, description, priority, status, assigned_to) VALUES
(1, 2, 'Trash overflow', 'Trash bin next to entrance overflowing into corridor.', 'High', 'Pending', 3),
(2, 2, 'Soap dispenser broken', 'Dispenser in stall 3 not providing soap.', 'Medium', 'In Progress', 3),
(3, 5, 'Strong sewer odor', 'Persistent odor reported near cargo bay washrooms.', 'Urgent', 'Pending', 1),
(4, 3, 'Leaking flush valve', 'Stall 1 toilet continuously leaking water onto floor.', 'Medium', 'Resolved', 1),
(5, 1, 'Empty paper towels', 'Paper towel roll was empty at 11 AM.', 'Low', 'Resolved', 3)
ON CONFLICT (id) DO NOTHING;
