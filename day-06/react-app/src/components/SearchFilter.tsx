import React from 'react';
import { SearchFilterProps, SortOption } from '../types';

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  department,
  onDepartmentChange,
  sortOption,
  onSortChange,
  departments,
  onAddClick,
}) => {
  return (
    <section className="controls">
      <div className="search-filter-group">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="form-group">
          <select
            className="filter-select"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select
            className="filter-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="salary-asc">Sort by Salary (Low to High)</option>
            <option value="salary-desc">Sort by Salary (High to Low)</option>
            <option value="date-asc">Sort by Join Date (Oldest)</option>
            <option value="date-desc">Sort by Join Date (Newest)</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={onAddClick}>
          + Add Employee
        </button>
      </div>
    </section>
  );
};

export default SearchFilter;
