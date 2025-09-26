'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Users, Clock, Download } from 'lucide-react'

interface AttendanceRecord {
  id: number
  name: string
  empId: string
  checkIn: string
  checkOut: string
  hours: string
  status: string
  initials: string
  breaks?: { start: string; end: string; duration: string }[]
  overtime?: string
}

// Mock data for specific date
const mockDateAttendance: AttendanceRecord[] = [
  {
    id: 1,
    name: 'John Doe',
    empId: 'EMP001',
    checkIn: '08:45 AM',
    checkOut: '05:30 PM',
    hours: '8.5h',
    status: 'Present',
    initials: 'JD',
    breaks: [
      { start: '12:00 PM', end: '01:00 PM', duration: '1h' },
      { start: '03:15 PM', end: '03:30 PM', duration: '15m' }
    ],
    overtime: '0.5h'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    empId: 'EMP002',
    checkIn: '09:15 AM',
    checkOut: '06:00 PM',
    hours: '8.2h',
    status: 'Late',
    initials: 'SS',
    breaks: [
      { start: '12:30 PM', end: '01:30 PM', duration: '1h' }
    ]
  },
  {
    id: 3,
    name: 'Mike Johnson',
    empId: 'EMP003',
    checkIn: '-',
    checkOut: '-',
    hours: '-',
    status: 'Absent',
    initials: 'MJ'
  }
]

export default function AttendanceDatePage() {
  const params = useParams()
  const router = useRouter()
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    // Parse date from params
    const dateParam = params.date as string
    if (dateParam) {
      // Convert date param to readable format
      const formattedDate = new Date(dateParam).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      setSelectedDate(formattedDate)
    }

    // Load attendance data for specific date
    const timer = setTimeout(() => {
      setAttendanceData(mockDateAttendance)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [params.date])

  const stats = {
    totalEmployees: 125,
    present: attendanceData.filter(r => r.status === 'Present').length,
    late: attendanceData.filter(r => r.status === 'Late').length,
    absent: attendanceData.filter(r => r.status === 'Absent').length,
    early: attendanceData.filter(r => r.status === 'Early').length
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="loading-skeleton h-16"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-skeleton h-24"></div>
          ))}
        </div>
        <div className="loading-skeleton h-96"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Attendance Details</h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {selectedDate}
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Day Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Total Employees</h3>
              <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400">Present</h3>
              <p className="text-2xl font-bold text-green-400">{stats.present}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400">Late</h3>
              <p className="text-2xl font-bold text-yellow-400">{stats.late}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400">Absent</h3>
              <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Attendance Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-white">Detailed Attendance Records</h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="table-header text-left py-3">Employee</th>
                  <th className="table-header text-left py-3">Check In</th>
                  <th className="table-header text-left py-3">Check Out</th>
                  <th className="table-header text-left py-3">Break Time</th>
                  <th className="table-header text-left py-3">Work Hours</th>
                  <th className="table-header text-left py-3">Overtime</th>
                  <th className="table-header text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id} className="table-row">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{record.initials}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{record.name}</p>
                          <p className="text-xs text-slate-400">{record.empId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-300">{record.checkIn}</td>
                    <td className="py-4 text-slate-300">{record.checkOut}</td>
                    <td className="py-4">
                      {record.breaks && record.breaks.length > 0 ? (
                        <div className="space-y-1">
                          {record.breaks.map((breakItem, index) => (
                            <div key={index} className="text-xs text-slate-400">
                              {breakItem.start} - {breakItem.end} ({breakItem.duration})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4 text-slate-300 font-medium">{record.hours}</td>
                    <td className="py-4">
                      {record.overtime ? (
                        <span className="text-green-400 font-medium">{record.overtime}</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4">
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

      {/* Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Day Summary</h3>
          </div>
          <div className="card-content space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Attendance Rate:</span>
              <span className="text-white font-medium">
                {((stats.present + stats.late) / stats.totalEmployees * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">On-Time Arrival:</span>
              <span className="text-white font-medium">
                {(stats.present / stats.totalEmployees * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Average Hours:</span>
              <span className="text-white font-medium">8.2h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Overtime:</span>
              <span className="text-green-400 font-medium">2.5h</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="card-content space-y-3">
            <button className="w-full btn-secondary justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </button>
            <button className="w-full btn-secondary justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              View Previous Day
            </button>
            <button className="w-full btn-secondary justify-start">
              <Users className="w-4 h-4 mr-2" />
              Send Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}