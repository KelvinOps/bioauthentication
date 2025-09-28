//dashboard/ AttendanceSummary.tsx
// 
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loadingspinner';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';

interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  totalRecordsToday: number;
}

export default function AttendanceSummary() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceStats();
  }, []);

  const fetchAttendanceStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports/daily');
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance statistics');
      }
      
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching attendance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <LoadingSpinner />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <p className="text-red-600">Error loading attendance summary: {error}</p>
        <button 
          onClick={fetchAttendanceStats}
          className="mt-2 text-red-700 underline hover:no-underline"
        >
          Try again
        </button>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const attendanceRate = stats.totalEmployees > 0 
    ? Math.round((stats.presentToday / stats.totalEmployees) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Total Employees</p>
            <p className="text-3xl font-bold text-blue-900">{stats.totalEmployees}</p>
          </div>
          <div className="p-3 bg-blue-500 rounded-full">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Present Today</p>
            <p className="text-3xl font-bold text-green-900">{stats.presentToday}</p>
            <p className="text-sm text-green-600">{attendanceRate}% attendance</p>
          </div>
          <div className="p-3 bg-green-500 rounded-full">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Absent Today</p>
            <p className="text-3xl font-bold text-red-900">{stats.absentToday}</p>
            <p className="text-sm text-red-600">
              {stats.totalEmployees > 0 ? Math.round((stats.absentToday / stats.totalEmployees) * 100) : 0}% absent
            </p>
          </div>
          <div className="p-3 bg-red-500 rounded-full">
            <UserX className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-600">Late Today</p>
            <p className="text-3xl font-bold text-yellow-900">{stats.lateToday}</p>
            <p className="text-sm text-yellow-600">{stats.totalRecordsToday} total records</p>
          </div>
          <div className="p-3 bg-yellow-500 rounded-full">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
}