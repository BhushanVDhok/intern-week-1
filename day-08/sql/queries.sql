-- ====================================================================
-- DAY 8: Practical Assignment SQL Queries
-- Required Queries:
-- 1. Department employees (JOIN + GROUP/FILTER)
-- 2. Average salary per department
-- 3. Highest-paid employee (ORDER BY / Subquery)
-- 4. Poor facilities (Cleanliness < 5 or Critical status)
-- 5. Complaint counts grouped by facility
-- 6. Inspection history with facility details
-- 7. Advanced: Subquery with HAVING clause
-- 8. Advanced: Database Transaction example
-- ====================================================================

-- --------------------------------------------------------------------
-- QUERY 1: Retrieve Department Employees with Department Names
-- Demonstrates: INNER JOIN, Column Aliasing, Sorting
-- --------------------------------------------------------------------
SELECT 
    e.id AS employee_id,
    e.name AS employee_name,
    e.position,
    e.salary,
    d.name AS department_name,
    d.code AS department_code
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.status = 'active'
ORDER BY d.name ASC, e.salary DESC;

-- --------------------------------------------------------------------
-- QUERY 2: Department-wise Employee Count & Average Salary
-- Demonstrates: LEFT JOIN, GROUP BY, Aggregate functions (COUNT, AVG, ROUND)
-- --------------------------------------------------------------------
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    COUNT(e.id) AS total_employees,
    COALESCE(ROUND(AVG(e.salary), 2), 0.00) AS average_salary,
    COALESCE(MIN(e.salary), 0.00) AS min_salary,
    COALESCE(MAX(e.salary), 0.00) AS max_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
ORDER BY average_salary DESC;

-- --------------------------------------------------------------------
-- QUERY 3: Retrieve the Highest-Paid Employee (Using Subquery)
-- Demonstrates: Subquery in WHERE clause, joins
-- --------------------------------------------------------------------
SELECT 
    e.id,
    e.name,
    e.email,
    e.position,
    e.salary,
    d.name AS department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.salary = (SELECT MAX(salary) FROM employees);

-- --------------------------------------------------------------------
-- QUERY 4: Retrieve Poor Condition Facilities (Score < 5 or Critical Status)
-- Demonstrates: WHERE with compound conditions, JOIN with inspections
-- --------------------------------------------------------------------
SELECT 
    f.id AS facility_id,
    f.name AS facility_name,
    f.location,
    f.status,
    f.cleanliness_score,
    f.odor_score,
    f.waste_level,
    COUNT(c.id) AS active_complaints
FROM facilities f
LEFT JOIN complaints c ON f.id = c.facility_id AND c.status != 'Resolved'
WHERE f.cleanliness_score < 5.0 OR f.status IN ('Needs Cleaning', 'Critical')
GROUP BY f.id, f.name, f.location, f.status, f.cleanliness_score, f.odor_score, f.waste_level
ORDER BY f.cleanliness_score ASC;

-- --------------------------------------------------------------------
-- QUERY 5: Complaint Counts Grouped by Facility
-- Demonstrates: LEFT JOIN, GROUP BY, Conditional Aggregation (CASE WHEN)
-- --------------------------------------------------------------------
SELECT 
    f.id AS facility_id,
    f.name AS facility_name,
    COUNT(c.id) AS total_complaints,
    COUNT(CASE WHEN c.status = 'Pending' THEN 1 END) AS pending_complaints,
    COUNT(CASE WHEN c.status = 'In Progress' THEN 1 END) AS in_progress_complaints,
    COUNT(CASE WHEN c.status = 'Resolved' THEN 1 END) AS resolved_complaints
FROM facilities f
LEFT JOIN complaints c ON f.id = c.facility_id
GROUP BY f.id, f.name
ORDER BY total_complaints DESC;

-- --------------------------------------------------------------------
-- QUERY 6: Inspection History for Facilities
-- Demonstrates: Multi-table JOIN (facilities, inspections, users), Date Ordering
-- --------------------------------------------------------------------
SELECT 
    i.id AS inspection_id,
    f.name AS facility_name,
    f.location,
    u.name AS inspector_name,
    i.cleanliness_score,
    i.odor_score,
    i.waste_level,
    i.water_available,
    i.inspection_date,
    i.notes
FROM inspections i
INNER JOIN facilities f ON i.facility_id = f.id
LEFT JOIN users u ON i.inspector_id = u.id
ORDER BY i.inspection_date DESC, i.id DESC;

-- --------------------------------------------------------------------
-- QUERY 7: Facilities with More Than 1 Complaint (HAVING Filter)
-- Demonstrates: HAVING clause with aggregation
-- --------------------------------------------------------------------
SELECT 
    f.id,
    f.name,
    COUNT(c.id) AS complaint_count
FROM facilities f
JOIN complaints c ON f.id = c.facility_id
GROUP BY f.id, f.name
HAVING COUNT(c.id) > 1;

-- --------------------------------------------------------------------
-- QUERY 8: SQL Transaction Example (Atomic Facility Status Update + Inspection)
-- Demonstrates: BEGIN TRANSACTION, COMMIT, Data Integrity
-- --------------------------------------------------------------------
BEGIN;

-- Step 1: Insert new audit inspection
INSERT INTO inspections (facility_id, inspector_id, cleanliness_score, odor_score, waste_level, water_available, notes, inspection_date)
VALUES (2, 2, 8, 2, 'Low', TRUE, 'Emergency deep cleaning completed. Odor neutralized.', CURRENT_DATE);

-- Step 2: Update facility score & status atomically
UPDATE facilities 
SET 
    cleanliness_score = 8.0,
    odor_score = 2.0,
    waste_level = 'Low',
    status = 'Good',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 2;

-- Step 3: Commit atomic operations
COMMIT;