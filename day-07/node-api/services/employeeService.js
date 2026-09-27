const EmployeeModel = require('../models/employeeModel');

class EmployeeService {
  static getAllEmployees(filters = {}) {
    let list = EmployeeModel.findAll();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    }

    if (filters.department) {
      list = list.filter(e => e.department.toLowerCase() === filters.department.toLowerCase());
    }

    if (filters.sortBy) {
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      list.sort((a, b) => {
        if (a[filters.sortBy] < b[filters.sortBy]) return -1 * order;
        if (a[filters.sortBy] > b[filters.sortBy]) return 1 * order;
        return 0;
      });
    }

    return list;
  }

  static getEmployeeById(id) {
    return EmployeeModel.findById(id);
  }

  static createEmployee(data) {
    const existing = EmployeeModel.findByEmail(data.email);
    if (existing) {
      throw new Error('An employee with this email already exists');
    }
    return EmployeeModel.create(data);
  }

  static updateEmployee(id, data) {
    if (data.email) {
      const existing = EmployeeModel.findByEmail(data.email);
      if (existing && existing.id !== Number(id)) {
        throw new Error('An employee with this email already exists');
      }
    }
    return EmployeeModel.update(id, data);
  }

  static deleteEmployee(id) {
    return EmployeeModel.delete(id);
  }

  static getStatistics() {
    const all = EmployeeModel.findAll();
    const count = all.length;
    const totalSalary = all.reduce((sum, e) => sum + e.salary, 0);
    const avgSalary = count > 0 ? totalSalary / count : 0;

    const departmentCounts = all.reduce((acc, e) => {
      acc[e.department] = (acc[e.department] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEmployees: count,
      averageSalary: Math.round(avgSalary * 100) / 100,
      departmentBreakdown: departmentCounts
    };
  }
}

module.exports = EmployeeService;
