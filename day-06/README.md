# Day 6 — TypeScript + React

## Objective
Learn TypeScript and build a component-based React application for Employee Management.

## Project Overview
A modern Employee Management Dashboard built with React 18 and TypeScript. This project demonstrates component composition, state management with hooks, and TypeScript type safety.

## Features
- **Component-Based Architecture**: Reusable, modular components
- **TypeScript Support**: Full type safety with interfaces and generics
- **Employee Management**: Complete CRUD operations
- **Search & Filter**: Real-time search and department filtering
- **Sorting**: Multiple sort options
- **Responsive Design**: Mobile-friendly layout
- **Local Storage**: Persistent data storage
- **Form Validation**: Client-side input validation
- **Modal Dialogs**: For add, edit, view, and delete operations

## Technology Stack
- **Frontend**: React 18
- **Language**: TypeScript 4.9+
- **Styling**: CSS3 with Flexbox and Grid
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Storage**: Browser LocalStorage API
- **Build Tool**: react-scripts (Create React App)

## Project Structure
```
day-06/
├── react-app/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   ├── EmployeeTable.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── EmployeeDetails.tsx
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── types.ts
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── typescript/
│   └── (TypeScript exercises)
└── README.md
```

## Architecture

### Components Hierarchy
```
App (Main Component)
├── Header
├── SearchFilter
├── EmployeeTable
│   └── Employee Row (from mapped array)
├── Modal (Form)
│   └── EmployeeForm
├── Modal (Details)
│   └── EmployeeDetails
└── Modal (Delete Confirmation)
```

### Component Responsibilities

**Header Component**
- Displays dashboard title
- Shows statistics (total employees, average salary)
- Responsive layout

**SearchFilter Component**
- Search input for name/email/department
- Department dropdown filter
- Sort dropdown
- Add employee button
- Handles all filter state

**EmployeeTable Component**
- Displays employee data in table format
- Action buttons for view/edit/delete
- Empty state handling
- Responsive and handles large datasets

**EmployeeForm Component**
- Reusable form for add and edit operations
- Form validation with error messages
- Input validation for email format
- Required field validation

**Modal Component**
- Reusable modal wrapper
- Handles open/close state
- Backdrop click to close
- Smooth animations

**EmployeeDetails Component**
- Displays full employee information
- Edit and delete buttons
- Formatted currency and date display

## TypeScript Features Used

### Interfaces
```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
}
```

### Component Props
```typescript
interface HeaderProps {
  totalEmployees: number;
  averageSalary: number;
}

interface EmployeeTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
}
```

### Type Aliases
```typescript
type SortOption = 'name-asc' | 'name-desc' | 'salary-asc' | 'salary-desc' | 'date-asc' | 'date-desc';
type ModalAction = 'add' | 'edit' | 'view' | null;
```

### Generics
```typescript
const [employees, setEmployees] = useState<Employee[]>([]);
const [modal, setModal] = useState<ModalState>({ action: null, employee: null });
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Steps
1. Navigate to `day-06/react-app`
2. Install dependencies:
```bash
npm install
```

## How to Run

### Development Server
```bash
npm start
```
- Opens http://localhost:3000
- Hot reload enabled

### Production Build
```bash
npm run build
```
- Creates optimized build in `build/` folder

### Testing
```bash
npm test
```

## Key React Hooks Used

### useState
```typescript
const [employees, setEmployees] = useState<Employee[]>([]);
const [searchTerm, setSearchTerm] = useState('');
```

### useEffect
```typescript
useEffect(() => {
  const stored = localStorage.getItem('employees');
  if (stored) {
    setEmployees(JSON.parse(stored));
  }
}, []);

useEffect(() => {
  localStorage.setItem('employees', JSON.stringify(employees));
}, [employees]);
```

### useMemo
```typescript
const filteredEmployees = useMemo(() => {
  // Expensive filtering and sorting logic
  return filtered;
}, [employees, searchTerm, departmentFilter, sortOption]);
```

## Usage Guide

### Adding an Employee
```typescript
const handleAddEmployee = () => {
  setModal({ action: 'add', employee: null });
};

const handleFormSubmit = (data: EmployeeFormData) => {
  const newEmployee: Employee = {
    id: Math.max(...employees.map(e => e.id), 0) + 1,
    ...data,
  };
  setEmployees([...employees, newEmployee]);
};
```

### Editing an Employee
```typescript
const handleEditEmployee = (employee: Employee) => {
  setModal({ action: 'edit', employee });
};
```

### Deleting an Employee
```typescript
const handleDeleteClick = (employeeId: number) => {
  setDeleteTargetId(employeeId);
  setShowDeleteConfirm(true);
};
```

### Filtering
```typescript
const handleSearchChange = (value: string) => {
  setSearchTerm(value);
  // Filtering happens in useMemo
};
```

## Data Flow
1. **User Action** → Component event handler
2. **State Update** → setState or hook updater
3. **Recalculation** → useMemo dependencies change
4. **Re-render** → Component re-renders with new data
5. **Effect** → useEffect runs (e.g., save to localStorage)
6. **Display** → Updated UI shown to user

## Form Validation
```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.name.trim()) newErrors.name = 'Name is required';
  if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
  // ... more validations
  
  return Object.keys(newErrors).length === 0;
};
```

## Performance Optimizations
1. **useMemo**: Prevents unnecessary filtering/sorting recalculations
2. **React.FC typing**: Ensures component type safety
3. **Conditional rendering**: Only renders necessary components
4. **Event delegation**: Efficient event handling
5. **Proper dependency arrays**: Prevents too many effect runs

## TypeScript Benefits Demonstrated
- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support
- **Refactoring Safety**: Rename with confidence
- **Self-Documentation**: Types serve as documentation
- **Generic Reusability**: Components work with typed props
- **Interface Contracts**: Clear component APIs

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## Challenges Faced
1. **TypeScript Learning Curve**: Getting comfortable with types
2. **Props Drilling**: Passing props through multiple levels
3. **Re-render Optimization**: Preventing unnecessary renders
4. **Modal State Management**: Keeping modals in sync
5. **Form Validation**: Client-side validation patterns

## Solutions Implemented
1. Comprehensive TypeScript interfaces
2. Custom hooks for shared logic
3. useMemo for expensive computations
4. Proper state shape design
5. Input validation with error messages

## Concepts Demonstrated
- **React Hooks**: useState, useEffect, useMemo
- **TypeScript**: Interfaces, types, generics
- **Component Composition**: Building reusable components
- **State Management**: Managing complex application state
- **Event Handling**: React events and preventDefault
- **Controlled Components**: Input bindings
- **Conditional Rendering**: Ternary and logical operators
- **List Rendering**: Mapping over arrays with keys

## Future Improvements
1. **Context API**: Replace prop drilling with Context
2. **useReducer**: Complex state logic
3. **Custom Hooks**: Extract reusable logic
4. **Error Boundaries**: Better error handling
5. **Lazy Loading**: Code splitting with React.lazy
6. **Unit Tests**: Jest and React Testing Library
7. **E2E Tests**: Cypress or Playwright
8. **Redux/Zustand**: Advanced state management
9. **Storybook**: Component documentation
10. **GraphQL**: Replace REST API

## Testing Checklist
- [x] Add employee with all fields
- [x] Edit existing employee
- [x] Delete employee with confirmation
- [x] Search employees
- [x] Filter by department
- [x] Sort by different criteria
- [x] Form validation errors
- [x] Modal open/close
- [x] Responsive layout
- [x] Data persistence

