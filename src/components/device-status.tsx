import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useState } from "react";

interface DeviceStatusProps {
  deviceName?: string;
  ipAddress?: string;
  isOnline?: boolean;
  lastSync?: string;
  totalEmployees?: number;
  lastActivity?: string;
}

export function DeviceStatus({
  deviceName = "ZKTECO K40 Pro",
  ipAddress = "192.168.10.201:4370",
  isOnline = true,
  lastSync = "2 minutes ago",
  totalEmployees = 125,
  lastActivity = "John Doe - Check In",
}: DeviceStatusProps) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    // Todo: remove mock functionality
    console.log('Sync with device triggered');
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <Card data-testid="card-device-status">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Device Status</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={syncing}
          data-testid="button-sync-device"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="font-medium">{deviceName}</span>
          </div>
          <Badge variant={isOnline ? "default" : "destructive"} data-testid="badge-device-status">
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">IP Address:</span>
            <div className="font-mono" data-testid="text-device-ip">{ipAddress}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Sync:</span>
            <div data-testid="text-last-sync">{lastSync}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Total Employees:</span>
            <div data-testid="text-total-employees">{totalEmployees}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Activity:</span>
            <div className="truncate" data-testid="text-last-activity">{lastActivity}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}