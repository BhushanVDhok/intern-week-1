import React, { useState, useEffect } from 'react';
import { EmployeeFormProps, EmployeeFormData } from '../types';

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: 0,
    joinDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        department: initialData.department,
        position: initialData.position,
        salary: initialData.salary,
        joinDate: initialData.joinDate,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (formData.salary <= 0) newErrors.salary = 'Salary must be greater than 0';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-body">
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="department">Department *</label>
        <input
          id="department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={errors.department ? 'input-error' : ''}
        />
        {errors.department && <span className="error-text">{errors.department}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="position">Position *</label>
        <input
          id="position"
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className={errors.position ? 'input-error' : ''}
        />
        {errors.position && <span className="error-text">{errors.position}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="salary">Salary *</label>
        <input
          id="salary"
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          min="0"
          className={errors.salary ? 'input-error' : ''}
        />
        {errors.salary && <span className="error-text">{errors.salary}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="joinDate">Join Date *</label>
        <input
          id="joinDate"
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          className={errors.joinDate ? 'input-error' : ''}
        />
        {errors.joinDate && <span className="error-text">{errors.joinDate}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Employee'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
