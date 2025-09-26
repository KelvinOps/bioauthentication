'use client'

import { useState } from 'react'
import { Calendar, Download, Filter, Users, Clock, TrendingUp } from 'lucide-react'

const mockDailyData = {
  date: '2024-01-15',
  stats: {
    totalEmployees: 125,
    present: 118,
    absent: 4,
    late: 7,
    early: 3,
    onTime: 111,
    averageCheckIn: '09:12 AM',
    averageCheckOut: '05:47 PM',
    totalHours: 1024.5,
    overtimeHours: 48.2
  },
  attendanceData: [
    { empId: 'EMP001', name: 'John Doe', department: 'Engineering', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: 8.5, status: 'Present', overtime: 0.5 },
    { empId: 'EMP002', name: 'Sarah Smith', department: 'Marketing', checkIn: '09:45 AM', checkOut: '06:15 PM', hours: 8.2, status: 'Late', overtime: 0 },
    { empId: 'EMP003', name: 'Mike Johnson', department: 'HR', checkIn: '-', checkOut: '-', hours: 0, status: 'Absent', overtime: 0 },
    { empId: 'EMP004', name: 'Lisa Anderson', department: 'Finance', checkIn: '09:00 AM', checkOut: '04:30 PM', hours: 7.5, status: 'Early', overtime: 0 },
    { empId: 'EMP005', name: 'David Wilson', department: 'Engineering', checkIn: '08:55 AM', checkOut: '06:05 PM', hours: 9.0, status: 'Present', overtime: 1.0 },
  ],
  departmentBreakdown: [
    { department: 'Engineering', total: 35, present: 33, absent: 1, late: 3, attendanceRate: 94.3 },
    { department: 'Marketing', total: 20, present: 19, absent: 1, late: 2, attendanceRate: 95.0 },
    { department: 'HR', total: 15, present: 14, absent: 1, late: 1, attendanceRate: 93.3 },
    { department: 'Finance', total: 25, present: 24, absent: 0, late: 1, attendanceRate: 96.0 },
    { department: 'Operations', total: 30, present: 28, absent: 1, late: 0, attendanceRate: 93.3 },
  ]
}

export default function DailyReportsPage() {
  const [selectedDate, setSelectedDate] = useState('2024-01-15')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const data = mockDailyData
  const departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Operations']

  const filteredAttendance = data.attendanceData.filter(record => {
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter
    const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesDepartment && matchesStatus
  })

  const handleExport = (format: string) => {
    console.log(`Exporting daily report for ${selectedDate} in ${format} format`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Reports</h1>
          <p className="text-slate-400 mt-1">Detailed daily attendance analysis and statistics</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <button className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="py-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-700 text-sm"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-700 text-sm"
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-700 text-sm"
                >
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Header */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <p className="text-slate-400">Daily Attendance Report</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {((data.stats.present / data.stats.totalEmployees) * 100).toFixed(1)}%
              </p>
              <p className="text-slate-400 text-sm">Overall Attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Present</h3>
              <p className="text-2xl font-bold text-white">{data.stats.present}</p>
              <p className="text-xs text-green-400">
                {((data.stats.present / data.stats.totalEmployees) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Late Arrivals</h3>
              <p className="text-2xl font-bold text-white">{data.stats.late}</p>
              <p className="text-xs text-yellow-400">
                {((data.stats.late / data.stats.totalEmployees) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Absent</h3>
              <p className="text-2xl font-bold text-white">{data.stats.absent}</p>
              <p className="text-xs text-red-400">
                {((data.stats.absent / data.stats.totalEmployees) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Total Hours</h3>
              <p className="text-2xl font-bold text-white">{data.stats.totalHours}h</p>
              <p className="text-xs text-purple-400">
                {data.stats.overtimeHours}h overtime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-white">Department Breakdown</h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="table-header text-left py-3">Department</th>
                  <th className="table-header text-left py-3">Total</th>
                  <th className="table-header text-left py-3">Present</th>
                  <th className="table-header text-left py-3">Absent</th>
                  <th className="table-header text-left py-3">Late</th>
                  <th className="table-header text-left py-3">Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.departmentBreakdown.map((dept, index) => (
                  <tr key={index} className="table-row">
                    <td className="py-3 text-white font-medium">{dept.department}</td>
                    <td className="py-3 text-slate-300">{dept.total}</td>
                    <td className="py-3 text-green-400">{dept.present}</td>
                    <td className="py-3 text-red-400">{dept.absent}</td>
                    <td className="py-3 text-yellow-400">{dept.late}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${dept.attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm font-medium">
                          {dept.attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm font-medium">Filters:</span>
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
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="early">Early</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Attendance Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-white">
            Detailed Attendance ({filteredAttendance.length} records)
          </h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="table-header text-left py-3">Employee</th>
                  <th className="table-header text-left py-3">Department</th>
                  <th className="table-header text-left py-3">Check In</th>
                  <th className="table-header text-left py-3">Check Out</th>
                  <th className="table-header text-left py-3">Hours</th>
                  <th className="table-header text-left py-3">Overtime</th>
                  <th className="table-header text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record, index) => (
                  <tr key={index} className="table-row">
                    <td className="py-3">
                      <div>
                        <p className="text-white font-medium">{record.name}</p>
                        <p className="text-xs text-slate-400">{record.empId}</p>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{record.department}</td>
                    <td className="py-3 text-slate-300">{record.checkIn}</td>
                    <td className="py-3 text-slate-300">{record.checkOut}</td>
                    <td className="py-3 text-white font-medium">{record.hours}h</td>
                    <td className="py-3">
                      {record.overtime > 0 ? (
                        <span className="text-green-400 font-medium">{record.overtime}h</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
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
    </div>
  )
}