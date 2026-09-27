const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample data - in memory storage (use database in production)
let employees = [
  {
    id: 1,
    name: 'Bruce Wayne',
    email: 'bruce.wayne@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 120000,
    joinDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Natasha Romanoff',
    email: 'natasha.romanoff@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 95000,
    joinDate: '2021-06-20',
  },
  {
    id: 3,
    name: 'Peter Parker',
    email: 'peter.parker@company.com',
    department: 'Engineering',
    position: 'Developer',
    salary: 85000,
    joinDate: '2022-03-10',
  },
  {
    id: 4,
    name: 'Steve Rogers',
    email: 'steve.rogers@company.com',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 80000,
    joinDate: '2020-09-05',
  },
  {
    id: 5,
    name: 'Bruce Banner',
    email: 'bruce.banner@company.com',
    department: 'Research',
    position: 'Research Scientist',
    salary: 90000,
    joinDate: '2021-08-20',
  },
];

let nextId = 6;

// Validation middleware
const validateEmployee = (req, res, next) => {
  const { name, email, department, position, salary, joinDate } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!department || !department.trim()) {
    return res.status(400).json({ error: 'Department is required' });
  }
  if (!position || !position.trim()) {
    return res.status(400).json({ error: 'Position is required' });
  }
  if (salary === undefined || salary <= 0) {
    return res.status(400).json({ error: 'Salary must be greater than 0' });
  }
  if (!joinDate) {
    return res.status(400).json({ error: 'Join date is required' });
  }

  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Employee API is running' });
});

// GET all employees
app.get('/api/employees', (req, res) => {
  const { department, sort = 'name', order = 'asc' } = req.query;

  let filtered = employees;

  // Filter by department if provided
  if (department) {
    filtered = filtered.filter((emp) => emp.department === department);
  }

  // Sort
  filtered.sort((a, b) => {
    let compareA, compareB;
    switch (sort) {
      case 'name':
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
        break;
      case 'salary':
        compareA = a.salary;
        compareB = b.salary;
        break;
      case 'joinDate':
        compareA = new Date(a.joinDate);
        compareB = new Date(b.joinDate);
        break;
      default:
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
    }

    if (compareA < compareB) return order === 'asc' ? -1 : 1;
    if (compareA > compareB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  res.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
});

// GET single employee
app.get('/api/employees/:id', (req, res) => {
  const employee = employees.find((emp) => emp.id === parseInt(req.params.id));

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  res.json({
    success: true,
    data: employee,
  });
});

// POST create employee
app.post('/api/employees', validateEmployee, (req, res) => {
  const newEmployee = {
    id: nextId++,
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    department: req.body.department.trim(),
    position: req.body.position.trim(),
    salary: req.body.salary,
    joinDate: req.body.joinDate,
  };

  employees.push(newEmployee);

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: newEmployee,
  });
});

// PUT update employee
app.put('/api/employees/:id', validateEmployee, (req, res) => {
  const employee = employees.find((emp) => emp.id === parseInt(req.params.id));

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  employee.name = req.body.name.trim();
  employee.email = req.body.email.trim();
  employee.department = req.body.department.trim();
  employee.position = req.body.position.trim();
  employee.salary = req.body.salary;
  employee.joinDate = req.body.joinDate;

  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: employee,
  });
});

// DELETE employee
app.delete('/api/employees/:id', (req, res) => {
  const index = employees.findIndex((emp) => emp.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const deleted = employees.splice(index, 1);

  res.json({
    success: true,
    message: 'Employee deleted successfully',
    data: deleted[0],
  });
});

// GET stats
app.get('/api/stats', (req, res) => {
  const total = employees.length;
  const avgSalary = total > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / total) : 0;
  const departments = [...new Set(employees.map((emp) => emp.department))];

  res.json({
    success: true,
    data: {
      totalEmployees: total,
      averageSalary: avgSalary,
      departments: departments,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Employee API Server running on http://localhost:${PORT}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`  GET    /api/employees         - Get all employees`);
  console.log(`  GET    /api/employees/:id     - Get single employee`);
  console.log(`  POST   /api/employees         - Create employee`);
  console.log(`  PUT    /api/employees/:id     - Update employee`);
  console.log(`  DELETE /api/employees/:id     - Delete employee`);
  console.log(`  GET    /api/stats             - Get statistics`);
  console.log(`  GET    /health                - Health check\n`);
});

module.exports = app;
