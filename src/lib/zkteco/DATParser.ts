import * as fs from 'fs/promises';
import * as path from 'path';
import { AttendanceRecord, Employee } from './ZKTecoClient';

export interface DATFileConfig {
  attendanceFilePath?: string;
  employeeFilePath?: string;
  encoding?: BufferEncoding;
}

export class DATParser {
  private config: DATFileConfig;

  constructor(config: DATFileConfig = {}) {
    this.config = {
      attendanceFilePath: process.env.ZKTECO_ATTENDANCE_DAT_PATH || './data/attendance.dat',
      employeeFilePath: process.env.ZKTECO_EMPLOYEE_DAT_PATH || './data/employees.dat',
      encoding: 'binary',
      ...config
    };
  }

  async parseAttendanceFile(): Promise<AttendanceRecord[]> {
    try {
      // Check if file exists
      const filePath = this.config.attendanceFilePath!;
      await fs.access(filePath);
      
      const buffer = await fs.readFile(filePath);
      return this.parseAttendanceBuffer(buffer);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.warn('Attendance DAT file not found, returning mock data');
        return this.generateMockAttendanceData();
      }
      throw error;
    }
  }

  async parseEmployeeFile(): Promise<Employee[]> {
    try {
      const filePath = this.config.employeeFilePath!;
      await fs.access(filePath);
      
      const buffer = await fs.readFile(filePath);
      return this.parseEmployeeBuffer(buffer);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.warn('Employee DAT file not found, returning mock data');
        return this.generateMockEmployeeData();
      }
      throw error;
    }
  }

  private parseAttendanceBuffer(buffer: Buffer): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    
    try {
      // ZKTECO .dat file structure (simplified)
      // Each record is typically 16 bytes
      const recordSize = 16;
      
      for (let i = 0; i < buffer.length; i += recordSize) {
        if (i + recordSize > buffer.length) break;
        
        const record = this.parseAttendanceRecord(buffer.slice(i, i + recordSize));
        if (record) {
          records.push(record);
        }
      }
    } catch (error) {
      console.error('Error parsing attendance buffer:', error);
    }

    return records;
  }

  private parseEmployeeBuffer(buffer: Buffer): Employee[] {
    const employees: Employee[] = [];
    
    try {
      // ZKTECO employee file structure (simplified)
      // Each record varies in size
      const records = buffer.toString('ascii').split('\n');
      
      for (const record of records) {
        if (record.trim()) {
          const employee = this.parseEmployeeRecord(record);
          if (employee) {
            employees.push(employee);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing employee buffer:', error);
    }

    return employees;
  }

  private parseAttendanceRecord(buffer: Buffer): AttendanceRecord | null {
    try {
      // Simplified ZKTECO attendance record parsing
      // Real implementation would follow the actual ZKTECO format
      
      const userId = buffer.readUInt32LE(0).toString();
      const timestamp = new Date(buffer.readUInt32LE(4) * 1000);
      const type = buffer.readUInt8(8);
      const method = buffer.readUInt8(9);
      const deviceId = buffer.readUInt16LE(10).toString();
      
      // Validate the record
      if (userId === '0' || !timestamp || isNaN(timestamp.getTime())) {
        return null;
      }

      return {
        userId,
        timestamp,
        type,
        method,
        deviceId
      };
    } catch (error) {
      console.error('Error parsing attendance record:', error);
      return null;
    }
  }

  private parseEmployeeRecord(record: string): Employee | null {
    try {
      // Simplified employee record parsing
      // Format: userId,name,cardNumber,department,position
      const parts = record.split(',');
      
      if (parts.length < 2) return null;
      
      return {
        userId: parts[0]?.trim() || '',
        name: parts[1]?.trim() || '',
        cardNumber: parts[2]?.trim() || undefined,
        department: parts[3]?.trim() || undefined,
        position: parts[4]?.trim() || undefined
      };
    } catch (error) {
      console.error('Error parsing employee record:', error);
      return null;
    }
  }

  // Mock data generators for testing when DAT files are not available
  private generateMockAttendanceData(): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    const userIds = ['1001', '1002', '1003', '1004', '1005'];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      // Add random hours for check-in/out times
      timestamp.setHours(8 + Math.floor(Math.random() * 10));
      timestamp.setMinutes(Math.floor(Math.random() * 60));
      
      records.push({
        userId,
        timestamp,
        type: Math.random() > 0.5 ? 0 : 1, // 0 = Check In, 1 = Check Out
        method: Math.floor(Math.random() * 4), // 0-3 for different methods
        deviceId: '1'
      });
    }
    
    return records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private generateMockEmployeeData(): Employee[] {
    return [
      {
        userId: '1001',
        name: 'John Doe',
        cardNumber: 'C001',
        department: 'Engineering',
        position: 'Senior Developer'
      },
      {
        userId: '1002',
        name: 'Jane Smith',
        cardNumber: 'C002',
        department: 'Marketing',
        position: 'Marketing Manager'
      },
      {
        userId: '1003',
        name: 'Mike Johnson',
        cardNumber: 'C003',
        department: 'HR',
        position: 'HR Specialist'
      },
      {
        userId: '1004',
        name: 'Sarah Wilson',
        cardNumber: 'C004',
        department: 'Finance',
        position: 'Accountant'
      },
      {
        userId: '1005',
        name: 'David Brown',
        cardNumber: 'C005',
        department: 'Engineering',
        position: 'Frontend Developer'
      }
    ];
  }

  async watchFile(filePath: string, callback: (records: AttendanceRecord[]) => void): Promise<void> {
    try {
      const watcher = fs.watch(filePath);
      
      for await (const event of watcher) {
        if (event.eventType === 'change') {
          try {
            const records = await this.parseAttendanceFile();
            callback(records);
          } catch (error) {
            console.error('Error parsing file on change:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error watching file:', error);
    }
  }

  async createDirectoriesIfNotExist(): Promise<void> {
    const attendanceDir = path.dirname(this.config.attendanceFilePath!);
    const employeeDir = path.dirname(this.config.employeeFilePath!);
    
    try {
      await fs.mkdir(attendanceDir, { recursive: true });
      await fs.mkdir(employeeDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async backupFiles(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    try {
      const attendanceBackup = `${this.config.attendanceFilePath}.backup.${timestamp}`;
      const employeeBackup = `${this.config.employeeFilePath}.backup.${timestamp}`;
      
      await fs.copyFile(this.config.attendanceFilePath!, attendanceBackup);
      await fs.copyFile(this.config.employeeFilePath!, employeeBackup);
      
      console.log('DAT files backed up successfully');
    } catch (error) {
      console.error('Error backing up files:', error);
    }
  }
}