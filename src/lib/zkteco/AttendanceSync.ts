import { PrismaClient } from '@prisma/client'
import { ZKTecoClient, AttendanceRecord } from './ZKTecoClient'

export interface SyncResult {
  newRecords: AttendanceRecord[]
  updatedRecords: AttendanceRecord[]
  errors: string[]
}

// Define proper error type
interface SyncError {
  message: string;
  code?: string;
  details?: unknown;
}

export class AttendanceSync {
  constructor(
    private zkClient: ZKTecoClient,
    private prisma: PrismaClient
  ) {}

  async syncAttendance(): Promise<SyncResult> {
    const newRecords: AttendanceRecord[] = []
    const updatedRecords: AttendanceRecord[] = []
    const errors: string[] = []

    try {
      // Get attendance records from device
      const deviceRecords = await this.zkClient.getAttendanceRecords()
      console.log(`Found ${deviceRecords.length} records on device`)

      for (const record of deviceRecords) {
        try {
          await this.processAttendanceRecord(record, newRecords, updatedRecords)
        } catch (error: unknown) {
          const syncError = error as SyncError
          errors.push(`Error processing record for user ${record.userId}: ${syncError.message}`)
        }
      }

      console.log(`Sync completed: ${newRecords.length} new, ${updatedRecords.length} updated, ${errors.length} errors`)

    } catch (error: unknown) {
      const syncError = error as SyncError
      errors.push(`Device sync error: ${syncError.message}`)
    }

    return { newRecords, updatedRecords, errors }
  }

  private async processAttendanceRecord(
    record: AttendanceRecord, 
    newRecords: AttendanceRecord[], 
    updatedRecords: AttendanceRecord[]
  ): Promise<void> {
    // Find or create employee
    let employee = await this.prisma.employee.findUnique({
      where: { userId: record.userId }
    })

    if (!employee) {
      // Try to get employee info from device
      const deviceEmployees = await this.zkClient.getEmployees()
      const deviceEmployee = deviceEmployees.find(emp => emp.userId === record.userId)

      if (deviceEmployee) {
        employee = await this.prisma.employee.create({
          data: {
            userId: deviceEmployee.userId,
            name: deviceEmployee.name || `User ${deviceEmployee.userId}`,
            cardNumber: deviceEmployee.cardNumber,
            department: deviceEmployee.department,
            position: deviceEmployee.position,
            isActive: true
          }
        })
      } else {
        // Create employee with minimal info
        employee = await this.prisma.employee.create({
          data: {
            userId: record.userId,
            name: `User ${record.userId}`,
            isActive: true
          }
        })
      }
    }

    // Check if attendance record already exists
    const existingRecord = await this.prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        userId: record.userId,
        timestamp: record.timestamp,
        type: this.mapAttendanceType(record.type)
      }
    })

    if (existingRecord) {
      // Update existing record if needed
      if (!existingRecord.synced) {
        await this.prisma.attendance.update({
          where: { id: existingRecord.id },
          data: {
            method: this.mapAttendanceMethod(record.method),
            deviceId: record.deviceId,
            synced: true,
            updatedAt: new Date()
          }
        })
        updatedRecords.push(record)
      }
    } else {
      // Create new attendance record
      await this.prisma.attendance.create({
        data: {
          employeeId: employee.id,
          userId: record.userId,
          timestamp: record.timestamp,
          type: this.mapAttendanceType(record.type),
          method: this.mapAttendanceMethod(record.method),
          deviceId: record.deviceId,
          source: 'ZKTECO',
          synced: true
        }
      })
      newRecords.push(record)
    }
  }

  private mapAttendanceType(deviceType: number): string {
    // Map device attendance types to our enum
    switch (deviceType) {
      case 0: return 'CHECK_IN'
      case 1: return 'CHECK_OUT'
      case 2: return 'BREAK_IN'
      case 3: return 'BREAK_OUT'
      case 4: return 'OVERTIME_IN'
      case 5: return 'OVERTIME_OUT'
      default: return 'CHECK_IN'
    }
  }

  private mapAttendanceMethod(deviceMethod: number): string {
    // Map device authentication methods to our enum
    switch (deviceMethod) {
      case 0: return 'PASSWORD'
      case 1: return 'FINGERPRINT'
      case 2: return 'CARD'
      case 3: return 'FACE'
      default: return 'FINGERPRINT'
    }
  }

  async syncEmployees(): Promise<{ newEmployees: number; updatedEmployees: number; errors: string[] }> {
    const errors: string[] = []
    let newEmployees = 0
    let updatedEmployees = 0

    try {
      const deviceEmployees = await this.zkClient.getEmployees()

      for (const deviceEmployee of deviceEmployees) {
        try {
          const existingEmployee = await this.prisma.employee.findUnique({
            where: { userId: deviceEmployee.userId }
          })

          if (existingEmployee) {
            // Update existing employee
            await this.prisma.employee.update({
              where: { id: existingEmployee.id },
              data: {
                name: deviceEmployee.name || existingEmployee.name,
                cardNumber: deviceEmployee.cardNumber || existingEmployee.cardNumber,
                department: deviceEmployee.department || existingEmployee.department,
                position: deviceEmployee.position || existingEmployee.position,
                updatedAt: new Date()
              }
            })
            updatedEmployees++
          } else {
            // Create new employee
            await this.prisma.employee.create({
              data: {
                userId: deviceEmployee.userId,
                name: deviceEmployee.name || `User ${deviceEmployee.userId}`,
                cardNumber: deviceEmployee.cardNumber,
                department: deviceEmployee.department,
                position: deviceEmployee.position,
                isActive: true
              }
            })
            newEmployees++
          }
        } catch (error: unknown) {
          const syncError = error as SyncError
          errors.push(`Error syncing employee ${deviceEmployee.userId}: ${syncError.message}`)
        }
      }

    } catch (error: unknown) {
      const syncError = error as SyncError
      errors.push(`Employee sync error: ${syncError.message}`)
    }

    return { newEmployees, updatedEmployees, errors }
  }

  async getLastSyncInfo(): Promise<{
    lastSync: Date | null
    totalRecords: number
    pendingSync: number
  }> {
    const device = await this.prisma.device.findFirst({
      where: {
        ipAddress: process.env.ZKTECO_IP || '192.168.10.201'
      }
    })

    const totalRecords = await this.prisma.attendance.count()
    
    const pendingSync = await this.prisma.attendance.count({
      where: { synced: false }
    })

    return {
      lastSync: device?.lastSync || null,
      totalRecords,
      pendingSync
    }
  }

  async markAllRecordsAsSynced(): Promise<void> {
    await this.prisma.attendance.updateMany({
      where: { synced: false },
      data: { synced: true }
    })
  }
}