'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loadingspinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw,
  Settings,
  MapPin
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'biometric' | 'camera' | 'card-reader' | 'mobile';
  location: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastSeen: string;
  batteryLevel?: number;
  signalStrength?: number;
  version: string;
  ipAddress?: string;
  totalScans?: number;
  successfulScans?: number;
}

const deviceTypeIcons = {
  biometric: Monitor,
  camera: Monitor,
  'card-reader': Monitor,
  mobile: Monitor
};

const statusConfig = {
  online: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  offline: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    icon: WifiOff,
    iconColor: 'text-gray-600'
  },
  error: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: XCircle,
    iconColor: 'text-red-600'
  },
  maintenance: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: AlertCircle,
    iconColor: 'text-yellow-600'
  }
};

export default function DeviceStatus() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchDeviceStatus();
    // Set up polling for device status updates every 60 seconds
    const interval = setInterval(fetchDeviceStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeviceStatus = async () => {
    try {
      const response = await fetch('/api/devices/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch device status');
      }
      
      const data = await response.json();
      setDevices(data.devices || []);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching device status:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (timestamp: string) => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getSuccessRate = (device: Device) => {
    if (!device.totalScans || device.totalScans === 0) return 0;
    return Math.round((device.successfulScans || 0) / device.totalScans * 100);
  };

  const getStatusSummary = () => {
    const summary = {
      online: devices.filter(d => d.status === 'online').length,
      offline: devices.filter(d => d.status === 'offline').length,
      error: devices.filter(d => d.status === 'error').length,
      maintenance: devices.filter(d => d.status === 'maintenance').length
    };
    return summary;
  };

  if (loading) {
    return (
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  const statusSummary = getStatusSummary();

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device Status
            <Badge variant="secondary" className="ml-2">
              {devices.length} devices
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-2 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {statusSummary.online}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {statusSummary.error + statusSummary.offline}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDeviceStatus}
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
              <Monitor className="h-12 w-12 mx-auto mb-2" />
              <p>Error loading device status</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchDeviceStatus} variant="outline">
              Try Again
            </Button>
          </div>
        ) : devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Monitor className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No devices found</p>
            <p className="text-sm">Device status will appear here when available</p>
          </div>
        ) : (
          <div className="space-y-3 h-full overflow-y-auto pr-2">
            {devices.map((device) => {
              const DeviceIcon = deviceTypeIcons[device.type];
              const statusInfo = statusConfig[device.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <div
                  key={device.id}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <DeviceIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      <div className="absolute -bottom-1 -right-1">
                        <StatusIcon className={`h-4 w-4 ${statusInfo.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {device.name}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={statusInfo.color}
                      >
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      <span>{device.location}</span>
                      <span>•</span>
                      <span>{device.type.replace('-', ' ').toUpperCase()}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Last seen: {formatLastSeen(device.lastSeen)}</span>
                      {device.batteryLevel && (
                        <span>Battery: {device.batteryLevel}%</span>
                      )}
                      {device.signalStrength && (
                        <div className="flex items-center gap-1">
                          <Wifi className="h-3 w-3" />
                          <span>{device.signalStrength}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    {device.totalScans && (
                      <div className="mb-1">
                        <span className="font-medium">{getSuccessRate(device)}%</span>
                        <span className="text-muted-foreground ml-1">success</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      v{device.version}
                    </div>
                    {device.ipAddress && (
                      <div className="text-xs text-muted-foreground">
                        {device.ipAddress}
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}