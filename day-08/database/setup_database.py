import sqlite3
from pathlib import Path

def init_sqlite_db():
    db_path = Path(__file__).parent / "facility_management.sqlite"
    if db_path.exists():
        db_path.unlink() # Fresh setup

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Foreign key support
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. Users
    cursor.execute("""
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'inspector' CHECK (role IN ('admin', 'manager', 'inspector', 'staff')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Departments
    cursor.execute("""
    CREATE TABLE departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        budget REAL DEFAULT 0.00,
        head_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. Employees
    cursor.execute("""
    CREATE TABLE employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        position TEXT NOT NULL,
        salary REAL NOT NULL CHECK (salary >= 0),
        join_date TEXT NOT NULL,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. Facilities
    cursor.execute("""
    CREATE TABLE facilities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        capacity INTEGER DEFAULT 100,
        status TEXT DEFAULT 'Good' CHECK (status IN ('Good', 'Needs Cleaning', 'Under Maintenance', 'Critical')),
        cleanliness_score REAL DEFAULT 8.0,
        odor_score REAL DEFAULT 2.0,
        waste_level TEXT DEFAULT 'Low' CHECK (waste_level IN ('Low', 'Medium', 'High')),
        footfall INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 5. Inspections
    cursor.execute("""
    CREATE TABLE inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
        inspector_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        cleanliness_score INTEGER NOT NULL CHECK (cleanliness_score BETWEEN 1 AND 10),
        odor_score INTEGER NOT NULL CHECK (odor_score BETWEEN 1 AND 10),
        waste_level TEXT NOT NULL,
        water_available INTEGER DEFAULT 1,
        notes TEXT,
        inspection_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 6. Complaints
    cursor.execute("""
    CREATE TABLE complaints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
        complaint_title TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
        status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Dismissed')),
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Seed Data
    cursor.executemany("""
    INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)
    """, [
        (1, 'Admin Supervisor', 'admin@facility.com', '$2y$10$...', 'admin'),
        (2, 'Sarah Inspector', 'sarah@facility.com', '$2y$10$...', 'inspector'),
        (3, 'Marcus Tech', 'marcus@facility.com', '$2y$10$...', 'staff'),
        (4, 'Elena Vance', 'elena@facility.com', '$2y$10$...', 'manager')
    ])

    cursor.executemany("""
    INSERT INTO departments (id, name, code, budget, head_user_id) VALUES (?, ?, ?, ?, ?)
    """, [
        (1, 'Facility Maintenance', 'FM-01', 150000.0, 4),
        (2, 'Health & Safety', 'HS-02', 120000.0, 1),
        (3, 'Operations & Logistics', 'OP-03', 200000.0, 4),
        (4, 'Sanitation Services', 'SS-04', 90000.0, 3)
    ])

    cursor.executemany("""
    INSERT INTO employees (id, department_id, name, email, position, salary, join_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, [
        (1, 1, 'John Smith', 'john.smith@facility.com', 'Senior Technician', 72000.0, '2022-03-15', 'active'),
        (2, 1, 'Alice Walker', 'alice.walker@facility.com', 'HVAC Specialist', 68000.0, '2023-01-10', 'active'),
        (3, 2, 'David Miller', 'david.miller@facility.com', 'Safety Auditor', 85000.0, '2021-08-01', 'active'),
        (4, 2, 'Clara Oswald', 'clara.oswald@facility.com', 'Hygiene Inspector', 64000.0, '2022-11-20', 'active'),
        (5, 3, 'Robert Vance', 'robert.vance@facility.com', 'Operations Lead', 94000.0, '2020-05-12', 'active'),
        (6, 4, 'Carlos Mendez', 'carlos.mendez@facility.com', 'Sanitation Lead', 58000.0, '2023-04-18', 'active'),
        (7, 4, 'Fatima Al-Sayed', 'fatima.sayed@facility.com', 'Sanitation Staff', 46000.0, '2023-09-01', 'active')
    ])

    cursor.executemany("""
    INSERT INTO facilities (id, name, location, capacity, status, cleanliness_score, odor_score, waste_level, footfall) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [
        (1, 'Terminal 1 Restrooms', 'Building A - Concourse 1', 120, 'Good', 8.5, 2.0, 'Low', 1250),
        (2, 'Food Court Washrooms', 'Building B - Level 2', 200, 'Needs Cleaning', 4.2, 7.5, 'High', 3400),
        (3, 'Central Atrium Restrooms', 'Main Hub - Floor 1', 150, 'Under Maintenance', 6.0, 4.0, 'Medium', 1800),
        (4, 'East Wing Restrooms', 'Building C - Floor 3', 80, 'Good', 9.0, 1.5, 'Low', 620),
        (5, 'Cargo Bay Washrooms', 'Hangar 4 - Ground', 50, 'Critical', 3.1, 8.8, 'High', 450)
    ])

    cursor.executemany("""
    INSERT INTO inspections (id, facility_id, inspector_id, cleanliness_score, odor_score, waste_level, water_available, notes, inspection_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [
        (1, 1, 2, 9, 2, 'Low', 1, 'All soap dispensers replenished and clean floors.', '2026-09-20'),
        (2, 1, 2, 8, 3, 'Low', 1, 'Regular morning audit, good condition.', '2026-09-24'),
        (3, 2, 4, 4, 7, 'High', 1, 'Heavy footfall overflow, immediate trash clearing required.', '2026-09-22'),
        (4, 2, 2, 3, 8, 'High', 0, 'Water tap sensor offline, odor high.', '2026-09-25'),
        (5, 3, 4, 6, 4, 'Medium', 1, 'Tile repair in progress in stall 2.', '2026-09-21'),
        (6, 4, 2, 9, 1, 'Low', 1, 'Spotless condition.', '2026-09-23'),
        (7, 5, 2, 3, 9, 'High', 0, 'Drainage backup detected, high odor warning.', '2026-09-25')
    ])

    cursor.executemany("""
    INSERT INTO complaints (id, facility_id, complaint_title, description, priority, status, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, [
        (1, 2, 'Trash overflow', 'Trash bin next to entrance overflowing into corridor.', 'High', 'Pending', 3),
        (2, 2, 'Soap dispenser broken', 'Dispenser in stall 3 not providing soap.', 'Medium', 'In Progress', 3),
        (3, 5, 'Strong sewer odor', 'Persistent odor reported near cargo bay washrooms.', 'Urgent', 'Pending', 1),
        (4, 3, 'Leaking flush valve', 'Stall 1 toilet continuously leaking water onto floor.', 'Medium', 'Resolved', 1),
        (5, 1, 'Empty paper towels', 'Paper towel roll was empty at 11 AM.', 'Low', 'Resolved', 3)
    ])

    conn.commit()
    print("✓ SQLite database initialized successfully at:", db_path)

    # Run and display test queries
    print("\n--- TEST QUERY 1: Department-wise Average Salary ---")
    cursor.execute("""
    SELECT d.name, COUNT(e.id), ROUND(AVG(e.salary), 2)
    FROM departments d
    LEFT JOIN employees e ON d.id = e.department_id
    GROUP BY d.id, d.name;
    """)
    for row in cursor.fetchall():
        print(f"Department: {row[0]:<25} | Staff: {row[1]} | Avg Salary: ${row[2]:,.2f}")

    print("\n--- TEST QUERY 2: Poor Facilities (Cleanliness < 5 or Critical) ---")
    cursor.execute("""
    SELECT f.name, f.location, f.status, f.cleanliness_score
    FROM facilities f
    WHERE f.cleanliness_score < 5.0 OR f.status IN ('Needs Cleaning', 'Critical');
    """)
    for row in cursor.fetchall():
        print(f"Facility: {row[0]:<25} | Status: {row[2]:<15} | Score: {row[3]}")

    print("\n--- TEST QUERY 3: Highest-Paid Employee ---")
    cursor.execute("""
    SELECT e.name, e.position, e.salary, d.name
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    WHERE e.salary = (SELECT MAX(salary) FROM employees);
    """)
    row = cursor.fetchone()
    print(f"Name: {row[0]} | Position: {row[1]} | Salary: ${row[2]:,.2f} | Dept: {row[3]}")

    conn.close()

if __name__ == "__main__":
    init_sqlite_db()
