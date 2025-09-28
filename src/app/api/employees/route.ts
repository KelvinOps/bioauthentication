// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Types
interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  shift: 'morning' | 'evening' | 'night';
  salary?: number;
  manager?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Valid sort fields type
type SortableFields = keyof Employee;

// Mock database - Replace with your actual database implementation
const employees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    hireDate: '2023-01-15',
    status: 'active',
    shift: 'morning',
    salary: 85000,
    manager: 'Jane Smith',
    avatar: '/avatars/john-doe.jpg',
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-0102',
    department: 'Engineering',
    position: 'Engineering Manager',
    hireDate: '2022-06-01',
    status: 'active',
    shift: 'morning',
    salary: 120000,
    avatar: '/avatars/jane-smith.jpg',
    createdAt: '2022-06-01T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1-555-0103',
    department: 'Sales',
    position: 'Sales Representative',
    hireDate: '2023-03-20',
    status: 'active',
    shift: 'morning',
    salary: 55000,
    manager: 'Sarah Wilson',
    avatar: '/avatars/mike-johnson.jpg',
    createdAt: '2023-03-20T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1-555-0104',
    department: 'Human Resources',
    position: 'HR Manager',
    hireDate: '2021-09-10',
    status: 'active',
    shift: 'morning',
    salary: 75000,
    avatar: '/avatars/sarah-wilson.jpg',
    createdAt: '2021-09-10T09:00:00Z',
    updatedAt: '2024-01-08T09:00:00Z'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1-555-0105',
    department: 'Finance',
    position: 'Financial Analyst',
    hireDate: '2023-07-01',
    status: 'active',
    shift: 'morning',
    salary: 65000,
    manager: 'Robert Davis',
    avatar: '/avatars/david-brown.jpg',
    createdAt: '2023-07-01T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z'
  },
  {
    id: '6',
    employeeId: 'EMP006',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1-555-0106',
    department: 'Marketing',
    position: 'Marketing Specialist',
    hireDate: '2023-02-15',
    status: 'active',
    shift: 'morning',
    salary: 58000,
    manager: 'Lisa Anderson',
    avatar: '/avatars/emily-davis.jpg',
    createdAt: '2023-02-15T09:00:00Z',
    updatedAt: '2024-01-11T09:00:00Z'
  }
];

// Utility functions
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function generateEmployeeId(): string {
  const maxId = employees.reduce((max, emp) => {
    const num = parseInt(emp.employeeId.replace('EMP', ''));
    return num > max ? num : max;
  }, 0);
  return `EMP${String(maxId + 1).padStart(3, '0')}`;
}

// Type-safe sorting function
function sortEmployees(employees: Employee[], sortBy: string, sortOrder: string): Employee[] {
  return employees.sort((a, b) => {
    // Type-safe property access
    const sortField = sortBy as SortableFields;
    
    // Handle undefined values
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    // Handle null/undefined cases
    if (aVal === undefined || aVal === null) return sortOrder === 'desc' ? 1 : -1;
    if (bVal === undefined || bVal === null) return sortOrder === 'desc' ? -1 : 1;
    
    // Type-specific comparisons
    let comparison = 0;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      // Fallback to string comparison for other types
      comparison = String(aVal).localeCompare(String(bVal));
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

// Validate sort field
function isValidSortField(field: string): field is SortableFields {
  const validFields: SortableFields[] = [
    'id', 'employeeId', 'firstName', 'lastName', 'email', 'phone',
    'department', 'position', 'hireDate', 'status', 'shift', 'salary',
    'manager', 'avatar', 'createdAt', 'updatedAt'
  ];
  return validFields.includes(field as SortableFields);
}

// GET: Fetch employees with optional filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const shift = searchParams.get('shift') || '';
    const sortBy = searchParams.get('sortBy') || 'firstName';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Validate sort parameters
    if (!isValidSortField(sortBy)) {
      return NextResponse.json(
        { error: `Invalid sort field: ${sortBy}` },
        { status: 400 }
      );
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return NextResponse.json(
        { error: 'Sort order must be "asc" or "desc"' },
        { status: 400 }
      );
    }

    let filteredEmployees = [...employees];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower)
      );
    }

    if (department) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.department.toLowerCase() === department.toLowerCase()
      );
    }

    if (status) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.status === status
      );
    }

    if (shift) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.shift === shift
      );
    }

    // Apply sorting using type-safe function
    filteredEmployees = sortEmployees(filteredEmployees, sortBy, sortOrder);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    // Response with metadata
    const response = {
      employees: paginatedEmployees,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredEmployees.length / limit),
        totalItems: filteredEmployees.length,
        itemsPerPage: limit,
        hasNext: endIndex < filteredEmployees.length,
        hasPrev: page > 1
      },
      filters: {
        search,
        department,
        status,
        shift,
        sortBy,
        sortOrder
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position', 'shift'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const existingEmployee = employees.find(emp => emp.email === body.email);
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 409 }
      );
    }

    // Create new employee
    const newEmployee: Employee = {
      id: generateId(),
      employeeId: generateEmployeeId(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || undefined,
      department: body.department,
      position: body.position,
      hireDate: body.hireDate || new Date().toISOString().split('T')[0],
      status: body.status || 'active',
      shift: body.shift,
      salary: body.salary || undefined,
      manager: body.manager || undefined,
      avatar: body.avatar || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to employees array (in real app, save to database)
    employees.push(newEmployee);

    return NextResponse.json(
      { 
        message: 'Employee created successfully',
        employee: newEmployee 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

// PUT: Update an existing employee
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check for email uniqueness (if email is being updated)
    if (body.email && body.email !== employees[employeeIndex].email) {
      const emailExists = employees.some(emp => emp.email === body.email && emp.id !== id);
      if (emailExists) {
        return NextResponse.json(
          { error: 'Employee with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Update employee
    const updatedEmployee: Employee = {
      ...employees[employeeIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    employees[employeeIndex] = updatedEmployee;

    return NextResponse.json(
      {
        message: 'Employee updated successfully',
        employee: updatedEmployee
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

// DELETE: Delete an employee
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Remove employee from array (in real app, delete from database)
    const deletedEmployee = employees.splice(employeeIndex, 1)[0];

    return NextResponse.json(
      {
        message: 'Employee deleted successfully',
        employee: deletedEmployee
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}