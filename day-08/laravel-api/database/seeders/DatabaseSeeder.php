<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Users
        DB::table('users')->insertOrIgnore([
            [
                'id' => 1,
                'name' => 'Admin Supervisor',
                'email' => 'admin@facility.com',
                'password_hash' => Hash::make('password123'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Sarah Inspector',
                'email' => 'sarah@facility.com',
                'password_hash' => Hash::make('password123'),
                'role' => 'inspector',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Marcus Staff',
                'email' => 'marcus@facility.com',
                'password_hash' => Hash::make('password123'),
                'role' => 'staff',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 2. Seed Departments
        DB::table('departments')->insertOrIgnore([
            ['id' => 1, 'name' => 'Facility Maintenance', 'code' => 'FM-01', 'budget' => 150000.00, 'head_user_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Health & Safety', 'code' => 'HS-02', 'budget' => 120000.00, 'head_user_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Sanitation Services', 'code' => 'SS-03', 'budget' => 90000.00, 'head_user_id' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 3. Seed Employees
        DB::table('employees')->insertOrIgnore([
            ['id' => 1, 'department_id' => 1, 'name' => 'John Smith', 'email' => 'john.smith@facility.com', 'position' => 'Senior Technician', 'salary' => 72000.00, 'join_date' => '2022-03-15', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'department_id' => 1, 'name' => 'Alice Walker', 'email' => 'alice.walker@facility.com', 'position' => 'HVAC Specialist', 'salary' => 68000.00, 'join_date' => '2023-01-10', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'department_id' => 2, 'name' => 'David Miller', 'email' => 'david.miller@facility.com', 'position' => 'Safety Auditor', 'salary' => 85000.00, 'join_date' => '2021-08-01', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'department_id' => 3, 'name' => 'Carlos Mendez', 'email' => 'carlos.mendez@facility.com', 'position' => 'Sanitation Lead', 'salary' => 58000.00, 'join_date' => '2023-04-18', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()]
        ]);

        // 4. Seed Facilities
        DB::table('facilities')->insertOrIgnore([
            ['id' => 1, 'name' => 'Terminal 1 Restrooms', 'location' => 'Building A - Concourse 1', 'capacity' => 120, 'status' => 'Good', 'cleanliness_score' => 8.5, 'odor_score' => 2.0, 'waste_level' => 'Low', 'footfall' => 1250, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Food Court Washrooms', 'location' => 'Building B - Level 2', 'capacity' => 200, 'status' => 'Needs Cleaning', 'cleanliness_score' => 4.2, 'odor_score' => 7.5, 'waste_level' => 'High', 'footfall' => 3400, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Central Atrium Restrooms', 'location' => 'Main Hub - Floor 1', 'capacity' => 150, 'status' => 'Under Maintenance', 'cleanliness_score' => 6.0, 'odor_score' => 4.0, 'waste_level' => 'Medium', 'footfall' => 1800, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'East Wing Restrooms', 'location' => 'Building C - Floor 3', 'capacity' => 80, 'status' => 'Good', 'cleanliness_score' => 9.0, 'odor_score' => 1.5, 'waste_level' => 'Low', 'footfall' => 620, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Cargo Bay Washrooms', 'location' => 'Hangar 4 - Ground', 'capacity' => 50, 'status' => 'Critical', 'cleanliness_score' => 3.1, 'odor_score' => 8.8, 'waste_level' => 'High', 'footfall' => 450, 'created_at' => now(), 'updated_at' => now()]
        ]);

        // 5. Seed Inspections
        DB::table('inspections')->insertOrIgnore([
            ['id' => 1, 'facility_id' => 1, 'inspector_id' => 2, 'cleanliness_score' => 9, 'odor_score' => 2, 'waste_level' => 'Low', 'water_available' => true, 'notes' => 'Dispensers filled and clean floors.', 'inspection_date' => '2026-09-20', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'facility_id' => 2, 'inspector_id' => 2, 'cleanliness_score' => 4, 'odor_score' => 7, 'waste_level' => 'High', 'water_available' => true, 'notes' => 'Heavy trash overflow.', 'inspection_date' => '2026-09-22', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'facility_id' => 5, 'inspector_id' => 2, 'cleanliness_score' => 3, 'odor_score' => 9, 'waste_level' => 'High', 'water_available' => false, 'notes' => 'Drainage backup detected.', 'inspection_date' => '2026-09-25', 'created_at' => now(), 'updated_at' => now()]
        ]);

        // 6. Seed Complaints
        DB::table('complaints')->insertOrIgnore([
            ['id' => 1, 'facility_id' => 2, 'complaint_title' => 'Trash overflow', 'description' => 'Trash bin next to entrance overflowing.', 'priority' => 'High', 'status' => 'Pending', 'assigned_to' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'facility_id' => 5, 'complaint_title' => 'Strong sewer odor', 'description' => 'Persistent odor near bay doors.', 'priority' => 'Urgent', 'status' => 'Pending', 'assigned_to' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'facility_id' => 1, 'complaint_title' => 'Empty soap dispenser', 'description' => 'Stall 2 soap dispenser empty.', 'priority' => 'Low', 'status' => 'Resolved', 'assigned_to' => 3, 'created_at' => now(), 'updated_at' => now()]
        ]);
    }
}
