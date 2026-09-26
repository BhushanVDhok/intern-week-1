// Employee Dashboard Application
// Pure JavaScript, no external libraries

class EmployeeManager {
    constructor() {
        this.employees = this.loadData();
        this.filteredEmployees = [...this.employees];
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    // Data Management
    loadData() {
        const stored = localStorage.getItem('employees');
        if (stored) {
            return JSON.parse(stored);
        }
        return this.getSampleData();
    }

    saveData() {
        localStorage.setItem('employees', JSON.stringify(this.employees));
    }

    getSampleData() {
        return [
            {
                id: 1,
                name: 'Bruce Wayne',
                email: 'bruce.wayne@company.com',
                department: 'Engineering',
                position: 'Senior Developer',
                salary: 120000,
                joinDate: '2022-01-15'
            },
            {
                id: 2,
                name: 'Natasha Romanoff',
                email: 'natasha.romanoff@company.com',
                department: 'Marketing',
                position: 'Marketing Manager',
                salary: 95000,
                joinDate: '2021-06-20'
            },
            {
                id: 3,
                name: 'John Wick',
                email: 'john.wick@company.com',
                department: 'Engineering',
                position: 'Developer',
                salary: 85000,
                joinDate: '2022-03-10'
            },
            {
                id: 4,
                name: 'Harry Potter',
                email: 'harry.potter@company.com',
                department: 'Human Resources',
                position: 'HR Manager',
                salary: 80000,
                joinDate: '2020-09-05'
            },
            {
                id: 5,
                name: 'Walter White',
                email: 'walter.white@company.com',
                department: 'Finance',
                position: 'Finance Analyst',
                salary: 75000,
                joinDate: '2021-11-12'
            }
        ];
    }

    // Event Listeners
    setupEventListeners() {
        // Search and filters
        this.querySelector('#searchInput').addEventListener('input', () => this.applyFilters());
        this.querySelector('#departmentFilter').addEventListener('change', () => this.applyFilters());
        this.querySelector('#sortSelect').addEventListener('change', () => this.applyFilters());

        // Add employee
        this.querySelector('#addEmployeeBtn').addEventListener('click', () => this.openAddForm());

        // Modal controls
        this.querySelector('#detailsCloseBtn').addEventListener('click', () => this.closeModal('detailsModal'));
        this.querySelector('#formCloseBtn').addEventListener('click', () => this.closeModal('formModal'));
        this.querySelector('#formCancelBtn').addEventListener('click', () => this.closeModal('formModal'));
        this.querySelector('#deleteCancelBtn').addEventListener('click', () => this.closeModal('deleteModal'));
        this.querySelector('#deleteConfirmBtn').addEventListener('click', () => this.confirmDelete());

        // Form submission
        this.querySelector('#employeeForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Close modal on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // Filter and Search
    applyFilters() {
        const searchTerm = this.querySelector('#searchInput').value.toLowerCase();
        const departmentFilter = this.querySelector('#departmentFilter').value;
        const sortValue = this.querySelector('#sortSelect').value;

        // Filter
        this.filteredEmployees = this.employees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(searchTerm) ||
                                emp.email.toLowerCase().includes(searchTerm) ||
                                emp.department.toLowerCase().includes(searchTerm);
            const matchesDept = !departmentFilter || emp.department === departmentFilter;
            return matchesSearch && matchesDept;
        });

        // Sort
        this.sortEmployees(sortValue);
        this.render();
    }

    sortEmployees(sortValue) {
        const [sortBy, sortOrder] = sortValue.split('-');
        
        this.filteredEmployees.sort((a, b) => {
            let compareA, compareB;

            switch (sortBy) {
                case 'name':
                    compareA = a.name.toLowerCase();
                    compareB = b.name.toLowerCase();
                    break;
                case 'salary':
                    compareA = a.salary;
                    compareB = b.salary;
                    break;
                case 'date':
                    compareA = new Date(a.joinDate);
                    compareB = new Date(b.joinDate);
                    break;
                default:
                    return 0;
            }

            if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
            if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // CRUD Operations
    addEmployee(data) {
        const newEmployee = {
            id: Math.max(...this.employees.map(e => e.id), 0) + 1,
            ...data
        };
        this.employees.push(newEmployee);
        this.saveData();
        this.populateDepartmentFilter();
        this.applyFilters();
    }

    updateEmployee(id, data) {
        const index = this.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            this.employees[index] = { id, ...data };
            this.saveData();
            this.populateDepartmentFilter();
            this.applyFilters();
        }
    }

    deleteEmployee(id) {
        this.employees = this.employees.filter(e => e.id !== id);
        this.saveData();
        this.populateDepartmentFilter();
        this.applyFilters();
    }

    getEmployee(id) {
        return this.employees.find(e => e.id === id);
    }

    // Modal Management
    openAddForm() {
        this.currentEditId = null;
        this.querySelector('#formTitle').textContent = 'Add Employee';
        this.querySelector('#employeeForm').reset();
        this.openModal('formModal');
    }

    openEditForm(id) {
        const employee = this.getEmployee(id);
        if (!employee) return;

        this.currentEditId = id;
        this.querySelector('#formTitle').textContent = 'Edit Employee';
        this.querySelector('#name').value = employee.name;
        this.querySelector('#email').value = employee.email;
        this.querySelector('#department').value = employee.department;
        this.querySelector('#position').value = employee.position;
        this.querySelector('#salary').value = employee.salary;
        this.querySelector('#joinDate').value = employee.joinDate;

        this.openModal('formModal');
    }

    openDetailsModal(id) {
        const employee = this.getEmployee(id);
        if (!employee) return;

        const html = `
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Name</span>
                    <span class="detail-value">${this.escapeHtml(employee.name)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${this.escapeHtml(employee.email)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Department</span>
                    <span class="detail-value">${this.escapeHtml(employee.department)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Position</span>
                    <span class="detail-value">${this.escapeHtml(employee.position)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Salary</span>
                    <span class="detail-value">$${this.formatCurrency(employee.salary)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Join Date</span>
                    <span class="detail-value">${this.formatDate(employee.joinDate)}</span>
                </div>
            </div>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="btn btn-primary btn-small" onclick="app.openEditForm(${id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="app.openDeleteConfirm(${id})">Delete</button>
            </div>
        `;

        this.querySelector('#detailsBody').innerHTML = html;
        this.openModal('detailsModal');
    }

    openDeleteConfirm(id) {
        this.currentDeleteId = id;
        this.closeModal('detailsModal');
        this.openModal('deleteModal');
    }

    openModal(modalId) {
        this.querySelector(`#${modalId}`).classList.add('active');
    }

    closeModal(modalId) {
        this.querySelector(`#${modalId}`).classList.remove('active');
    }

    // Form Handling
    handleFormSubmit(e) {
        e.preventDefault();
        
        const data = {
            name: this.querySelector('#name').value.trim(),
            email: this.querySelector('#email').value.trim(),
            department: this.querySelector('#department').value.trim(),
            position: this.querySelector('#position').value.trim(),
            salary: parseInt(this.querySelector('#salary').value),
            joinDate: this.querySelector('#joinDate').value
        };

        // Validation
        if (!this.validateEmployeeData(data)) {
            alert('Please fill in all fields correctly');
            return;
        }

        if (this.currentEditId) {
            this.updateEmployee(this.currentEditId, data);
            alert('Employee updated successfully!');
        } else {
            this.addEmployee(data);
            alert('Employee added successfully!');
        }

        this.closeModal('formModal');
    }

    confirmDelete() {
        if (this.currentDeleteId) {
            const employee = this.getEmployee(this.currentDeleteId);
            this.deleteEmployee(this.currentDeleteId);
            alert(`${employee.name} has been deleted.`);
            this.closeModal('deleteModal');
        }
    }

    validateEmployeeData(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return data.name && data.email && emailRegex.test(data.email) && 
               data.department && data.position && data.salary > 0 && data.joinDate;
    }

    // Rendering
    render() {
        this.renderTable();
        this.updateStats();
        this.populateDepartmentFilter();
    }

    renderTable() {
        const tbody = this.querySelector('#employeesTableBody');
        
        if (this.filteredEmployees.length === 0) {
            tbody.innerHTML = '<tr class="empty-state"><td colspan="6">No employees found</td></tr>';
            return;
        }

        tbody.innerHTML = this.filteredEmployees.map(emp => `
            <tr>
                <td>${this.escapeHtml(emp.name)}</td>
                <td>${this.escapeHtml(emp.email)}</td>
                <td>${this.escapeHtml(emp.department)}</td>
                <td>$${this.formatCurrency(emp.salary)}</td>
                <td>${this.formatDate(emp.joinDate)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small" onclick="app.openDetailsModal(${emp.id})">View</button>
                        <button class="btn btn-secondary btn-small" onclick="app.openEditForm(${emp.id})">Edit</button>
                        <button class="btn btn-danger btn-small" onclick="app.openDeleteConfirm(${emp.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const total = this.employees.length;
        const avgSalary = total > 0 
            ? Math.round(this.employees.reduce((sum, emp) => sum + emp.salary, 0) / total)
            : 0;

        this.querySelector('#totalEmployees').textContent = total;
        this.querySelector('#avgSalary').textContent = `$${this.formatCurrency(avgSalary)}`;
    }

    populateDepartmentFilter() {
        const departments = [...new Set(this.employees.map(e => e.department))].sort();
        const select = this.querySelector('#departmentFilter');
        const currentValue = select.value;

        select.innerHTML = '<option value="">All Departments</option>' +
            departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
        
        select.value = currentValue;
    }

    // Utility Functions
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    querySelector(selector) {
        return document.querySelector(selector);
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EmployeeManager();
});
