// Employee Interface
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
}

// Form data type (similar to employee but id is optional for new employees)
export interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
}

// Filter and sort types
export type SortOption = 'name-asc' | 'name-desc' | 'salary-asc' | 'salary-desc' | 'date-asc' | 'date-desc';

// Modal action types
export type ModalAction = 'add' | 'edit' | 'view' | null;

// Props interfaces
export interface EmployeeTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
}

export interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export interface HeaderProps {
  totalEmployees: number;
  averageSalary: number;
}

export interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  departments: string[];
  onAddClick: () => void;
}
