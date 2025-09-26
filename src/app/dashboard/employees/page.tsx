'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, UserCheck, Download } from 'lucide-react'

interface Employee {
  id: number
  empId: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  status: 'Active' | 'Inactive'
  initials: string
  lastSeen?: string
  fingerprint: boolean
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    empId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '2023-01-15',
    status: 'Active',
    initials: 'JD',
    lastSeen: '2 minutes ago',
    fingerprint: true
  },
  {
    id: 2,
    empId: 'EMP002',
    name: 'Sarah Smith',
    email: 'sarah.smith@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2022-11-20',
    status: 'Active',
    initials: 'SS',
    lastSeen: '1 hour ago',
    fingerprint: true
  },
  {
    id: 3,
    empId: 'EMP003',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    department: 'HR',
    position: 'HR Specialist',
    joinDate: '2023-03-10',
    status: 'Inactive',
    initials: 'MJ',
    lastSeen: '2 days ago',
    fingerprint: false
  },
  {
    id: 4,
    empId: 'EMP004',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    joinDate: '2022-08-05',
    status: 'Active',
    initials: 'LA',
    lastSeen: '30 minutes ago',
    fingerprint: true
  },
  {
    id: 5,
    empId: 'EMP005',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2021-12-01',
    status: 'Active',
    initials: 'DW',
    lastSeen: '5 minutes ago',
    fingerprint: true
  }
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [showDropdown, setShowDropdown] = useState<number | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEmployees(mockEmployees)
      setFilteredEmployees(mockEmployees)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = employees

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by department
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(emp => emp.department === departmentFilter)
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(emp => emp.status.toLowerCase() === statusFilter)
    }

    setFilteredEmployees(filtered)
  }, [searchTerm, departmentFilter, statusFilter, employees])

  const departments = [...new Set(employees.map(emp => emp.department))]

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployees(prev => 
      prev.includes(id) 
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on employees:`, selectedEmployees)
    // Implement bulk actions
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-16"></div>
        <div className="loading-skeleton h-20"></div>
        <div className="loading-skeleton h-96"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-slate-400 mt-1">Manage your organization employee records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link href="/dashboard/employees/add" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">Total Employees</h3>
              <p className="text-2xl font-bold text-white mt-1">{employees.length}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">Active</h3>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {employees.filter(emp => emp.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">Departments</h3>
              <p className="text-2xl font-bold text-purple-400 mt-1">{departments.length}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Filter className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-400">With Biometric</h3>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {employees.filter(emp => emp.fingerprint).length}
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <UserCheck className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 && (
        <div className="card border-blue-500/20">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleBulkAction('activate')}
                  className="btn-secondary text-sm"
                >
                  Activate
                </button>
                <button 
                  onClick={() => handleBulkAction('deactivate')}
                  className="btn-secondary text-sm"
                >
                  Deactivate
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  className="btn-secondary text-sm text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-white">
            Employee List ({filteredEmployees.length})
          </h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="table-header text-left py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="table-header text-left py-3">Employee</th>
                  <th className="table-header text-left py-3">Employee ID</th>
                  <th className="table-header text-left py-3">Department</th>
                  <th className="table-header text-left py-3">Position</th>
                  <th className="table-header text-left py-3">Join Date</th>
                  <th className="table-header text-left py-3">Status</th>
                  <th className="table-header text-left py-3">Biometric</th>
                  <th className="table-header text-left py-3">Last Seen</th>
                  <th className="table-header text-left py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="table-row">
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleSelectEmployee(employee.id)}
                          className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">{employee.initials}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{employee.name}</p>
                            <p className="text-xs text-slate-400">{employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-400 font-mono">{employee.empId}</td>
                      <td className="py-4 text-slate-300">{employee.department}</td>
                      <td className="py-4 text-slate-300">{employee.position}</td>
                      <td className="py-4 text-slate-400">{new Date(employee.joinDate).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`status-badge ${employee.status === 'Active' ? 'status-present' : 'status-absent'}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${employee.fingerprint ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className="text-xs text-slate-400">
                            {employee.fingerprint ? 'Enrolled' : 'Not Enrolled'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-400 text-sm">{employee.lastSeen}</td>
                      <td className="py-4">
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === employee.id ? null : employee.id)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {showDropdown === employee.id && (
                            <div className="absolute right-0 top-8 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                              <div className="py-2">
                                <Link
                                  href={`/dashboard/employees/${employee.id}`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700"
                                >
                                  <Edit className="w-4 h-4" />
                                  View Details
                                </Link>
                                <button
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700"
                                  onClick={() => console.log('Edit employee', employee.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Employee
                                </button>
                                <button
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700"
                                  onClick={() => console.log('Delete employee', employee.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Employee
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      No employees found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}