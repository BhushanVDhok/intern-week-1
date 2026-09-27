'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('employees');
      if (stored) {
        setEmployees(JSON.parse(stored));
      } else {
        const sample: Employee[] = [
          { id: 1, name: 'Bruce Wayne', email: 'bruce.wayne@company.com', department: 'Engineering', position: 'Senior Developer', salary: 120000, joinDate: '2022-01-15' },
          { id: 2, name: 'Natasha Romanoff', email: 'natasha.romanoff@company.com', department: 'Marketing', position: 'Marketing Manager', salary: 95000, joinDate: '2021-06-20' },
          { id: 3, name: 'Peter Parker', email: 'peter.parker@company.com', department: 'Engineering', position: 'Developer', salary: 85000, joinDate: '2022-03-10' }
        ];
        setEmployees(sample);
        localStorage.setItem('employees', JSON.stringify(sample));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      const updated = employees.filter((e) => e.id !== id);
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Employees Directory</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Next.js Route: /employees</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/" style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
            ← Dashboard
          </Link>
          <Link href="/employees/create" style={{ padding: '8px 16px', background: '#2563eb', color: '#ffffff', borderRadius: '6px', textDecoration: 'none', fontWeight: 500 }}>
            + Add Employee
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 16px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>Name</th>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px' }}>Position</th>
                <th style={{ padding: '12px 16px' }}>Salary</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>#{emp.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{emp.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{emp.position}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>${emp.salary.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Link href={`/employees/${emp.id}`} style={{ marginRight: '12px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                      View / Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
