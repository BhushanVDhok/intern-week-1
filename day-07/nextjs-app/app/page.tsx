'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
}

type ModalAction = 'add' | 'edit' | 'view' | null;

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [modal, setModal] = useState<{action: ModalAction; employee: Employee | null}>({ action: null, employee: null });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: 0,
    joinDate: '',
  });

  // Load employees
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      // Try to load from API, fallback to localStorage
      const stored = localStorage.getItem('employees');
      if (stored) {
        setEmployees(JSON.parse(stored));
      } else {
        setEmployees(getSampleData());
      }
      setError('');
    } catch (err) {
      setError('Failed to load employees');
      setEmployees(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = (): Employee[] => [
    {
      id: 1,
      name: 'John Davis',
      email: 'john.davis@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 120000,
      joinDate: '2022-01-15',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      salary: 95000,
      joinDate: '2021-06-20',
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'Engineering',
      position: 'Developer',
      salary: 85000,
      joinDate: '2022-03-10',
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily.brown@company.com',
      department: 'Human Resources',
      position: 'HR Manager',
      salary: 80000,
      joinDate: '2020-09-05',
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      department: 'Finance',
      position: 'Finance Analyst',
      salary: 75000,
      joinDate: '2021-11-12',
    },
  ];

  // Filter and sort
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !departmentFilter || emp.department === departmentFilter;
      return matchesSearch && matchesDept;
    });

    const [sortBy, sortOrder] = sortOption.split('-') as [string, 'asc' | 'desc'];
    filtered.sort((a, b) => {
      let compareA: any, compareB: any;
      switch (sortBy) {
        case 'name':
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case 'salary':
          compareA = a.salary;
          compareB = b.salary;
          break;
        case 'date':
          compareA = new Date(a.joinDate);
          compareB = new Date(b.joinDate);
          break;
        default:
          return 0;
      }
      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, departmentFilter, sortOption]);

  const departments = useMemo(() => {
    return [...new Set(employees.map((e) => e.department))].sort();
  }, [employees]);

  const stats = useMemo(() => {
    const total = employees.length;
    const avgSalary = total > 0 ? Math.round(employees.reduce((s, e) => s + e.salary, 0) / total) : 0;
    return { total, avgSalary };
  }, [employees]);

  // CRUD operations
  const handleAddEmployee = () => {
    setFormData({ name: '', email: '', department: '', position: '', salary: 0, joinDate: '' });
    setModal({ action: 'add', employee: null });
  };

  const handleEditEmployee = (emp: Employee) => {
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      joinDate: emp.joinDate,
    });
    setModal({ action: 'edit', employee: emp });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal.action === 'add') {
      const newEmp: Employee = {
        id: Math.max(...employees.map(e => e.id), 0) + 1,
        ...formData,
      };
      const updated = [...employees, newEmp];
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
      alert('Employee added successfully!');
    } else if (modal.action === 'edit' && modal.employee) {
      const updated = employees.map(e => e.id === modal.employee!.id ? { id: e.id, ...formData } : e);
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
      alert('Employee updated successfully!');
    }
    setModal({ action: null, employee: null });
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm('Are you sure?')) {
      const updated = employees.filter(e => e.id !== id);
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
      alert('Employee deleted!');
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US').format(val);
  const formatDate = (dateStr: string) => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr));

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>Employee Management Dashboard - Next.js</h1>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-label">Total Employees</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average Salary</span>
            <span className="stat-value">${formatCurrency(stats.avgSalary)}</span>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      {/* Controls */}
      <section className="controls">
        <div className="search-filter-group">
          <div className="form-group">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <select className="filter-select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <select className="filter-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="name-asc">Sort by Name (A-Z)</option>
              <option value="name-desc">Sort by Name (Z-A)</option>
              <option value="salary-asc">Sort by Salary (Low to High)</option>
              <option value="salary-desc">Sort by Salary (High to Low)</option>
              <option value="date-asc">Sort by Join Date (Oldest)</option>
              <option value="date-desc">Sort by Join Date (Newest)</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAddEmployee}>+ Add Employee</button>
        </div>
      </section>

      {/* Table */}
      <section className="employees-section">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr><td colSpan={6} className="empty-state">No employees found</td></tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>${formatCurrency(emp.salary)}</td>
                  <td>{formatDate(emp.joinDate)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary btn-small" onClick={() => setModal({ action: 'view', employee: emp })}>View</button>
                      <button className="btn btn-secondary btn-small" onClick={() => handleEditEmployee(emp)}>Edit</button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDeleteEmployee(emp.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Modals */}
      {(modal.action === 'add' || modal.action === 'edit') && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modal.action === 'add' ? 'Add Employee' : 'Edit Employee'}</h2>
              <button className="close-btn" onClick={() => setModal({ action: null, employee: null })}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input type="text" name="position" value={formData.position} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Salary</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Join Date</label>
                <input type="date" name="joinDate" value={formData.joinDate} onChange={handleFormChange} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal({ action: null, employee: null })}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal.action === 'view' && modal.employee && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Employee Details</h2>
              <button className="close-btn" onClick={() => setModal({ action: null, employee: null })}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Name:</strong> {modal.employee.name}</p>
              <p><strong>Email:</strong> {modal.employee.email}</p>
              <p><strong>Department:</strong> {modal.employee.department}</p>
              <p><strong>Position:</strong> {modal.employee.position}</p>
              <p><strong>Salary:</strong> ${formatCurrency(modal.employee.salary)}</p>
              <p><strong>Join Date:</strong> {formatDate(modal.employee.joinDate)}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn btn-primary btn-small" onClick={() => handleEditEmployee(modal.employee!)}>Edit</button>
                <button className="btn btn-danger btn-small" onClick={() => { handleDeleteEmployee(modal.employee!.id); setModal({action: null, employee: null}); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
