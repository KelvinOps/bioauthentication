//dashboard/employees/[id]/page.tsx
// 
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  User, 
  Fingerprint,
  Activity,
  Clock,
  TrendingUp
} from 'lucide-react'

interface Employee {
  id: number
  empId: string
  name: string
  email: string
  phone: string
  address: string
  department: string
  position: string
  joinDate: string
  status: 'Active' | 'Inactive'
  initials: string
  fingerprint: boolean
  emergencyContact?: string
  emergencyPhone?: string
  lastSeen?: string
}

interface AttendanceStats {
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  averageHours: number
  overtimeHours: number
}

const mockEmployee: Employee = {
  id: 1,
  empId: 'EMP001',
  name: 'John Doe',
  email: 'john.doe@company.com',
  phone: '+254 712 345 678',
  address: '123 Main Street, Nairobi, Kenya',
  department: 'Engineering',
  position: 'Software Developer',
  joinDate: '2023-01-15',
  status: 'Active',
  initials: 'JD',
  fingerprint: true,
  emergencyContact: 'Jane Doe',
  emergencyPhone: '+254 712 987 654',
  lastSeen: '2 minutes ago'
}

const mockAttendanceStats: AttendanceStats = {
  totalDays: 22,
  presentDays: 20,
  absentDays: 1,
  lateDays: 3,
  averageHours: 8.2,
  overtimeHours: 4.5
}

const mockRecentAttendance = [
  { date: '2024-01-15', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: '8.5h', status: 'Present' },
  { date: '2024-01-14', checkIn: '09:45 AM', checkOut: '06:15 PM', hours: '8.2h', status: 'Late' },
  { date: '2024-01-13', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' },
  { date: '2024-01-12', checkIn: '09:00 AM', checkOut: '05:30 PM', hours: '8.0h', status: 'Present' },
  { date: '2024-01-11', checkIn: '08:55 AM', checkOut: '06:10 PM', hours: '8.8h', status: 'Present' },
]

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const employeeId = params.id as string
    
    // Simulate API call to fetch employee data
    const timer = setTimeout(() => {
      setEmployee(mockEmployee)
      setAttendanceStats(mockAttendanceStats)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this employee?')) {
      console.log('Deleting employee:', params.id)
      router.push('/dashboard/employees')
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/employees/${params.id}/edit`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-16"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="loading-skeleton h-96"></div>
          <div className="lg:col-span-2 loading-skeleton h-96"></div>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Employee Not Found</h2>
        <p className="text-slate-400 mb-6">The employee you're looking for doesn't exist.</p>
        <button
          onClick={() => router.back()}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Employee Details</h1>
            <p className="text-slate-400 mt-1">Manage and view employee information</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleEdit}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn-secondary text-red-400 hover:text-red-300 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Profile Card */}
        <div className="card">
          <div className="card-content">
            <div className="text-center pb-6 border-b border-slate-800">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{employee.initials}</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">{employee.name}</h2>
              <p className="text-slate-400 text-sm mb-3">{employee.position}</p>
              <div className="flex items-center justify-center gap-3">
                <span className={`status-badge ${employee.status === 'Active' ? 'status-present' : 'status-absent'}`}>
                  {employee.status}
                </span>
                <span className={`status-badge ${employee.fingerprint ? 'status-present' : 'status-absent'}`}>
                  {employee.fingerprint ? 'Biometric Enrolled' : 'No Biometric'}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Employee ID</p>
                  <p className="text-white font-medium">{employee.empId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="text-white font-medium">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Phone</p>
                  <p className="text-white font-medium">{employee.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Building className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Department</p>
                  <p className="text-white font-medium">{employee.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Join Date</p>
                  <p className="text-white font-medium">{new Date(employee.joinDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Address</p>
                  <p className="text-white font-medium">{employee.address}</p>
                </div>
              </div>
            </div>

            {employee.emergencyContact && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-3">Emergency Contact</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-slate-400">Contact Name</p>
                    <p className="text-white font-medium">{employee.emergencyContact}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Contact Phone</p>
                    <p className="text-white font-medium">{employee.emergencyPhone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="card">
            <div className="card-content p-0">
              <div className="flex border-b border-slate-800">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'overview' 
                      ? 'border-blue-500 text-blue-400' 
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'attendance' 
                      ? 'border-blue-500 text-blue-400' 
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Attendance History
                </button>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && attendanceStats && (
            <div className="space-y-6">
              {/* Attendance Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="stats-card">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-400">Present Days</h3>
                      <p className="text-2xl font-bold text-white">{attendanceStats.presentDays}</p>
                      <p className="text-xs text-green-400">
                        {((attendanceStats.presentDays / attendanceStats.totalDays) * 100).toFixed(1)}% attendance
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-400">Avg Hours</h3>
                      <p className="text-2xl font-bold text-white">{attendanceStats.averageHours}h</p>
                      <p className="text-xs text-blue-400">per day</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-400">Overtime</h3>
                      <p className="text-2xl font-bold text-white">{attendanceStats.overtimeHours}h</p>
                      <p className="text-xs text-purple-400">this month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="card-content">
                  <div className="space-y-3">
                    {mockRecentAttendance.slice(0, 5).map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-white font-medium">
                              {new Date(record.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-xs text-slate-400">
                              {record.checkIn} - {record.checkOut}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`status-badge status-${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                          <p className="text-xs text-slate-400 mt-1">{record.hours}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance History Tab */}
          {activeTab === 'attendance' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Attendance History</h3>
              </div>
              <div className="card-content">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="table-header text-left py-3">Date</th>
                        <th className="table-header text-left py-3">Check In</th>
                        <th className="table-header text-left py-3">Check Out</th>
                        <th className="table-header text-left py-3">Hours</th>
                        <th className="table-header text-left py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecentAttendance.map((record, index) => (
                        <tr key={index} className="table-row">
                          <td className="py-3 text-slate-300">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-slate-300">{record.checkIn}</td>
                          <td className="py-3 text-slate-300">{record.checkOut}</td>
                          <td className="py-3 text-slate-300 font-medium">{record.hours}</td>
                          <td className="py-3">
                            <span className={`status-badge status-${record.status.toLowerCase()}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}