'use client'

import { useState, useEffect } from 'react'
import { Calendar, Filter, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react'

// Mock attendance data
const mockAttendanceData = [
  { id: 1, name: 'John Doe', empId: 'EMP001', date: '2024-01-15', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: '8.5h', status: 'Present', initials: 'JD' },
  { id: 2, name: 'Sarah Smith', empId: 'EMP002', date: '2024-01-15', checkIn: '09:45 AM', checkOut: '06:15 PM', hours: '8.2h', status: 'Late', initials: 'SS' },
  { id: 3, name: 'Mike Johnson', empId: 'EMP003', date: '2024-01-15', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent', initials: 'MJ' },
  { id: 4, name: 'Lisa Anderson', empId: 'EMP004', date: '2024-01-15', checkIn: '09:00 AM', checkOut: '04:30 PM', hours: '7.5h', status: 'Early', initials: 'LA' },
  { id: 5, name: 'David Wilson', empId: 'EMP005', date: '2024-01-15', checkIn: '08:55 AM', checkOut: '06:05 PM', hours: '9.0h', status: 'Present', initials: 'DW' },
  { id: 6, name: 'Emma Brown', empId: 'EMP006', date: '2024-01-15', checkIn: '09:10 AM', checkOut: '05:45 PM', hours: '8.3h', status: 'Present', initials: 'EB' },
  { id: 7, name: 'Chris Taylor', empId: 'EMP007', date: '2024-01-15', checkIn: '10:15 AM', checkOut: '06:20 PM', hours: '7.8h', status: 'Late', initials: 'CT' },
  { id: 8, name: 'Amanda Davis', empId: 'EMP008', date: '2024-01-15', checkIn: '08:45 AM', checkOut: '05:50 PM', hours: '9.0h', status: 'Present', initials: 'AD' },
]

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData)
  const [filteredData, setFilteredData] = useState(mockAttendanceData)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = attendanceData

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.empId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => 
        record.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [searchTerm, statusFilter, attendanceData])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting attendance data...')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-16"></div>
        <div className="loading-skeleton h-96"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance</h1>
          <p className="text-slate-400 mt-1">Manage and view employee attendance records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
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
                  placeholder="Search by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
                <option value="early">Early</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Attendance Records ({filteredData.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              January 15, 2024
            </div>
          </div>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="table-header text-left py-3">Employee</th>
                  <th className="table-header text-left py-3">Employee ID</th>
                  <th className="table-header text-left py-3">Date</th>
                  <th className="table-header text-left py-3">Check In</th>
                  <th className="table-header text-left py-3">Check Out</th>
                  <th className="table-header text-left py-3">Total Hours</th>
                  <th className="table-header text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{record.initials}</span>
                          </div>
                          <span className="text-white font-medium">{record.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-400">{record.empId}</td>
                      <td className="py-4 text-slate-400">Jan 15, 2024</td>
                      <td className="py-4 text-slate-300">{record.checkIn}</td>
                      <td className="py-4 text-slate-300">{record.checkOut}</td>
                      <td className="py-4 text-slate-300">{record.hours}</td>
                      <td className="py-4">
                        <span className={`status-badge status-${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No attendance records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
              <div className="text-sm text-slate-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}