'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loadingspinner';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, User, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  action: 'check-in' | 'check-out' | 'break-start' | 'break-end';
  timestamp: string;
  status: 'present' | 'late' | 'absent';
  location?: string;
}

const actionLabels = {
  'check-in': 'Checked In',
  'check-out': 'Checked Out',
  'break-start': 'Break Started',
  'break-end': 'Break Ended'
};

const statusColors = {
  present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const actionColors = {
  'check-in': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'check-out': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'break-start': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'break-end': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
};

export default function RealtimeAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchRealtimeData();
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/attendance/realtime');
      
      if (!response.ok) {
        throw new Error('Failed to fetch realtime attendance data');
      }
      
      const data = await response.json();
      setRecords(data.records || []);
      setLastUpdate(new Date());
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching realtime attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Real-time Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Real-time Attendance
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {formatTime(lastUpdate.toISOString())}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRealtimeData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-red-600 mb-4">
              <Clock className="h-12 w-12 mx-auto mb-2" />
              <p>Error loading real-time data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchRealtimeData} variant="outline">
              Try Again
            </Button>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <User className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No recent activity</p>
            <p className="text-sm">Attendance records will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-4 h-full overflow-y-auto pr-2">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={record.employeeAvatar} alt={record.employeeName} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {getInitials(record.employeeName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {record.employeeName}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={statusColors[record.status]}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{record.department}</span>
                    {record.location && (
                      <>
                        <span>•</span>
                        <span>{record.location}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={`mb-1 ${actionColors[record.action]}`}
                  >
                    {actionLabels[record.action]}
                  </Badge>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTime(record.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}