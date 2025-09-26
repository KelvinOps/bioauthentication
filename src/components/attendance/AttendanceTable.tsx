'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
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

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, employeeFilter, limit]);

  const fetchAttendance = async () => {
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
      setError(error.message);
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string, type: string) => {
    switch (status.toLowerCase()) {
      case 'late':
        return 'warning';
      case 'absent':
        return 'error';
      case 'normal':
        return type.includes('OUT') ? 'info' : 'success';
      default:
        return 'default';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'CHECK_IN':
        return 'success';
      case 'CHECK_OUT':
        return 'info';
      case 'BREAK_OUT':
      case 'BREAK_IN':
        return 'warning';
      case 'OVERTIME_IN':
      case 'OVERTIME_OUT':
        return 'secondary';
      default:
        return 'default';
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
        <Badge variant={record.verified === 1 ? 'success' : 'error'}>
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
      
      <Table
        data={attendance}
        columns={columns}
        emptyMessage="No attendance records found"
        className="bg-white"
      />
    </div>
  );
}