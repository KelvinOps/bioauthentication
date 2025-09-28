'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Download, 
  Upload, 
  Settings, 
  Bell, 
  Calendar,
  FileText,
  Users,
  Clock,
  Zap,
  BarChart3,
  Database
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  disabled?: boolean;
}

export default function QuickActions() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: QuickAction) => {
    if (action.disabled) return;
    
    setLoading(action.id);
    
    try {
      if (action.onClick) {
        await action.onClick();
      } else if (action.href) {
        router.push(action.href);
      }
    } catch (error) {
      console.error('Action error:', error);
    } finally {
      setLoading(null);
    }
  };

  const exportAttendance = async () => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'attendance',
          format: 'excel',
          dateRange: 'today'
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const sendNotifications = async () => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'attendance_reminder',
          target: 'absent_employees'
        })
      });
      alert('Notifications sent successfully!');
    } catch (error) {
      console.error('Failed to send notifications:', error);
      alert('Failed to send notifications');
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-employee',
      title: 'Add Employee',
      description: 'Register a new employee',
      icon: UserPlus,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200',
      href: '/employees/new'
    },
    {
      id: 'export-report',
      title: 'Export Report',
      description: 'Download attendance data',
      icon: Download,
      color: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-200',
      onClick: exportAttendance
    },
    {
      id: 'bulk-import',
      title: 'Bulk Import',
      description: 'Import employee data',
      icon: Upload,
      color: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200',
      href: '/employees/import'
    },
    {
      id: 'send-notifications',
      title: 'Send Alerts',
      description: 'Notify absent employees',
      icon: Bell,
      color: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200',
      onClick: sendNotifications,
      badge: 'New'
    },
    {
      id: 'schedule-report',
      title: 'Schedule Report',
      description: 'Set up automated reports',
      icon: Calendar,
      color: 'bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-200',
      href: '/reports/schedule'
    },
    {
      id: 'generate-payroll',
      title: 'Payroll Data',
      description: 'Generate payroll report',
      icon: FileText,
      color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-200',
      href: '/reports/payroll'
    },
    {
      id: 'manage-departments',
      title: 'Departments',
      description: 'Manage departments',
      icon: Users,
      color: 'bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-200',
      href: '/departments'
    },
    {
      id: 'shift-management',
      title: 'Shift Settings',
      description: 'Configure work shifts',
      icon: Clock,
      color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200',
      href: '/settings/shifts'
    },
    {
      id: 'quick-stats',
      title: 'Analytics',
      description: 'View detailed analytics',
      icon: BarChart3,
      color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border-cyan-200',
      href: '/analytics'
    },
    {
      id: 'system-settings',
      title: 'System Config',
      description: 'Configure system settings',
      icon: Settings,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200',
      href: '/settings'
    },
    {
      id: 'backup-data',
      title: 'Backup',
      description: 'Create data backup',
      icon: Database,
      color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200',
      onClick: async () => {
        try {
          const response = await fetch('/api/system/backup', { method: 'POST' });
          if (response.ok) {
            alert('Backup initiated successfully!');
          }
        } catch (err) {
          console.error('Backup failed:', err);
          alert('Backup failed');
        }
      }
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'System performance metrics',
      icon: Zap,
      color: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-200',
      href: '/system/performance'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isLoading = loading === action.id;
            
            return (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-start space-y-2 transition-all duration-200 ${action.color} ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
                onClick={() => handleAction(action)}
                disabled={isLoading || action.disabled}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-current"></div>
                  )}
                </div>
                
                <div className="text-left w-full">
                  <p className="font-medium text-sm mb-1">
                    {action.title}
                  </p>
                  <p className="text-xs opacity-70 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Today&apos;s Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">47</div>
              <div className="text-xs text-blue-600/80">Present</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-xs text-red-600/80">Absent</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-xs text-yellow-600/80">Late</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-xs text-green-600/80">Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}