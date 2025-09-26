'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loadingspinner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  employeeId: string;
  timestamp: string;
  type: string;
  status: string;
  deviceId: string;
  verified: number;
  employee: {
    name: string;
    department?: string;
  };
}

interface AttendanceTableProps {
  dateFilter?: string;
  employeeFilter?: string;
  limit?: number;
}

export default function AttendanceTable({ 
  dateFilter, 
  employeeFilter, 
  limit = 50 
}: AttendanceTableProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (dateFilter) params.append('date', dateFilter);
      if (employeeFilter) params.append('employeeId', employeeFilter);
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/attendance?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      
      const data = await response.json();
      setAttendance(data.attendance || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, employeeFilter, limit]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const getStatusBadgeColor = (status: string, type: string) => {
    switch (status.toLowerCase()) {
      case 'late':
        return 'destructive';
      case 'absent':
        return 'destructive';
      case 'normal':
        return type.includes('OUT') ? 'secondary' : 'default';
      default:
        return 'outline';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'CHECK_IN':
        return 'default';
      case 'CHECK_OUT':
        return 'secondary';
      case 'BREAK_OUT':
      case 'BREAK_IN':
        return 'outline';
      case 'OVERTIME_IN':
      case 'OVERTIME_OUT':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading attendance data: {error}</p>
        <Button onClick={fetchAttendance} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const columns = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (record: AttendanceRecord) => (
        <div className="font-medium">{record.employeeId}</div>
      )
    },
    {
      key: 'employee',
      header: 'Employee Name',
      render: (record: AttendanceRecord) => (
        <div>
          <div className="font-medium">{record.employee?.name || 'Unknown'}</div>
          {record.employee?.department && (
            <div className="text-sm text-gray-500">{record.employee.department}</div>
          )}
        </div>
      )
    },
    {
      key: 'timestamp',
      header: 'Date & Time',
      render: (record: AttendanceRecord) => (
        <div>
          <div className="font-medium">
            {format(new Date(record.timestamp), 'MMM dd, yyyy')}
          </div>
          <div className="text-sm text-gray-500">
            {format(new Date(record.timestamp), 'hh:mm:ss a')}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(record.timestamp), 'EEEE')}
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (record: AttendanceRecord) => (
        <Badge variant={getTypeBadgeColor(record.type)}>
          {record.type.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (record: AttendanceRecord) => (
        <Badge variant={getStatusBadgeColor(record.status, record.type)}>
          {record.status}
        </Badge>
      )
    },
    {
      key: 'verified',
      header: 'Verified',
      render: (record: AttendanceRecord) => (
        <Badge variant={record.verified === 1 ? 'default' : 'destructive'}>
          {record.verified === 1 ? 'Yes' : 'No'}
        </Badge>
      )
    },
    {
      key: 'deviceId',
      header: 'Device',
      render: (record: AttendanceRecord) => (
        <span className="text-sm text-gray-600">Device {record.deviceId}</span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Recent Attendance Records ({attendance.length})
        </h3>
        <Button onClick={fetchAttendance} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendance.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render(record)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}