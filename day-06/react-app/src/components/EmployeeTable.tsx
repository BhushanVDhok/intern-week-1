import React from 'react';
import { EmployeeTableProps } from '../types';

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (employees.length === 0) {
    return (
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
            <tr className="empty-state">
              <td colSpan={6}>No employees found</td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }

  return (
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
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>${formatCurrency(employee.salary)}</td>
              <td>{formatDate(employee.joinDate)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => onViewDetails(employee)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => onDelete(employee.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EmployeeTable;
