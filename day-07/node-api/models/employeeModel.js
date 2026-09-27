// In-memory Employee Model Store
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
  }
];

class EmployeeModel {
  static findAll() {
    return [...employees];
  }

  static findById(id) {
    return employees.find(e => e.id === Number(id));
  }

  static findByEmail(email) {
    return employees.find(e => e.email.toLowerCase() === email.toLowerCase());
  }

  static create(data) {
    const nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const newEmployee = {
      id: nextId,
      name: data.name,
      email: data.email,
      department: data.department,
      position: data.position,
      salary: Number(data.salary),
      joinDate: data.joinDate || new Date().toISOString().split('T')[0]
    };
    employees.push(newEmployee);
    return newEmployee;
  }

  static update(id, data) {
    const index = employees.findIndex(e => e.id === Number(id));
    if (index === -1) return null;
    employees[index] = {
      ...employees[index],
      ...data,
      id: Number(id)
    };
    return employees[index];
  }

  static delete(id) {
    const index = employees.findIndex(e => e.id === Number(id));
    if (index === -1) return false;
    employees.splice(index, 1);
    return true;
  }
}

module.exports = EmployeeModel;
