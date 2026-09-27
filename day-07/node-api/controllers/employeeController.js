const EmployeeService = require('../services/employeeService');
const ResponseHandler = require('../utils/responseHandler');

class EmployeeController {
  static getAll(req, res) {
    try {
      const filters = {
        search: req.query.search,
        department: req.query.department,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };
      const employees = EmployeeService.getAllEmployees(filters);
      return ResponseHandler.success(res, employees, 'Employees retrieved successfully');
    } catch (err) {
      return ResponseHandler.error(res, err.message, 500);
    }
  }

  static getById(req, res) {
    try {
      const employee = EmployeeService.getEmployeeById(req.params.id);
      if (!employee) {
        return ResponseHandler.error(res, `Employee with ID ${req.params.id} not found`, 404);
      }
      return ResponseHandler.success(res, employee, 'Employee details retrieved');
    } catch (err) {
      return ResponseHandler.error(res, err.message, 500);
    }
  }

  static create(req, res) {
    try {
      const newEmployee = EmployeeService.createEmployee(req.body);
      return ResponseHandler.success(res, newEmployee, 'Employee created successfully', 201);
    } catch (err) {
      return ResponseHandler.error(res, err.message, 400);
    }
  }

  static update(req, res) {
    try {
      const updated = EmployeeService.updateEmployee(req.params.id, req.body);
      if (!updated) {
        return ResponseHandler.error(res, `Employee with ID ${req.params.id} not found`, 404);
      }
      return ResponseHandler.success(res, updated, 'Employee updated successfully');
    } catch (err) {
      return ResponseHandler.error(res, err.message, 400);
    }
  }

  static delete(req, res) {
    try {
      const deleted = EmployeeService.deleteEmployee(req.params.id);
      if (!deleted) {
        return ResponseHandler.error(res, `Employee with ID ${req.params.id} not found`, 404);
      }
      return ResponseHandler.success(res, null, 'Employee deleted successfully');
    } catch (err) {
      return ResponseHandler.error(res, err.message, 500);
    }
  }

  static getStats(req, res) {
    try {
      const stats = EmployeeService.getStatistics();
      return ResponseHandler.success(res, stats, 'Statistics retrieved');
    } catch (err) {
      return ResponseHandler.error(res, err.message, 500);
    }
  }
}

module.exports = EmployeeController;
