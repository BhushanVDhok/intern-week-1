import React from 'react';
import { Employee } from '../types';

interface EmployeeDetailsProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
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
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="modal-body">
      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Name</span>
          <span className="detail-value">{employee.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email</span>
          <span className="detail-value">{employee.email}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Department</span>
          <span className="detail-value">{employee.department}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Position</span>
          <span className="detail-value">{employee.position}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Salary</span>
          <span className="detail-value">${formatCurrency(employee.salary)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Join Date</span>
          <span className="detail-value">{formatDate(employee.joinDate)}</span>
        </div>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-primary btn-small"
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
    </div>
  );
};

export default EmployeeDetails;
