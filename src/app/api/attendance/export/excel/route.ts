import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import ExcelJS from 'exceljs'

const prisma = new PrismaClient()

interface AttendanceRecord {
  id: string
  employeeId: string
  timestamp: Date
  type: string
  method: string
  deviceId?: string | null
  employee: {
    id: string
    userId: string
    name: string
    department?: string | null
    position?: string | null
    cardNumber?: string | null
  }
}

interface RequestBody {
  startDate?: string
  endDate?: string
  employeeIds?: string[]
  includeDetails?: boolean
  format?: 'detailed' | 'summary' | 'timesheet'
}

interface AttendanceWhere {
  timestamp?: {
    gte: Date
    lte: Date
  }
  employeeId?: {
    in: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { 
      startDate, 
      endDate, 
      employeeIds,
      format = 'detailed'
    } = body

    // Build query filters
    const where: AttendanceWhere = {}
    
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (employeeIds && employeeIds.length > 0) {
      where.employeeId = {
        in: employeeIds
      }
    }

    // Fetch attendance data
    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            userId: true,
            name: true,
            department: true,
            position: true,
            cardNumber: true
          }
        }
      },
      orderBy: [
        { employee: { name: 'asc' } },
        { timestamp: 'asc' }
      ]
    }) as AttendanceRecord[]

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'ZKTECO Attendance System'
    workbook.created = new Date()

    // Generate export based on format
    switch (format) {
      case 'summary':
        await createSummarySheet(workbook, attendanceRecords, startDate, endDate)
        break
      case 'timesheet':
        await createTimesheetSheet(workbook, attendanceRecords, startDate, endDate)
        break
      default:
        await createDetailedSheet(workbook, attendanceRecords, startDate, endDate)
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Create filename
    const dateRange = startDate && endDate 
      ? `_${new Date(startDate).toISOString().split('T')[0]}_to_${new Date(endDate).toISOString().split('T')[0]}`
      : `_${new Date().toISOString().split('T')[0]}`
    
    const filename = `attendance_${format}${dateRange}.xlsx`

    // Return file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate Excel file' },
      { status: 500 }
    )
  }
}

async function createDetailedSheet(
  workbook: ExcelJS.Workbook, 
  records: AttendanceRecord[], 
  startDate?: string, 
  endDate?: string
) {
  const worksheet = workbook.addWorksheet('Detailed Attendance')

  // Set column headers
  const headers = [
    'Employee ID',
    'Employee Name',
    'Department',
    'Position',
    'Card Number',
    'Date',
    'Time',
    'Type',
    'Method',
    'Device ID'
  ]

  worksheet.addRow(headers)

  // Style header row
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  }
  headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true }

  // Add data rows
  records.forEach(record => {
    worksheet.addRow([
      record.employee.userId,
      record.employee.name,
      record.employee.department || 'N/A',
      record.employee.position || 'N/A',
      record.employee.cardNumber || 'N/A',
      record.timestamp.toLocaleDateString(),
      record.timestamp.toLocaleTimeString(),
      formatAttendanceType(record.type),
      formatAttendanceMethod(record.method),
      record.deviceId || 'N/A'
    ])
  })

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    if (column.header) {
      column.width = Math.max(12, Math.min(50, column.header.length || 12))
    }
  })

  // Add title and summary with date range info
  worksheet.insertRow(1, [`Attendance Report - Detailed`])
  worksheet.insertRow(2, [`Generated: ${new Date().toLocaleString()}`])
  if (startDate && endDate) {
    worksheet.insertRow(3, [`Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`])
  }
  worksheet.insertRow(4, [`Total Records: ${records.length}`])
  worksheet.insertRow(5, []) // Empty row

  // Style title
  const titleRow = worksheet.getRow(1)
  titleRow.font = { size: 16, bold: true }
  
  // Merge title cell
  worksheet.mergeCells(1, 1, 1, headers.length)
}

interface SummaryEntry {
  employee: AttendanceRecord['employee']
  date: string
  checkIn: string | null
  checkOut: string | null
  totalHours: number
  status: string
}

async function createSummarySheet(
  workbook: ExcelJS.Workbook, 
  records: AttendanceRecord[], 
  startDate?: string, 
  endDate?: string
) {
  const worksheet = workbook.addWorksheet('Attendance Summary')

  // Add report header with date range
  worksheet.addRow(['Attendance Summary Report'])
  worksheet.addRow([`Generated: ${new Date().toLocaleString()}`])
  if (startDate && endDate) {
    worksheet.addRow([`Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`])
  }
  worksheet.addRow([]) // Empty row

  // Group records by employee and date
  const summary = new Map<string, SummaryEntry>()
  
  records.forEach(record => {
    const key = `${record.employee.userId}-${record.timestamp.toDateString()}`
    if (!summary.has(key)) {
      summary.set(key, {
        employee: record.employee,
        date: record.timestamp.toDateString(),
        checkIn: null,
        checkOut: null,
        totalHours: 0,
        status: 'Present'
      })
    }

    const entry = summary.get(key)!
    if (record.type === 'CHECK_IN' && !entry.checkIn) {
      entry.checkIn = record.timestamp.toLocaleTimeString()
    } else if (record.type === 'CHECK_OUT' && !entry.checkOut) {
      entry.checkOut = record.timestamp.toLocaleTimeString()
    }
  })

  // Calculate total hours for each entry
  summary.forEach(entry => {
    if (entry.checkIn && entry.checkOut) {
      const checkInTime = new Date(`${entry.date} ${entry.checkIn}`)
      const checkOutTime = new Date(`${entry.date} ${entry.checkOut}`)
      entry.totalHours = Math.max(0, (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60))
    }
  })

  const headers = [
    'Employee ID',
    'Employee Name',
    'Department',
    'Date',
    'Check In',
    'Check Out',
    'Total Hours',
    'Status'
  ]

  worksheet.addRow(headers)

  // Style header
  const headerRow = worksheet.getRow(worksheet.rowCount)
  headerRow.font = { bold: true }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF70AD47' }
  }
  headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true }

  // Add summary data
  Array.from(summary.values()).forEach(entry => {
    worksheet.addRow([
      entry.employee.userId,
      entry.employee.name,
      entry.employee.department || 'N/A',
      entry.date,
      entry.checkIn || 'N/A',
      entry.checkOut || 'N/A',
      entry.totalHours.toFixed(2),
      entry.status
    ])
  })

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    if (column.header) {
      column.width = Math.max(12, Math.min(50, column.header.length || 12))
    }
  })
}

interface DailyRecord {
  date: string
  checkIn: string | null
  checkOut: string | null
  records: AttendanceRecord[]
}

async function createTimesheetSheet(
  workbook: ExcelJS.Workbook, 
  records: AttendanceRecord[], 
  startDate?: string, 
  endDate?: string
) {
  const worksheet = workbook.addWorksheet('Timesheet')

  // Add report header with date range
  worksheet.addRow(['Timesheet Report'])
  worksheet.addRow([`Generated: ${new Date().toLocaleString()}`])
  if (startDate && endDate) {
    worksheet.addRow([`Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`])
  }
  worksheet.addRow([]) // Empty row

  // Group by employee
  const employeeRecords = new Map<string, { employee: AttendanceRecord['employee'], records: AttendanceRecord[] }>()
  records.forEach(record => {
    if (!employeeRecords.has(record.employee.userId)) {
      employeeRecords.set(record.employee.userId, {
        employee: record.employee,
        records: []
      })
    }
    employeeRecords.get(record.employee.userId)!.records.push(record)
  })

  let currentRow = worksheet.rowCount + 1

  employeeRecords.forEach(({ employee, records: empRecords }) => {
    // Employee header
    worksheet.addRow([`${employee.name} (${employee.userId})`])
    const empHeaderRow = worksheet.getRow(currentRow)
    empHeaderRow.font = { bold: true, size: 14 }
    empHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }
    }
    worksheet.mergeCells(currentRow, 1, currentRow, 6)
    currentRow++

    // Sub headers
    worksheet.addRow(['Date', 'Check In', 'Check Out', 'Total Hours', 'Type', 'Method'])
    const subHeaderRow = worksheet.getRow(currentRow)
    subHeaderRow.font = { bold: true }
    currentRow++

    // Employee records
    const dailyRecords = new Map<string, DailyRecord>()
    empRecords.forEach(record => {
      const dateKey = record.timestamp.toDateString()
      if (!dailyRecords.has(dateKey)) {
        dailyRecords.set(dateKey, { date: dateKey, checkIn: null, checkOut: null, records: [] })
      }
      const dayRecord = dailyRecords.get(dateKey)!
      dayRecord.records.push(record)
      
      if (record.type === 'CHECK_IN') {
        dayRecord.checkIn = record.timestamp.toLocaleTimeString()
      } else if (record.type === 'CHECK_OUT') {
        dayRecord.checkOut = record.timestamp.toLocaleTimeString()
      }
    })

    dailyRecords.forEach(day => {
      let totalHours = 0
      if (day.checkIn && day.checkOut) {
        const checkInTime = new Date(`${day.date} ${day.checkIn}`)
        const checkOutTime = new Date(`${day.date} ${day.checkOut}`)
        totalHours = Math.max(0, (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60))
      }

      worksheet.addRow([
        day.date,
        day.checkIn || 'N/A',
        day.checkOut || 'N/A',
        totalHours.toFixed(2),
        day.records.map(r => formatAttendanceType(r.type)).join(', '),
        day.records.map(r => formatAttendanceMethod(r.method)).join(', ')
      ])
      currentRow++
    })

    // Add spacing
    worksheet.addRow([])
    currentRow++
  })

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    if (column.header) {
      column.width = Math.max(15, Math.min(50, column.header.length || 15))
    }
  })
}

function formatAttendanceType(type: string): string {
  const typeMap: Record<string, string> = {
    'CHECK_IN': 'Check In',
    'CHECK_OUT': 'Check Out',
    'BREAK_IN': 'Break In',
    'BREAK_OUT': 'Break Out',
    'OVERTIME_IN': 'Overtime In',
    'OVERTIME_OUT': 'Overtime Out'
  }
  return typeMap[type] || type
}

function formatAttendanceMethod(method: string): string {
  const methodMap: Record<string, string> = {
    'FINGERPRINT': 'Fingerprint',
    'CARD': 'Card',
    'PASSWORD': 'Password',
    'FACE': 'Face Recognition'
  }
  return methodMap[method] || method
}