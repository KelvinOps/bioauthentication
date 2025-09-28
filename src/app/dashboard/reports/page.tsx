'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  Clock, 
  BarChart3,
  ChevronRight
} from 'lucide-react'

const reportTypes = [
  {
    id: 'daily',
    title: 'Daily Reports',
    description: 'View daily attendance summaries and individual employee records',
    icon: Calendar,
    color: 'blue',
    href: '/dashboard/reports/daily'
  },
  {
    id: 'monthly',
    title: 'Monthly Reports',
    description: 'Comprehensive monthly attendance analysis and statistics',
    icon: BarChart3,
    color: 'green',
    href: '/dashboard/reports/monthly'
  },
  {
    id: 'custom',
    title: 'Custom Reports',
    description: 'Create custom reports with specific date ranges and filters',
    icon: FileText,
    color: 'purple',
    href: '/dashboard/reports/custom'
  },
  {
    id: 'export',
    title: 'Export Center',
    description: 'Export attendance data in various formats (Excel, PDF, CSV)',
    icon: Download,
    color: 'orange',
    href: '/dashboard/reports/export'
  }
]

const quickStats = [
  { label: 'Reports Generated', value: '127', change: '+12%', color: 'text-blue-400' },
  { label: 'Avg Attendance', value: '94.2%', change: '+2.1%', color: 'text-green-400' },
  { label: 'Total Hours', value: '2,856h', change: '+156h', color: 'text-purple-400' },
  { label: 'Active Employees', value: '125', change: '+3', color: 'text-orange-400' }
]

const recentReports = [
  {
    id: 1,
    title: 'Monthly Attendance - January 2024',
    type: 'Monthly',
    generatedBy: 'Admin',
    date: '2024-01-31',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 2,
    title: 'Daily Report - January 15, 2024',
    type: 'Daily',
    generatedBy: 'HR Manager',
    date: '2024-01-15',
    size: '856 KB',
    format: 'Excel'
  },
  {
    id: 3,
    title: 'Overtime Report - Week 3',
    type: 'Custom',
    generatedBy: 'Admin',
    date: '2024-01-21',
    size: '1.2 MB',
    format: 'PDF'
  },
  {
    id: 4,
    title: 'Department Wise - Engineering',
    type: 'Custom',
    generatedBy: 'Team Lead',
    date: '2024-01-20',
    size: '1.8 MB',
    format: 'Excel'
  }
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 mt-1">Generate and manage attendance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Quick Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-400">{stat.label}</h3>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className={`text-xs ${stat.color} mt-1`}>{stat.change} from last period</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const IconComponent = report.icon
          return (
            <Link key={report.id} href={report.href}>
              <div className="card hover:bg-slate-900/70 transition-all duration-200 cursor-pointer group">
                <div className="card-content">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      report.color === 'blue' ? 'bg-blue-500/10' :
                      report.color === 'green' ? 'bg-green-500/10' :
                      report.color === 'purple' ? 'bg-purple-500/10' :
                      'bg-orange-500/10'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        report.color === 'blue' ? 'text-blue-400' :
                        report.color === 'green' ? 'text-green-400' :
                        report.color === 'purple' ? 'text-purple-400' :
                        'text-orange-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">{report.description}</p>
                      <div className="flex items-center text-blue-400 text-sm font-medium">
                        <span>Generate Report</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
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
                  <th className="table-header text-left py-3">Report Name</th>
                  <th className="table-header text-left py-3">Type</th>
                  <th className="table-header text-left py-3">Generated By</th>
                  <th className="table-header text-left py-3">Date</th>
                  <th className="table-header text-left py-3">Size</th>
                  <th className="table-header text-left py-3">Format</th>
                  <th className="table-header text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="table-row">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium">{report.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400">{report.type}</td>
                    <td className="py-4 text-slate-400">{report.generatedBy}</td>
                    <td className="py-4 text-slate-400">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-slate-400">{report.size}</td>
                    <td className="py-4">
                      <span className="status-badge status-present">{report.format}</span>
                    </td>
                    <td className="py-4">
                      <button className="btn-secondary text-xs py-1 px-3 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popular Report Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Popular Templates</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Late Arrivals Report</p>
                    <p className="text-xs text-slate-400">Track employees with late arrivals</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Overtime Summary</p>
                    <p className="text-xs text-slate-400">Weekly overtime hours breakdown</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Department Analysis</p>
                    <p className="text-xs text-slate-400">Attendance by department comparison</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <button className="w-full btn-secondary justify-start">
                <Calendar className="w-4 h-4 mr-3" />
                Generate Today&apos;s Report
              </button>
              <button className="w-full btn-secondary justify-start">
                <BarChart3 className="w-4 h-4 mr-3" />
                Weekly Summary
              </button>
              <button className="w-full btn-secondary justify-start">
                <FileText className="w-4 h-4 mr-3" />
                Custom Date Range
              </button>
              <button className="w-full btn-secondary justify-start">
                <Download className="w-4 h-4 mr-3" />
                Bulk Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}