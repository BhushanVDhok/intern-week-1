import React from 'react';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ totalEmployees, averageSalary }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <header className="header">
      <h1>Employee Management Dashboard</h1>
      <div className="header-stats">
        <div className="stat">
          <span className="stat-label">Total Employees</span>
          <span className="stat-value">{totalEmployees}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Average Salary</span>
          <span className="stat-value">${formatCurrency(averageSalary)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
