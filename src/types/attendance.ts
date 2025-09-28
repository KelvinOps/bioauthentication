// src/types/attendance.ts

export type AttendanceStatus = 'all' | 'present' | 'absent' | 'late' | 'early_leave';
export type ShiftType = 'all' | 'morning' | 'evening' | 'night';
export type SortBy = 'name' | 'department' | 'checkIn' | 'checkOut';
export type SortOrder = 'asc' | 'desc';

export interface AttendanceFiltersType {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  departments: string[];
  employees: string[];
  status: AttendanceStatus;
  shift: ShiftType;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  employeeId: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  shift: 'morning' | 'evening' | 'night';
  hoursWorked: number;
  overtimeHours: number;
  notes?: string;
}

export interface AttendanceReport {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  dateRange: {
    from: Date;
    to: Date;
  };
  generatedBy: string;
  generatedAt: Date;
  records: AttendanceRecord[];
  summary: {
    totalEmployees: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    averageHours: number;
    totalOvertimeHours: number;
  };
}