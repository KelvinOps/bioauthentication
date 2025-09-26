'use client'

import { useState } from 'react'
import { Calendar, Download, TrendingUp, Users, Clock, BarChart3 } from 'lucide-react'

const mockMonthlyData = {
  month: 'January 2024',
  workingDays: 22,
  stats: {
    totalEmployees: 125,
    averageAttendance: 94.2,
    totalWorkingHours: 22540,
    totalOvertimeHours: 1248,
    perfectAttendees: 42,
    averageCheckIn: '09:08 AM',
    averageCheckOut: '05:52 PM'
  },
  dailyAttendance: [
    { date: '2024-01-01', present: 0, absent: 0, late: 0, workingDay: false },
    { date: '2024-01-02', present: 118, absent: 4, late: 3, workingDay: true },
    { date: '2024-01-03', present: 122, absent: 2, late: 1, workingDay: true },
    { date: '2024-01-04', present: 115, absent: 7, late: 3, workingDay: true },
    { date: '2024-01-05', present: 120, absent: 3, late: 2, workingDay: true },
    // ... more days
  ],
  employeeStats: [
    { empId: 'EMP001', name: 'John Doe', department: 'Engineering', workingDays: 22, presentDays: 21, lateDays: 2, absentDays: 1, totalHours: 184.5, overtime: 12.5, attendanceRate: 95.5 },
    { empId: 'EMP002', name: 'Sarah Smith', department: 'Marketing', workingDays: 22, presentDays: 22, lateDays: 3, absentDays: 0, totalHours: 176.0, overtime: 8.0, attendanceRate: 100 },
    { empId: 'EMP003', name: 'Mike Johnson', department: 'HR', workingDays: 22, presentDays: 18, lateDays: 1, absentDays: 4, totalHours: 144.0, overtime: 2.0, attendanceRate: 81.8 },
  ],
  departmentStats: [
    { department: 'Engineering', employees: 35, avgAttendance: 94.3, totalHours: 6580, overtime: 385 },
    { department: 'Marketing', employees: 20, avgAttendance: 96.8, totalHours: 3520, overtime: 180 },
    { department: 'HR', employees: 15, avgAttendance: 91.2, totalHours: 2640, overtime: 95 },
    { department: 'Finance', employees: 25, avgAttendance: 97.1, totalHours: 4400, overtime: 220 },
    { department: 'Operations', employees: 30, avgAttendance: 92.8, totalHours: 5400, overtime: 368 },
  ]
}

export default function MonthlyReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-01')
  const [viewType, setViewType] = useState('summary')

  const data = mockMonthlyData

  const handleExport = (format: string) => {
    console.log(`Exporting monthly report for ${selectedMonth} in ${format} format`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Monthly Reports</h1>
          <p className="text-slate-400 mt-1">Comprehensive monthly attendance analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="summary">Summary View</option>
            <option value="detailed">Detailed View</option>
            <option value="department">Department View</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Month Header */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">{data.month}</h2>
                <p className="text-slate-400">{data.workingDays} working days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{data.stats.averageAttendance}%</p>
              <p className="text-slate-400 text-sm">Average Attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Total Employees</h3>
              <p className="text-2xl font-bold text-white">{data.stats.totalEmployees}</p>
              <p className="text-xs text-blue-400">Active workforce</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Working Hours</h3>
              <p className="text-2xl font-bold text-white">{data.stats.totalWorkingHours.toLocaleString()}</p>
              <p className="text-xs text-green-400">Total hours worked</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Overtime Hours</h3>
              <p className="text-2xl font-bold text-white">{data.stats.totalOvertimeHours}</p>
              <p className="text-xs text-purple-400">Additional hours</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Perfect Attendance</h3>
              <p className="text-2xl font-bold text-white">{data.stats.perfectAttendees}</p>
              <p className="text-xs text-yellow-400">No absences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Average Timings</h3>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Average Check-in Time:</span>
              <span className="text-white font-medium">{data.stats.averageCheckIn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Average Check-out Time:</span>
              <span className="text-white font-medium">{data.stats.averageCheckOut}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Average Daily Hours:</span>
              <span className="text-white font-medium">
                {(data.stats.totalWorkingHours / (data.stats.totalEmployees * data.workingDays)).toFixed(1)}h
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Overtime per Employee:</span>
              <span className="text-white font-medium">
                {(data.stats.totalOvertimeHours / data.stats.totalEmployees).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Attendance Trends</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Present Rate</span>
                  <span className="text-white">{data.stats.averageAttendance}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${data.stats.averageAttendance}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">On-time Rate</span>
                  <span className="text-white">87.3%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: '87.3%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Overtime Utilization</span>
                  <span className="text-white">5.5%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: '5.5%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-white">Department Performance</h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="table-header text-left py-3">Department</th>
                  <th className="table-header text-left py-3">Employees</th>
                  <th className="table-header text-left py-3">Avg Attendance</th>
                  <th className="table-header text-left py-3">Total Hours</th>
                  <th className="table-header text-left py-3">Overtime Hours</th>
                  <th className="table-header text-left py-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {data.departmentStats.map((dept, index) => (
                  <tr key={index} className="table-row">
                    <td className="py-3 text-white font-medium">{dept.department}</td>
                    <td className="py-3 text-slate-300">{dept.employees}</td>
                    <td className="py-3">
                      <span className={`font-medium ${
                        dept.avgAttendance >= 95 ? 'text-green-400' : 
                        dept.avgAttendance >= 90 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {dept.avgAttendance}%
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{dept.totalHours.toLocaleString()}h</td>
                    <td className="py-3 text-purple-400">{dept.overtime}h</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              dept.avgAttendance >= 95 ? 'bg-green-500' : 
                              dept.avgAttendance >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${dept.avgAttendance}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          dept.avgAttendance >= 95 ? 'text-green-400' : 
                          dept.avgAttendance >= 90 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {dept.avgAttendance >= 95 ? 'Excellent' : 
                           dept.avgAttendance >= 90 ? 'Good' : 'Needs Improvement'}
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

      {/* Employee Details (if detailed view) */}
      {viewType === 'detailed' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-white">Employee Performance Details</h2>
          </div>
          <div className="card-content">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="table-header text-left py-3">Employee</th>
                    <th className="table-header text-left py-3">Department</th>
                    <th className="table-header text-left py-3">Present Days</th>
                    <th className="table-header text-left py-3">Late Days</th>
                    <th className="table-header text-left py-3">Absent Days</th>
                    <th className="table-header text-left py-3">Total Hours</th>
                    <th className="table-header text-left py-3">Overtime</th>
                    <th className="table-header text-left py-3">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.employeeStats.map((emp, index) => (
                    <tr key={index} className="table-row">
                      <td className="py-3">
                        <div>
                          <p className="text-white font-medium">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.empId}</p>
                        </div>
                      </td>
                      <td className="py-3 text-slate-300">{emp.department}</td>
                      <td className="py-3 text-green-400">{emp.presentDays}</td>
                      <td className="py-3 text-yellow-400">{emp.lateDays}</td>
                      <td className="py-3 text-red-400">{emp.absentDays}</td>
                      <td className="py-3 text-slate-300">{emp.totalHours}h</td>
                      <td className="py-3 text-purple-400">{emp.overtime}h</td>
                      <td className="py-3">
                        <span className={`font-medium ${
                          emp.attendanceRate >= 95 ? 'text-green-400' : 
                          emp.attendanceRate >= 90 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {emp.attendanceRate}%
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Top Performers</h3>
          </div>
          <div className="card-content space-y-3">
            {data.employeeStats
              .sort((a, b) => b.attendanceRate - a.attendanceRate)
              .slice(0, 3)
              .map((emp, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                  <span className="text-white text-sm">{emp.name}</span>
                  <span className="text-green-400 font-medium text-sm">{emp.attendanceRate}%</span>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Overtime Leaders</h3>
          </div>
          <div className="card-content space-y-3">
            {data.employeeStats
              .sort((a, b) => b.overtime - a.overtime)
              .slice(0, 3)
              .map((emp, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                  <span className="text-white text-sm">{emp.name}</span>
                  <span className="text-purple-400 font-medium text-sm">{emp.overtime}h</span>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Key Insights</h3>
          </div>
          <div className="card-content space-y-3">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
              <p className="text-green-400 text-sm font-medium">Positive Trend</p>
              <p className="text-slate-300 text-xs">Attendance improved by 2.1% vs last month</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <p className="text-blue-400 text-sm font-medium">Overtime Control</p>
              <p className="text-slate-300 text-xs">Overtime within acceptable limits (5.5%)</p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <p className="text-yellow-400 text-sm font-medium">Attention Needed</p>
              <p className="text-slate-300 text-xs">3 employees below 85% attendance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}