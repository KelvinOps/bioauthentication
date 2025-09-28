export interface CSVExportOptions {
  filename?: string;
  headers?: string[];
  delimiter?: string;
}

export interface AttendanceCSVRecord {
  studentName: string;
  studentId: string;
  date: string;
  time: string;
  status: string;
  method: string;
  notes?: string;
}

export interface StudentCSVRecord {
  name: string;
  studentId: string;
  email?: string;
  phone?: string;
  class?: string;
  fingerprintRegistered: boolean;
  enrollmentDate: string;
}

// Define interfaces for the raw data structures
export interface AttendanceRecord {
  timestamp: string;
  checkInTime?: string;
  status: string;
  method: string;
  notes?: string;
  student?: {
    name: string;
    studentId: string;
    id: string;
    class?: string;
  };
}

export interface StudentRecord {
  name: string;
  studentId: string;
  email?: string;
  phone?: string;
  class?: string;
  fingerprintRegistered: boolean;
  createdAt: string;
}

export interface AttendanceSummaryRecord {
  student: {
    id: string;
    name: string;
    studentId: string;
    class?: string;
  };
  status: 'present' | 'late' | 'absent';
}

export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: CSVExportOptions = {}
): string {
  if (!data.length) return '';

  const { headers, delimiter = ',' } = options;
  
  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.join(delimiter);
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      
      // Handle values that contain the delimiter or quotes
      if (value === null || value === undefined) {
        return '';
      }
      
      const stringValue = String(value);
      
      // Wrap in quotes if contains delimiter, quotes, or newlines
      if (stringValue.includes(delimiter) || 
          stringValue.includes('"') || 
          stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(delimiter);
  });
  
  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

export function exportAttendanceToCSV(
  attendanceRecords: AttendanceRecord[],
  options: CSVExportOptions = {}
): void {
  const csvData = attendanceRecords.map(record => ({
    'Student Name': record.student?.name || 'Unknown Student',
    'Student ID': record.student?.studentId || 'Unknown ID',
    'Date': new Date(record.timestamp).toLocaleDateString(),
    'Time': record.checkInTime || 'No time recorded',
    'Status': record.status,
    'Method': record.method,
    'Notes': record.notes || '',
  }));

  const csvContent = convertToCSV(csvData, {
    headers: [
      'Student Name',
      'Student ID',
      'Date',
      'Time',
      'Status',
      'Method',
      'Notes'
    ],
    ...options,
  });

  const filename = options.filename || 
    `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
}

export function exportStudentsToCSV(
  students: StudentRecord[],
  options: CSVExportOptions = {}
): void {
  const csvData = students.map(student => ({
    'Name': student.name,
    'Student ID': student.studentId,
    'Email': student.email || '',
    'Phone': student.phone || '',
    'Class': student.class || '',
    'Fingerprint Registered': student.fingerprintRegistered ? 'Yes' : 'No',
    'Enrollment Date': new Date(student.createdAt).toLocaleDateString(),
  }));

  const csvContent = convertToCSV(csvData, {
    headers: [
      'Name',
      'Student ID',
      'Email',
      'Phone',
      'Class',
      'Fingerprint Registered',
      'Enrollment Date'
    ],
    ...options,
  });

  const filename = options.filename || 
    `students-report-${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
}

export function exportAttendanceSummaryToCSV(
  attendanceData: AttendanceSummaryRecord[],
  options: CSVExportOptions = {}
): void {
  // Group attendance by student and calculate summary statistics
  const studentSummary = new Map<string, {
    name: string;
    studentId: string;
    class: string;
    totalDays: number;
    presentDays: number;
    lateDays: number;
    absentDays: number;
  }>();
  
  attendanceData.forEach(record => {
    const studentId = record.student?.id;
    if (!studentId) return;
    
    if (!studentSummary.has(studentId)) {
      studentSummary.set(studentId, {
        name: record.student.name,
        studentId: record.student.studentId,
        class: record.student.class || 'Not Assigned',
        totalDays: 0,
        presentDays: 0,
        lateDays: 0,
        absentDays: 0,
      });
    }
    
    const summary = studentSummary.get(studentId);
    if (summary) {
      summary.totalDays++;
      
      switch (record.status) {
        case 'present':
          summary.presentDays++;
          break;
        case 'late':
          summary.lateDays++;
          break;
        case 'absent':
          summary.absentDays++;
          break;
      }
    }
  });

  const csvData = Array.from(studentSummary.values()).map(summary => ({
    'Student Name': summary.name,
    'Student ID': summary.studentId,
    'Class': summary.class,
    'Total Days': summary.totalDays,
    'Present Days': summary.presentDays,
    'Late Days': summary.lateDays,
    'Absent Days': summary.absentDays,
    'Attendance Rate': summary.totalDays > 0 
      ? `${((summary.presentDays + summary.lateDays) / summary.totalDays * 100).toFixed(1)}%`
      : '0%',
  }));

  const csvContent = convertToCSV(csvData, {
    headers: [
      'Student Name',
      'Student ID',
      'Class',
      'Total Days',
      'Present Days',
      'Late Days',
      'Absent Days',
      'Attendance Rate'
    ],
    ...options,
  });

  const filename = options.filename || 
    `attendance-summary-${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csvContent, filename);
}

export function generateDateRangeFilename(
  baseFilename: string,
  startDate?: string,
  endDate?: string
): string {
  const today = new Date().toISOString().split('T')[0];
  
  if (startDate && endDate) {
    if (startDate === endDate) {
      return `${baseFilename}-${startDate}.csv`;
    }
    return `${baseFilename}-${startDate}-to-${endDate}.csv`;
  }
  
  return `${baseFilename}-${today}.csv`;
}

// Utility function to validate CSV data before export
export function validateCSVData<T extends Record<string, unknown>>(data: T[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Array.isArray(data)) {
    errors.push('Data must be an array');
    return { isValid: false, errors };
  }
  
  if (data.length === 0) {
    errors.push('No data to export');
    return { isValid: false, errors };
  }
  
  // Check if all objects have consistent structure
  const firstItemKeys = Object.keys(data[0]);
  for (let i = 1; i < data.length; i++) {
    const currentKeys = Object.keys(data[i]);
    if (currentKeys.length !== firstItemKeys.length) {
      errors.push(`Inconsistent data structure at index ${i}`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}