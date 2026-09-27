-- ====================================================================
-- DAY 10 FINAL PROJECT: Seed Data for PostgreSQL
-- System: Smart Facility Management System
-- ====================================================================

-- 1. Users (facility staff and inspectors)
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'System Administrator', 'admin@facility.com',    '$2y$10$placeholder...', 'admin'),
(2, 'Sarah Jenkins',        'sarah@facility.com',     '$2y$10$placeholder...', 'inspector'),
(3, 'Marcus Cole',          'marcus@facility.com',    '$2y$10$placeholder...', 'staff'),
(4, 'Dr. Aris Thorne',      'aris@facility.com',      '$2y$10$placeholder...', 'manager')
ON CONFLICT (id) DO NOTHING;

-- 2. Departments
INSERT INTO departments (id, name, code, budget, head_user_id) VALUES
(1, 'Facility Operations',          'FAC-01', 250000.00, 4),
(2, 'Hygiene & Quality Assurance',  'HQA-02', 180000.00, 2),
(3, 'Rapid Response Sanitation',    'RRS-03', 140000.00, 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Facilities (monitored hygiene zones)
INSERT INTO facilities (id, name, location, capacity, status, cleanliness_score, odor_score, waste_level, footfall, hours_since_cleaning) VALUES
(1, 'Terminal 1 Main Restrooms',       'Terminal 1 - Central Concourse',   150, 'Good',             8.8, 1.8, 'Low',    1850, 1),
(2, 'Terminal 1 Food Court Washrooms', 'Terminal 1 - Food Plaza Level 2',  220, 'Needs Cleaning',    4.5, 7.2, 'High',   4200, 5),
(3, 'Transit Lounge Washrooms',        'Terminal 2 - Gate B4',             100, 'Good',             9.2, 1.2, 'Low',     780, 2),
(4, 'Ground Transport Restrooms',      'Basement Level - Bus Hub',          80, 'Under Maintenance', 5.8, 4.5, 'Medium', 1950, 4),
(5, 'Cargo & Baggage Bay Washrooms',   'Hangar 3 - Ground Level',           60, 'Critical',         3.2, 8.9, 'High',    610, 8),
(6, 'Executive Lounge Restrooms',      'Terminal 1 - Mezzanine Level',      50, 'Good',             9.6, 1.0, 'Low',     320, 1)
ON CONFLICT (id) DO NOTHING;

-- 4. Inspections (physical audit records)
INSERT INTO inspections (id, facility_id, inspector_id, cleanliness_score, odor_score, waste_level, water_available, notes, inspection_date) VALUES
(1, 1, 2,  9,  2, 'Low',    TRUE,  'Floors dry and spotless. Hand sanitizers fully loaded.', '2026-09-24'),
(2, 1, 2,  8,  2, 'Low',    TRUE,  'Regular shift audit. Minor sink splashes wiped.', '2026-09-26'),
(3, 2, 2,  4,  7, 'High',   TRUE,  'Trash can overflowing into dining passage. Janitorial dispatch required.', '2026-09-25'),
(4, 2, 2,  5,  6, 'Medium', TRUE,  'Mid-day check. High traffic volume.', '2026-09-26'),
(5, 3, 2,  9,  1, 'Low',    TRUE,  'Optimal standard maintained.', '2026-09-25'),
(6, 4, 2,  6,  4, 'Medium', TRUE,  'Stall 3 lock replaced. Floor mopped.', '2026-09-26'),
(7, 5, 2,  3,  9, 'High',   FALSE, 'Drainage backup detected. Odor high. Immediate intervention needed.', '2026-09-26'),
(8, 6, 2, 10,  1, 'Low',    TRUE,  'Premium standard maintained.', '2026-09-26')
ON CONFLICT (id) DO NOTHING;

-- 5. Complaints (incident tickets)
INSERT INTO complaints (id, facility_id, complaint_title, description, priority, status, assigned_to) VALUES
(1, 2, 'Trash bin overflowing',          'Waste receptacle full and trash spilling on floor near sink.', 'High',   'Pending',     3),
(2, 2, 'Hand dryer not functioning',     'Dryer on wall 2 not blowing warm air.',                        'Medium', 'In Progress', 3),
(3, 5, 'Strong sewer odor near entrance','Pungent odor noticeable from 10 meters away.',                 'Urgent', 'Pending',     1),
(4, 4, 'Slippery floor near urinals',    'Water puddle causing slip hazard.',                            'High',   'Resolved',    3),
(5, 1, 'Empty hand lotion dispenser',    'Lotion dispenser was empty during 10 AM visit.',               'Low',    'Resolved',    2)
ON CONFLICT (id) DO NOTHING;

-- Reset auto-increment sequences to avoid PK conflicts when inserting new records
SELECT setval('users_id_seq',        (SELECT MAX(id) FROM users));
SELECT setval('departments_id_seq',  (SELECT MAX(id) FROM departments));
SELECT setval('facilities_id_seq',   (SELECT MAX(id) FROM facilities));
SELECT setval('inspections_id_seq',  (SELECT MAX(id) FROM inspections));
SELECT setval('complaints_id_seq',   (SELECT MAX(id) FROM complaints));
