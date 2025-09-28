'use client'

import { useState } from 'react'
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  Settings, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react'

const exportFormats = [
  {
    id: 'excel',
    name: 'Excel (.xlsx)',
    description: 'Best for data analysis and calculations',
    icon: FileText,
    color: 'green'
  },
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Perfect for printing and sharing',
    icon: FileText,
    color: 'red'
  },
  {
    id: 'csv',
    name: 'CSV File',
    description: 'Universal format for data import/export',
    icon: FileText,
    color: 'blue'
  }
]

const reportTemplates = [
  {
    id: 'daily_attendance',
    name: 'Daily Attendance Report',
    description: 'Complete daily attendance with check-in/out times',
    fields: ['Employee Name', 'Employee ID', 'Check In', 'Check Out', 'Total Hours', 'Status'],
    category: 'Daily'
  },
  {
    id: 'monthly_summary',
    name: 'Monthly Summary Report',
    description: 'Monthly attendance statistics and analysis',
    fields: ['Employee Name', 'Department', 'Present Days', 'Absent Days', 'Late Days', 'Total Hours'],
    category: 'Monthly'
  },
  {
    id: 'overtime_report',
    name: 'Overtime Report',
    description: 'Detailed overtime hours and calculations',
    fields: ['Employee Name', 'Regular Hours', 'Overtime Hours', 'Total Hours', 'Overtime Pay'],
    category: 'Special'
  },
  {
    id: 'department_analysis',
    name: 'Department Analysis',
    description: 'Department-wise attendance comparison',
    fields: ['Department', 'Total Employees', 'Average Attendance', 'Total Hours', 'Performance'],
    category: 'Analysis'
  }
]

export default function ExportPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('daily_attendance')
  const [selectedFormat, setSelectedFormat] = useState('excel')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [filters, setFilters] = useState({
    departments: [],
    employees: [],
    status: 'all'
  })
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeStatistics: true,
    includeHeader: true,
    includeFooter: true,
    companyLogo: true
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)

  const selectedTemplateData = reportTemplates.find(t => t.id === selectedTemplate)

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    try {
      // Simulate export progress
      const intervals = [20, 40, 60, 80, 100]
      for (const progress of intervals) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setExportProgress(progress)
      }

      // Simulate API call to export
      const response = await fetch(`/api/attendance/export/${selectedFormat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          dateRange,
          filters,
          options: exportOptions
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance-report-${selectedTemplate}.${selectedFormat}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        setExportComplete(true)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
        setExportComplete(false)
      }, 2000)
    }
  }

  const isValidDateRange = dateRange.from && dateRange.to && new Date(dateRange.from) <= new Date(dateRange.to)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Export Center</h1>
          <p className="text-slate-400 mt-1">Export attendance data in various formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Template Selection */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Select Report Template
              </h2>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium">{template.name}</h3>
                      <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{template.description}</p>
                    <div className="text-xs text-slate-500">
                      {template.fields.length} fields included
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Format
              </h2>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exportFormats.map((format) => {
                  const IconComponent = format.icon
                  return (
                    <div
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedFormat === format.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className={`w-5 h-5 ${
                          format.color === 'green' ? 'text-green-400' :
                          format.color === 'red' ? 'text-red-400' :
                          'text-blue-400'
                        }`} />
                        <h3 className="text-white font-medium">{format.name}</h3>
                      </div>
                      <p className="text-slate-400 text-sm">{format.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date Range
              </h2>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-300 mb-3">Quick Select:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Yesterday', days: 1 },
                    { label: 'Last 7 Days', days: 7 },
                    { label: 'Last 30 Days', days: 30 },
                    { label: 'This Month', days: 'month' },
                    { label: 'Last Month', days: 'lastMonth' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const today = new Date()
                        const from = new Date()
                        
                        if (preset.days === 'month') {
                          from.setDate(1)
                        } else if (preset.days === 'lastMonth') {
                          from.setMonth(today.getMonth() - 1, 1)
                          today.setDate(0) // Last day of previous month
                        } else if (typeof preset.days === 'number') {
                          from.setDate(today.getDate() - preset.days)
                        }

                        setDateRange({
                          from: from.toISOString().split('T')[0],
                          to: today.toISOString().split('T')[0]
                        })
                      }}
                      className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Options
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Department Filter
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Departments</option>
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status Filter
                  </label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present Only</option>
                    <option value="absent">Absent Only</option>
                    <option value="late">Late Only</option>
                  </select>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Export Options
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'includeCharts', label: 'Include Charts & Graphs', icon: BarChart3 },
                    { key: 'includeStatistics', label: 'Include Statistics Summary', icon: CheckCircle },
                    { key: 'includeHeader', label: 'Include Report Header', icon: FileText },
                    { key: 'includeFooter', label: 'Include Report Footer', icon: FileText },
                    { key: 'companyLogo', label: 'Include Company Logo', icon: Settings }
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={exportOptions[key as keyof typeof exportOptions]}
                        onChange={(e) => setExportOptions(prev => ({ 
                          ...prev, 
                          [key]: e.target.checked 
                        }))}
                        className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor={key} className="ml-3 flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <Icon className="w-4 h-4" />
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Preview & Actions */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white">Export Preview</h2>
            </div>
            <div className="card-content space-y-4">
              {selectedTemplateData && (
                <div>
                  <h3 className="text-white font-medium mb-2">{selectedTemplateData.name}</h3>
                  <p className="text-slate-400 text-sm mb-3">{selectedTemplateData.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-300">Fields to include:</p>
                    <div className="space-y-1">
                      {selectedTemplateData.fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-slate-400">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-700 pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format:</span>
                    <span className="text-white">{exportFormats.find(f => f.id === selectedFormat)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date Range:</span>
                    <span className="text-white">
                      {dateRange.from && dateRange.to 
                        ? `${dateRange.from} to ${dateRange.to}`
                        : 'Not selected'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={isValidDateRange ? "text-green-400" : "text-red-400"}>
                      {isValidDateRange ? "Ready to export" : "Select date range"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="card">
              <div className="card-content">
                <div className="flex items-center gap-3 mb-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="text-white font-medium">Exporting...</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 mt-2">{exportProgress}% complete</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {exportComplete && (
            <div className="card border-green-500/20 bg-green-500/10">
              <div className="card-content">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Export Completed!</p>
                    <p className="text-green-400 text-sm">Your report has been downloaded successfully.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Actions */}
          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={!isValidDateRange || isExporting}
              className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </button>

            {!isValidDateRange && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                Please select a valid date range
              </div>
            )}

            <button className="w-full btn btn-secondary flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Schedule Export
            </button>
          </div>

          {/* Recent Exports */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white">Recent Exports</h2>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {[
                  { name: 'Daily Report - Oct 2024', format: 'Excel', date: '2024-10-25', size: '2.4 MB' },
                  { name: 'Monthly Summary - Sep', format: 'PDF', date: '2024-10-01', size: '1.8 MB' },
                  { name: 'Overtime Report - Q3', format: 'CSV', date: '2024-09-30', size: '856 KB' }
                ].map((export_item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">{export_item.name}</p>
                      <p className="text-slate-400 text-xs">{export_item.format} • {export_item.size}</p>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}