import React, { useState, useEffect, useMemo } from 'react';
import {
  Header,
  SearchFilter,
  EmployeeTable,
  EmployeeForm,
  Modal,
  EmployeeDetails,
} from './components';
import { Employee, EmployeeFormData, SortOption, ModalAction } from './types';
import './App.css';

interface ModalState {
  action: ModalAction;
  employee: Employee | null;
}

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [modal, setModal] = useState<ModalState>({ action: null, employee: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Load data from localStorage or use sample data
  useEffect(() => {
    const stored = localStorage.getItem('employees');
    if (stored) {
      setEmployees(JSON.parse(stored));
    } else {
      setEmployees(getSampleData());
    }
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

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

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !departmentFilter || emp.department === departmentFilter;
      return matchesSearch && matchesDept;
    });

    // Sort
    filtered.sort((a, b) => {
      const [sortBy, sortOrder] = sortOption.split('-') as [
        string,
        'asc' | 'desc'
      ];
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

  // Get unique departments
  const departments = useMemo(() => {
    return [...new Set(employees.map((emp) => emp.department))].sort();
  }, [employees]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const avgSalary =
      total > 0
        ? Math.round(
            employees.reduce((sum, emp) => sum + emp.salary, 0) / total
          )
        : 0;
    return { total, avgSalary };
  }, [employees]);

  // CRUD Operations
  const handleAddEmployee = () => {
    setModal({ action: 'add', employee: null });
  };

  const handleEditEmployee = (employee: Employee) => {
    setModal({ action: 'edit', employee });
  };

  const handleViewDetails = (employee: Employee) => {
    setModal({ action: 'view', employee });
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    if (modal.action === 'add') {
      const newEmployee: Employee = {
        id: Math.max(...employees.map((e) => e.id), 0) + 1,
        ...data,
      };
      setEmployees([...employees, newEmployee]);
      alert('Employee added successfully!');
    } else if (modal.action === 'edit' && modal.employee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === modal.employee!.id ? { id: emp.id, ...data } : emp
        )
      );
      alert('Employee updated successfully!');
    }
    setModal({ action: null, employee: null });
  };

  const handleDeleteClick = (employeeId: number) => {
    setDeleteTargetId(employeeId);
    setShowDeleteConfirm(true);
    setModal({ action: null, employee: null });
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      const employee = employees.find((e) => e.id === deleteTargetId);
      setEmployees(employees.filter((e) => e.id !== deleteTargetId));
      alert(`${employee?.name} has been deleted.`);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="container">
      <Header totalEmployees={stats.total} averageSalary={stats.avgSalary} />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        department={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        departments={departments}
        onAddClick={handleAddEmployee}
      />

      <EmployeeTable
        employees={filteredEmployees}
        onViewDetails={handleViewDetails}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteClick}
      />

      {/* Form Modal */}
      <Modal
        isOpen={modal.action === 'add' || modal.action === 'edit'}
        title={modal.action === 'add' ? 'Add Employee' : 'Edit Employee'}
        onClose={() => setModal({ action: null, employee: null })}
      >
        <EmployeeForm
          initialData={modal.employee}
          onSubmit={handleFormSubmit}
          onCancel={() => setModal({ action: null, employee: null })}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={modal.action === 'view' && modal.employee !== null}
        title="Employee Details"
        onClose={() => setModal({ action: null, employee: null })}
      >
        {modal.employee && (
          <EmployeeDetails
            employee={modal.employee}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteClick}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        title="Confirm Delete"
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
      >
        <div className="modal-body">
          <p>Are you sure you want to delete this employee?</p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeleteTargetId(null);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirmDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
