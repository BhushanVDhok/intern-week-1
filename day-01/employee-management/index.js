const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

// In-memory data store
let employees = [
  { id: 1, name: "Steve Rogers", department: "Engineering", salary: 85000 },
  { id: 2, name: "Bruce Banner", department: "Marketing", salary: 62000 },
  { id: 3, name: "Gwen Stacy", department: "Engineering", salary: 84000 },
  { id: 4, name: "Peter Parker", department: "Finance", salary: 92000 }
];
let nextId = 4;

const rl = readline.createInterface({ input, output });

// Utility to ask questions via terminal
async function askQuestion(query) {
  return (await rl.question(query)).trim();
}

// 1. Add Employee
async function addEmployee() {
  console.log("\n--- Add New Employee ---");
  const name = await askQuestion("Enter Name: ");
  if (!name) {
    console.log("Name cannot be empty.");
    return;
  }

  const department = await askQuestion("Enter Department: ");
  const salaryInput = await askQuestion("Enter Salary: ");
  const salary = parseFloat(salaryInput);

  if (isNaN(salary) || salary <= 0) {
    console.log("Invalid salary amount.");
    return;
  }

  const newEmployee = { id: nextId++, name, department, salary };
  employees.push(newEmployee);
  console.log(`Employee added successfully with ID: ${newEmployee.id}`);
}

// 2. Update Employee
async function updateEmployee() {
  console.log("\n--- Update Employee ---");
  const idInput = await askQuestion("Enter Employee ID to update: ");
  const id = parseInt(idInput);
  const emp = employees.find(e => e.id === id);

  if (!emp) {
    console.log("Employee not found.");
    return;
  }

  console.log(`Updating ${emp.name}`);
  const newName = await askQuestion(`Name [${emp.name}]: `);
  const newDept = await askQuestion(`Department [${emp.department}]: `);
  const newSalaryInput = await askQuestion(`Salary [${emp.salary}]: `);

  if (newName) emp.name = newName;
  if (newDept) emp.department = newDept;
  if (newSalaryInput) {
    const parsedSalary = parseFloat(newSalaryInput);
    if (!isNaN(parsedSalary) && parsedSalary > 0) {
      emp.salary = parsedSalary;
    } else {
      console.log("Invalid salary entered. Salary left unchanged.");
    }
  }

  console.log("Employee updated successfully!");
}

// 3. Delete Employee
async function deleteEmployee() {
  console.log("\n--- Delete Employee ---");
  const idInput = await askQuestion("Enter Employee ID to delete: ");
  const id = parseInt(idInput);
  const index = employees.findIndex(e => e.id === id);

  if (index === -1) {
    console.log("Employee not found.");
    return;
  }

  const deleted = employees.splice(index, 1);
  console.log(`Removed employee: ${deleted[0].name} (ID: ${id})`);
}

// 4. Search Employee
async function searchEmployee() {
  console.log("\n--- Search Employee ---");
  const query = (await askQuestion("Enter ID or Name to search: ")).toLowerCase();

  const results = employees.filter(
    e => e.id.toString() === query || e.name.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    console.log("No matching employees found.");
  } else {
    console.table(results);
  }
}

// 5. List All Employees
function listEmployees() {
  console.log("\n--- All Employees ---");
  if (employees.length === 0) {
    console.log("No employees registered.");
    return;
  }
  console.table(employees);
}

// 6. View Highest Salary
function highestSalary() {
  console.log("\n--- Highest Salary ---");
  if (employees.length === 0) {
    console.log("No employee records available.");
    return;
  }

  const highest = employees.reduce((max, emp) => (emp.salary > max.salary ? emp : max), employees[0]);
  console.log(`Highest Paid: ${highest.name} | Dept: ${highest.department} | Salary: $${highest.salary}`);
}

// 7. View Average Salary
function averageSalary() {
  console.log("\n--- Average Salary ---");
  if (employees.length === 0) {
    console.log("No employee records available.");
    return;
  }

  const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avg = total / employees.length;
  console.log(`Average Salary across ${employees.length} employees: $${avg.toFixed(2)}`);
}

// 8. Filter by Department
async function filterByDepartment() {
  console.log("\n--- Filter by Department ---");
  const dept = (await askQuestion("Enter Department Name: ")).toLowerCase();

  const filtered = employees.filter(e => e.department.toLowerCase() === dept);

  if (filtered.length === 0) {
    console.log(`No employees found in department "${dept}".`);
  } else {
    console.table(filtered);
  }
}

// Main Menu Loop
async function main() {
  let running = true;

  while (running) {
    console.log(`
==================================
  EMPLOYEE MANAGEMENT CLI APP
==================================
1. Add Employee
2. Update Employee
3. Delete Employee
4. Search Employee
5. List All Employees
6. Highest Salary
7. Average Salary
8. Filter by Department
9. Exit
`);

    const choice = await askQuestion("Select an option (1-9): ");

    switch (choice) {
      case '1': await addEmployee(); break;
      case '2': await updateEmployee(); break;
      case '3': await deleteEmployee(); break;
      case '4': await searchEmployee(); break;
      case '5': listEmployees(); break;
      case '6': highestSalary(); break;
      case '7': averageSalary(); break;
      case '8': await filterByDepartment(); break;
      case '9':
        console.log("\nExiting application....");
        running = false;
        break;
      default:
        console.log("Invalid option. Please choose between 1 and 9.");
    }
  }
  rl.close();
}

main();