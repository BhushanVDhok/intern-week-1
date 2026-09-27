'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: 0,
    joinDate: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('employees');
    if (stored) {
      const list: Employee[] = JSON.parse(stored);
      const found = list.find((e) => e.id === id);
      if (found) {
        setEmployee(found);
        setFormData({ ...found });
      }
    }
  }, [id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('employees');
    if (stored && employee) {
      const list: Employee[] = JSON.parse(stored);
      const updatedList = list.map((e) => (e.id === id ? { ...formData, id } : e));
      localStorage.setItem('employees', JSON.stringify(updatedList));
      setEmployee({ ...formData, id });
      setIsEditing(false);
      alert('Employee updated successfully!');
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this employee?')) {
      const stored = localStorage.getItem('employees');
      if (stored) {
        const list: Employee[] = JSON.parse(stored);
        const updatedList = list.filter((e) => e.id !== id);
        localStorage.setItem('employees', JSON.stringify(updatedList));
        router.push('/employees');
      }
    }
  };

  if (!employee) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <p>Employee #{id} not found.</p>
        <Link href="/employees" style={{ color: '#2563eb' }}>← Back to Employees</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', fontFamily: 'system-ui, sans-serif', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/employees" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
          ← Back to Employees
        </Link>
        <span style={{ fontSize: '13px', color: '#64748b' }}>Route: /employees/{id}</span>
      </div>

      {!isEditing ? (
        <div>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
              Employee ID #{employee.id}
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0 4px', color: '#0f172a' }}>{employee.name}</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{employee.position} • {employee.department}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
            <div>
              <div style={{ color: '#64748b', marginBottom: '4px' }}>Email Address</div>
              <div style={{ fontWeight: 500, color: '#1e293b' }}>{employee.email}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', marginBottom: '4px' }}>Annual Salary</div>
              <div style={{ fontWeight: 600, color: '#16a34a' }}>${employee.salary.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', marginBottom: '4px' }}>Department</div>
              <div style={{ fontWeight: 500, color: '#1e293b' }}>{employee.department}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', marginBottom: '4px' }}>Join Date</div>
              <div style={{ fontWeight: 500, color: '#1e293b' }}>{employee.joinDate}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{ flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Edit Details
            </button>
            <button
              onClick={handleDelete}
              style={{ padding: '10px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Edit Employee #{employee.id}</h2>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            >
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Salary ($)</label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              style={{ flex: 1, padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{ padding: '10px 16px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
