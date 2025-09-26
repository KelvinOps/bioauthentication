import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ZKTecoClient } from '@/lib/zkteco/ZKTecoClient'

const prisma = new PrismaClient()

// GET /api/attendance - Fetch attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const employeeId = searchParams.get('employeeId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    // Fetch attendance records with pagination
    const [records, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              userId: true,
              department: true,
              position: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.attendance.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}

// POST /api/attendance - Create new attendance record (manual entry)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, userId, type, timestamp, method = 'MANUAL' } = body

    // Validate required fields
    if (!employeeId || !userId || !type || !timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        userId,
        type,
        method,
        timestamp: new Date(timestamp),
        source: 'MANUAL'
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            userId: true,
            department: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: attendance
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating attendance record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create attendance record' },
      { status: 500 }
    )
  }
}

// PUT /api/attendance - Update attendance record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, timestamp, method } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required' },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(timestamp && { timestamp: new Date(timestamp) }),
        ...(method && { method }),
        updatedAt: new Date()
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            userId: true,
            department: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: attendance
    })

  } catch (error) {
    console.error('Error updating attendance record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update attendance record' },
      { status: 500 }
    )
  }
}

// DELETE /api/attendance - Delete attendance record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required' },
        { status: 400 }
      )
    }

    await prisma.attendance.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Attendance record deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting attendance record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete attendance record' },
      { status: 500 }
    )
  }
}