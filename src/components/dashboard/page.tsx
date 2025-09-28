'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/components/dashboard/StatsCard'
import RealtimeAttendance from '@/components/dashboard/RealtimeAttendance'
import AttendanceSummary from '@/components/dashboard/AttendanceSummary'
import DeviceStatus from '@/components/dashboard/DeviceStatus'
import QuickActions from '@/components/dashboard/QuickActions'
import {
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react'

interface DashboardStats {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateArrivals: number
  totalAttendanceRecords: number
  deviceStatus: 'online' | 'offline'
  lastSync: Date
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateArrivals: 0,
    totalAttendanceRecords: 0,
    deviceStatus: 'online',
    lastSync: new Date()
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalEmployees: 125,
          presentToday: 98,
          absentToday: 27,
          lateArrivals: 5,
          totalAttendanceRecords: 15420,
          deviceStatus: 'online',
          lastSync: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const attendanceRate = stats.totalEmployees > 0 
    ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your attendance system today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees.toString()}
          change="+2 this month"
          changeType="positive"
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday.toString()}
          change={`${attendanceRate}% attendance`}
          changeType="positive"
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Absent Today"
          value={stats.absentToday.toString()}
          change={`${Math.round((stats.absentToday / stats.totalEmployees) * 100)}% absent`}
          changeType="negative"
          icon={<XCircle className="h-6 w-6" />}
          color="red"
        />
        <StatsCard
          title="Late Arrivals"
          value={stats.lateArrivals.toString()}
          change="↓ 2 from yesterday"
          changeType="positive"
          icon={<AlertCircle className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Summary - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AttendanceSummary />
        </div>

        {/* Device Status - Takes 1 column */}
        <div className="space-y-6">
          <DeviceStatus />
          <QuickActions />
        </div>
      </div>

      {/* Real-time Attendance */}
      <div className="grid grid-cols-1 gap-6">
        <RealtimeAttendance />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Check-in Time
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                8:47 AM
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 dark:text-green-400">
              ↑ 5 minutes earlier than last week
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                This Month&apos;s Attendance
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                94.2%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 dark:text-green-400">
              ↑ 2.1% from last month
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                System Uptime
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                99.8%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last 30 days
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}