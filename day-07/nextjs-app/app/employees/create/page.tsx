'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    position: '',
    salary: '',
    joinDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.position.trim()) errs.position = 'Position is required';
    if (!formData.salary || Number(formData.salary) <= 0) errs.salary = 'Positive salary is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const stored = localStorage.getItem('employees');
    const list = stored ? JSON.parse(stored) : [];
    const newId = list.length > 0 ? Math.max(...list.map((item: any) => item.id)) + 1 : 1;

    const newEmp = {
      id: newId,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      position: formData.position,
      salary: Number(formData.salary),
      joinDate: formData.joinDate
    };

    list.push(newEmp);
    localStorage.setItem('employees', JSON.stringify(list));
    alert('Employee successfully created!');
    router.push('/employees');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', fontFamily: 'system-ui, sans-serif', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/employees" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
          ← Back to Employees
        </Link>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '10px', color: '#0f172a' }}>Add New Employee</h1>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Route: /employees/create</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Jane Doe"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
          {errors.name && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.name}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. jane.doe@company.com"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
          {errors.email && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          >
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>Position</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="e.g. Software Engineer"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
          {errors.position && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.position}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>Salary ($)</label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="e.g. 75000"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            {errors.salary && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.salary}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>Join Date</label>
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{ marginTop: '12px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
        >
          Create Employee
        </button>
      </form>
    </div>
  );
}
