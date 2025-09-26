import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ZKTecoClient } from '@/lib/zkteco/ZKTecoClient'
import { AttendanceSync } from '@/lib/zkteco/AttendanceSync'

const prisma = new PrismaClient()

// POST /api/attendance/sync - Sync attendance from ZKTECO device
export async function POST(request: NextRequest) {
  const syncLog = await prisma.syncLog.create({
    data: {
      deviceId: process.env.ZKTECO_DEVICE_ID || '1',
      syncType: 'ATTENDANCE',
      status: 'IN_PROGRESS',
      startTime: new Date()
    }
  })

  try {
    // Initialize ZKTECO client
    const zkClient = new ZKTecoClient({
      ip: process.env.ZKTECO_IP || '192.168.10.201',
      port: parseInt(process.env.ZKTECO_PORT || '4370'),
      deviceId: parseInt(process.env.ZKTECO_DEVICE_ID || '1'),
      commKey: parseInt(process.env.ZKTECO_COMM_KEY || '0')
    })

    // Initialize attendance sync handler
    const attendanceSync = new AttendanceSync(zkClient, prisma)

    console.log('Starting attendance sync...')
    
    // Connect to device
    await zkClient.connect()
    
    // Sync attendance records
    const { newRecords, updatedRecords, errors } = await attendanceSync.syncAttendance()
    
    // Update device last sync time
    await prisma.device.upsert({
      where: {
        ipAddress: process.env.ZKTECO_IP || '192.168.10.201'
      },
      update: {
        lastSync: new Date(),
        status: 'ONLINE'
      },
      create: {
        name: 'ZKTECO K40 Pro',
        ipAddress: process.env.ZKTECO_IP || '192.168.10.201',
        port: parseInt(process.env.ZKTECO_PORT || '4370'),
        deviceId: process.env.ZKTECO_DEVICE_ID || '1',
        model: 'ZKTECO K40 Pro',
        lastSync: new Date(),
        status: 'ONLINE'
      }
    })

    // Update sync log
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
        recordCount: newRecords.length + updatedRecords.length,
        errorMessage: errors.length > 0 ? errors.join('; ') : null,
        endTime: new Date()
      }
    })

    // Disconnect from device
    zkClient.disconnect()

    return NextResponse.json({
      success: true,
      data: {
        syncId: syncLog.id,
        newRecords: newRecords.length,
        updatedRecords: updatedRecords.length,
        totalSynced: newRecords.length + updatedRecords.length,
        errors: errors.length,
        syncTime: new Date()
      }
    })

  } catch (error: any) {
    console.error('Sync error:', error)
    
    // Update sync log with error
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'FAILED',
        errorMessage: error.message,
        endTime: new Date()
      }
    })

    // Update device status to offline
    await prisma.device.updateMany({
      where: {
        ipAddress: process.env.ZKTECO_IP || '192.168.10.201'
      },
      data: {
        status: 'ERROR'
      }
    })

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Sync failed',
        syncId: syncLog.id
      },
      { status: 500 }
    )
  }
}

// GET /api/attendance/sync - Get sync status and history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const deviceId = searchParams.get('deviceId')

    const where: any = { syncType: 'ATTENDANCE' }
    if (deviceId) {
      where.deviceId = deviceId
    }

    const syncLogs = await prisma.syncLog.findMany({
      where,
      orderBy: {
        startTime: 'desc'
      },
      take: limit
    })

    // Get current sync status
    const currentSync = await prisma.syncLog.findFirst({
      where: {
        ...where,
        status: 'IN_PROGRESS'
      }
    })

    // Get device info
    const device = await prisma.device.findFirst({
      where: {
        ipAddress: process.env.ZKTECO_IP || '192.168.10.201'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        currentSync,
        recentSyncs: syncLogs,
        device,
        autoSyncEnabled: process.env.AUTO_SYNC_ENABLED === 'true',
        syncInterval: parseInt(process.env.SYNC_INTERVAL || '300000')
      }
    })

  } catch (error) {
    console.error('Error fetching sync status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sync status' },
      { status: 500 }
    )
  }
}