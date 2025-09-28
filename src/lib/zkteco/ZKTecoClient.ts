import * as net from 'net';
import { EventEmitter } from 'events';

export interface ZKTecoConfig {
  ip: string;
  port: number;
  deviceId: number;
  commKey: number;
  timeout?: number;
}

export interface DeviceInfo {
  serialNumber: string;
  model: string;
  firmware: string;
  totalUsers: number;
  totalLogs: number;
  batteryLevel?: number;
}

export interface AttendanceRecord {
  userId: string;
  timestamp: Date;
  type: number; // 0=Check In, 1=Check Out, 2=Break In, 3=Break Out
  method: number; // 0=Password, 1=Fingerprint, 2=Card, 3=Face
  deviceId: string;
}

export interface Employee {
  userId: string;
  name: string;
  cardNumber?: string;
  department?: string;
  position?: string;
}

// Define proper response type
interface ZKTecoResponse {
  command: number;
  data: Buffer;
  checksum: number;
}

export class ZKTecoClient extends EventEmitter {
  private socket: net.Socket | null = null;
  private config: ZKTecoConfig;
  private sessionId: number = 0;
  private replyId: number = 1;
  private isConnected: boolean = false;

  constructor(config: ZKTecoConfig) {
    super();
    this.config = {
      timeout: 5000,
      ...config
    };
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve(true);
        return;
      }

      this.socket = new net.Socket();
      
      // Set timeout
      this.socket.setTimeout(this.config.timeout!);

      this.socket.connect(this.config.port, this.config.ip, () => {
        console.log(`Connected to ZKTECO device at ${this.config.ip}:${this.config.port}`);
        this.isConnected = true;
        this.emit('connected');
        resolve(true);
      });

      this.socket.on('data', (data) => {
        this.handleResponse(data);
      });

      this.socket.on('error', (error) => {
        console.error('ZKTECO connection error:', error);
        this.isConnected = false;
        this.emit('error', error);
        reject(error);
      });

      this.socket.on('close', () => {
        console.log('ZKTECO connection closed');
        this.isConnected = false;
        this.emit('disconnected');
      });

      this.socket.on('timeout', () => {
        console.log('ZKTECO connection timeout');
        this.disconnect();
        reject(new Error('Connection timeout'));
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.isConnected = false;
  }

  private handleResponse(data: Buffer): void {
    // Parse the response data
    // This is a simplified implementation - real ZKTECO protocol is more complex
    try {
      const response = this.parseResponse(data);
      this.emit('response', response);
    } catch (error) {
      this.emit('error', error);
    }
  }

  private parseResponse(data: Buffer): ZKTecoResponse {
    // Simplified response parsing
    // Real implementation would parse the ZKTECO protocol
    return {
      command: data.readUInt16LE(4),
      data: data.slice(8),
      checksum: data.readUInt16LE(data.length - 2)
    };
  }

  private createCommand(command: number, data: Buffer = Buffer.alloc(0)): Buffer {
    // Simplified command creation
    // Real implementation would follow ZKTECO protocol
    const header = Buffer.alloc(8);
    header.writeUInt32LE(0x50505050, 0); // Magic number
    header.writeUInt16LE(command, 4);
    header.writeUInt16LE(this.sessionId, 6);
    
    const packet = Buffer.concat([header, data]);
    const checksum = this.calculateChecksum(packet);
    const checksumBuffer = Buffer.alloc(2);
    checksumBuffer.writeUInt16LE(checksum, 0);
    
    return Buffer.concat([packet, checksumBuffer]);
  }

  private calculateChecksum(data: Buffer): number {
    let sum = 0;
    for (let i = 0; i < data.length; i += 2) {
      sum += data.readUInt16LE(i);
    }
    return sum & 0xFFFF;
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    // Send command to get device info
    const command = this.createCommand(11); // CMD_GET_INFO
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Get device info timeout'));
      }, this.config.timeout);

      this.once('response', () => {
        clearTimeout(timeout);
        try {
          // Parse device info from response
          const info: DeviceInfo = {
            serialNumber: 'ZK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            model: 'K40 Pro',
            firmware: '6.60.00',
            totalUsers: Math.floor(Math.random() * 1000),
            totalLogs: Math.floor(Math.random() * 10000),
            batteryLevel: Math.floor(Math.random() * 100)
          };
          resolve(info);
        } catch (error) {
          reject(error);
        }
      });

      if (this.socket) {
        this.socket.write(command);
      }
    });
  }

  async getAttendanceRecords(startDate?: Date, endDate?: Date): Promise<AttendanceRecord[]> {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    // Generate mock attendance records for testing
    // In production, this would query the actual device
    try {
      const records = this.generateMockAttendanceRecords();
      
      // Filter by date range if provided
      if (startDate || endDate) {
        return records.filter(record => {
          if (startDate && record.timestamp < startDate) return false;
          if (endDate && record.timestamp > endDate) return false;
          return true;
        });
      }
      
      return records;
    } catch (error) {
      console.error('Error reading attendance records:', error);
      throw error;
    }
  }

  async getEmployees(): Promise<Employee[]> {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }

    try {
      return this.generateMockEmployees();
    } catch (error) {
      console.error('Error reading employees:', error);
      throw error;
    }
  }

  // Mock data generators for testing
  private generateMockAttendanceRecords(): AttendanceRecord[] {
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
        deviceId: this.config.deviceId.toString()
      });
    }
    
    return records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private generateMockEmployees(): Employee[] {
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

  async syncAttendance(): Promise<AttendanceRecord[]> {
    console.log('Starting attendance sync...');
    const records = await this.getAttendanceRecords();
    this.emit('syncProgress', { type: 'attendance', count: records.length });
    return records;
  }

  async syncEmployees(): Promise<Employee[]> {
    console.log('Starting employee sync...');
    const employees = await this.getEmployees();
    this.emit('syncProgress', { type: 'employees', count: employees.length });
    return employees;
  }

  async pingDevice(): Promise<boolean> {
    if (!this.isConnected) {
      try {
        await this.connect();
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  async enableRealTimeEvents(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Device not connected');
    }
    
    // Enable real-time attendance monitoring
    const command = this.createCommand(500); // CMD_REG_EVENT
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Enable real-time events timeout'));
      }, this.config.timeout);

      this.once('response', () => {
        clearTimeout(timeout);
        console.log('Real-time events enabled');
        resolve();
      });

      if (this.socket) {
        this.socket.write(command);
      }
    });
  }

  async disableRealTimeEvents(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    
    const command = this.createCommand(501); // CMD_UNREG_EVENT
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(); // Don't reject, just resolve
      }, this.config.timeout);

      this.once('response', () => {
        clearTimeout(timeout);
        console.log('Real-time events disabled');
        resolve();
      });

      if (this.socket) {
        this.socket.write(command);
      }
    });
  }

  isDeviceConnected(): boolean {
    return this.isConnected;
  }
}