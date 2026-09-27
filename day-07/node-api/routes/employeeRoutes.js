const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validationMiddleware');

// Statistics endpoint (must precede /:id)
router.get('/stats', EmployeeController.getStats);

// CRUD routes
router.get('/', EmployeeController.getAll);
router.get('/:id', EmployeeController.getById);
router.post('/', validateEmployee, EmployeeController.create);
router.put('/:id', validateEmployee, EmployeeController.update);
router.delete('/:id', EmployeeController.delete);

module.exports = router;
