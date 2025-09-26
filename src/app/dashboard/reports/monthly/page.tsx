'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  FileText,
  Download,
  ChevronRight,
  BarChart3
} from 'lucide-react'

// Type definitions
interface ReportSummary {
  title: string
  description: string
  period: string
  generated: string
  size: string
  icon: React.ElementType
  color: string
}

interface QuickStats {
  totalEmployees: number
  presentToday: number
  monthlyAverage: number
  totalHours: number
}

const mockReportData: ReportSummary[] = [
  {
    title: 'Daily Attendance Report',
    description: 'Complete daily attendance tracking with check-in/out times',
    period: 'Today - Jan 15, 2024',
    generated: '2 hours ago',
    size: '2.3 MB',
    icon: Calendar,
    color: 'text-blue-400'
  },
  {
    title: 'Weekly Summary Report',
    description: 'Weekly attendance patterns and productivity metrics',
    period: 'Jan 8-14, 2024',
    generated: '1 day ago',
    size: '5.7 MB',
    icon: BarChart3,
    color: 'text-green-400'
  },
  {
    title: 'Monthly Analysis Report',
    description: 'Comprehensive monthly performance and trend analysis',
    period: 'December 2023',
    generated: '3 days ago',
    size: '12.1 MB',
    icon: TrendingUp,
    color: 'text-purple-400'
  },
  {
    title: 'Overtime Report',
    description: 'Employee overtime hours and cost analysis',
    period: 'Last 30 days',
    generated: '1 week ago',
    size: '3.2 MB',
    icon: Clock,
    color: 'text-orange-400'
  },
  {
    title: 'Department Performance',
    description: 'Department-wise attendance and performance metrics',
    period: 'Q4 2023',
    generated: '2 weeks ago',
    size: '8.9 MB',
    icon: Users,
    color: 'text-teal-400'
  }
]

const mockQuickStats: QuickStats = {
  totalEmployees: 125,
  presentToday: 118,
  monthlyAverage: 94.2,
  totalHours: 22540
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const handleGenerateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report for ${selectedPeriod} period`)
    // In a real app, this would trigger report generation
    alert(`Generating ${reportType} report...`)
  }

  const handleDownloadReport = (reportTitle: string) => {
    console.log(`Downloading: ${reportTitle}`)
    // In a real app, this would initiate the download
    alert(`Downloading ${reportTitle}...`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 mt-1">Generate and download attendance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="hr">Human Resources</option>
            <option value="finance">Finance</option>
            <option value="operations">Operations</option>
          </select>
          <button 
            onClick={() => handleGenerateReport('custom')}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Total Employees</h3>
              <p className="text-2xl font-bold text-white">{mockQuickStats.totalEmployees}</p>
              <p className="text-xs text-blue-400">Active workforce</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Present Today</h3>
              <p className="text-2xl font-bold text-white">{mockQuickStats.presentToday}</p>
              <p className="text-xs text-green-400">Currently at work</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Monthly Average</h3>
              <p className="text-2xl font-bold text-white">{mockQuickStats.monthlyAverage}%</p>
              <p className="text-xs text-purple-400">Attendance rate</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-400" />
            <div>
              <h3 className="text-sm font-medium text-slate-400">Total Hours</h3>
              <p className="text-2xl font-bold text-white">{mockQuickStats.totalHours.toLocaleString()}</p>
              <p className="text-xs text-orange-400">This month</p>
            </div>
          </div>
        </div>
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
          <div className="space-y-4">
            {mockReportData.map((report, index) => {
              const IconComponent = report.icon
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <IconComponent className={`w-6 h-6 ${report.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{report.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{report.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{report.period}</span>
                        <span>•</span>
                        <span>Generated {report.generated}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownloadReport(report.title)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Generate New Report</h3>
          </div>
          <div className="card-content space-y-4">
            <button 
              onClick={() => handleGenerateReport('daily')}
              className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium text-white">Daily Attendance</p>
                  <p className="text-sm text-slate-400">Today&apos;s complete attendance report</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => handleGenerateReport('weekly')}
              className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium text-white">Weekly Summary</p>
                  <p className="text-sm text-slate-400">Last 7 days performance analysis</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => handleGenerateReport('monthly')}
              className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Monthly Analysis</p>
                  <p className="text-sm text-slate-400">Comprehensive monthly report</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => handleGenerateReport('custom')}
              className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-white">Custom Report</p>
                  <p className="text-sm text-slate-400">Configure your own report parameters</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-white">Report Insights</h3>
          </div>
          <div className="card-content space-y-4">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
              <p className="text-green-400 text-sm font-medium">Attendance Trend</p>
              <p className="text-slate-300 text-xs">Monthly attendance improved by 3.2% this quarter</p>
            </div>
            
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <p className="text-blue-400 text-sm font-medium">Most Requested</p>
              <p className="text-slate-300 text-xs">Weekly summary reports are downloaded 40% more often</p>
            </div>
            
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
              <p className="text-purple-400 text-sm font-medium">Department Focus</p>
              <p className="text-slate-300 text-xs">Engineering dept shows highest productivity metrics</p>
            </div>
            
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
              <p className="text-orange-400 text-sm font-medium">Peak Hours</p>
              <p className="text-slate-300 text-xs">Most check-ins occur between 8:30-9:15 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Reports */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">Scheduled Reports</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Daily Digest</h4>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">Automated daily attendance summary</p>
              <div className="text-xs text-slate-500">
                <p>Frequency: Daily at 6:00 PM</p>
                <p>Recipients: HR Team</p>
                <p>Next: Today, 6:00 PM</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Weekly Summary</h4>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">Weekly performance overview</p>
              <div className="text-xs text-slate-500">
                <p>Frequency: Every Friday</p>
                <p>Recipients: Management</p>
                <p>Next: Friday, 5:00 PM</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Monthly Report</h4>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Paused</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">Comprehensive monthly analysis</p>
              <div className="text-xs text-slate-500">
                <p>Frequency: Last day of month</p>
                <p>Recipients: All Managers</p>
                <p>Next: Jan 31, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}