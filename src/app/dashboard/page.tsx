'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  Wifi,
  RefreshCw,
  ChevronRight,
  UserCheck,
  UserX,
  LucideIcon
} from 'lucide-react'

// Type definitions
interface Stats {
  totalEmployees: number
  presentToday: number
  lateArrivals: number
  avgDailyHours: number
  employeeChange: string
  attendanceRate: string
  lateChange: string
  hoursChange: string
}

interface DeviceStatus {
  name: string
  status: string
  ipAddress: string
  lastSync: string
  totalEmployees: number
  lastActivity: string
}

interface RealtimeActivity {
  id: number
  name: string
  empId: string
  action: string
  time: string
  initials: string
  type: 'in' | 'out'
}

interface StatCardProps {
  title: string
  value: string | number
  change: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
}

// Mock data - replace with real API calls
const mockStats: Stats = {
  totalEmployees: 125,
  presentToday: 118,
  lateArrivals: 7,
  avgDailyHours: 8.2,
  employeeChange: '+2 this week',
  attendanceRate: '94.4% attendance',
  lateChange: '-3 from yesterday',
  hoursChange: '+0.3h this month'
}

const mockDeviceStatus: DeviceStatus = {
  name: 'ZKTECO K40 Pro',
  status: 'Online',
  ipAddress: '192.168.10.201:4370',
  lastSync: '2 minutes ago',
  totalEmployees: 125,
  lastActivity: 'John Doe - Check In'
}

const mockRealtimeActivity: RealtimeActivity[] = [
  { id: 1, name: 'Emma Brown', empId: 'EMP006', action: 'Check Out', time: '03:28:45', initials: 'EB', type: 'out' },
  { id: 2, name: 'David Wilson', empId: 'EMP005', action: 'Check Out', time: '03:28:39', initials: 'DW', type: 'out' },
  { id: 3, name: 'Chris Taylor', empId: 'EMP007', action: 'Check Out', time: '03:28:17', initials: 'CT', type: 'out' },
  { id: 4, name: 'Emma Brown', empId: 'EMP006', action: 'Check In', time: '03:27:17', initials: 'EB', type: 'in' },
  { id: 5, name: 'Chris Taylor', empId: 'EMP007', action: 'Check In', time: '03:26:17', initials: 'CT', type: 'in' },
]

interface AttendanceRecord {
  name: string
  empId: string
  checkIn: string
  checkOut: string
  hours: string
  status: string
  initials: string
}

const mockTodayAttendance: AttendanceRecord[] = [
  { name: 'John Doe', empId: 'EMP001', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: '8.5h', status: 'Present', initials: 'JD' },
  { name: 'Sarah Smith', empId: 'EMP002', checkIn: '09:45 AM', checkOut: '06:15 PM', hours: '8.2h', status: 'Late', initials: 'SS' },
  { name: 'Mike Johnson', empId: 'EMP003', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent', initials: 'MJ' },
  { name: 'Lisa Anderson', empId: 'EMP004', checkIn: '09:00 AM', checkOut: '04:30 PM', hours: '7.5h', status: 'Early', initials: 'LA' },
  { name: 'David Wilson', empId: 'EMP005', checkIn: '08:55 AM', checkOut: '06:05 PM', hours: '9.0h', status: 'Present', initials: 'DW' },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Removed unused state setters and added proper typing
  const stats = mockStats
  const deviceStatus = mockDeviceStatus
  const realtimeActivity = mockRealtimeActivity

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType = 'positive',
    icon: Icon 
  }: StatCardProps) => (
    <div className="stats-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">{title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-xs ${
          changeType === 'positive' ? 'text-green-400' : 
          changeType === 'negative' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {change}
        </span>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-skeleton h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="loading-skeleton h-80"></div>
          <div className="loading-skeleton h-80"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of today&apos;s attendance and device status</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          change={stats.employeeChange}
          icon={Users}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          change={stats.attendanceRate}
          icon={Calendar}
        />
        <StatCard
          title="Late Arrivals"
          value={stats.lateArrivals}
          change={stats.lateChange}
          changeType="negative"
          icon={Clock}
        />
        <StatCard
          title="Avg Daily Hours"
          value={`${stats.avgDailyHours}h`}
          change={stats.hoursChange}
          icon={TrendingUp}
        />
      </div>

      {/* Device Status & Real-time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Status */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Device Status</h2>
              <button className="btn-secondary flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" />
                Sync Now
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">{deviceStatus.name}</span>
                </div>
                <span className="device-online status-badge">Online</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">IP Address:</p>
                  <p className="text-white font-mono">{deviceStatus.ipAddress}</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Sync:</p>
                  <p className="text-white">{deviceStatus.lastSync}</p>
                </div>
                <div>
                  <p className="text-slate-400">Total Employees:</p>
                  <p className="text-white">{deviceStatus.totalEmployees}</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Activity:</p>
                  <p className="text-white">{deviceStatus.lastActivity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-white">Real-time Activity</h2>
          </div>
          <div className="card-content">
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {realtimeActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{activity.initials}</span>
                  </div>
                  {activity.type === 'in' ? (
                    <UserCheck className="w-4 h-4 text-green-400" />
                  ) : (
                    <UserX className="w-4 h-4 text-orange-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.name}</p>
                    <p className="text-xs text-slate-400">{activity.action} • {activity.time}</p>
                  </div>
                  <span className="text-xs text-slate-500">{activity.empId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Today&apos;s Attendance</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
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
                {mockTodayAttendance.map((record, index) => (
                  <tr key={index} className="table-row">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Manage Employees</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">View Attendance</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Generate Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}