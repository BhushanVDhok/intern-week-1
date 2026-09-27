const ResponseHandler = require('../utils/responseHandler');

const validateEmployee = (req, res, next) => {
  const { name, email, department, position, salary } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a valid non-empty string');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!department || typeof department !== 'string' || department.trim() === '') {
    errors.push('Department is required');
  }

  if (!position || typeof position !== 'string' || position.trim() === '') {
    errors.push('Position is required');
  }

  if (salary === undefined || isNaN(Number(salary)) || Number(salary) <= 0) {
    errors.push('Salary must be a positive number');
  }

  if (errors.length > 0) {
    return ResponseHandler.error(res, 'Validation failed', 422, errors);
  }

  next();
};

module.exports = { validateEmployee };
