import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogIn, LogOut, Clock } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface ActivityRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "check_in" | "check_out";
  timestamp: string;
  avatar?: string;
}

interface RealtimeFeedProps {
  maxItems?: number;
}

export function RealtimeFeed({ maxItems = 10 }: RealtimeFeedProps) {
  const [activities, setActivities] = useState<ActivityRecord[]>([
    // Todo: remove mock functionality
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "John Doe",
      type: "check_in",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Sarah Smith",
      type: "check_out",
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      type: "check_in",
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "Lisa Anderson",
      type: "check_out",
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Todo: remove mock functionality
      const mockEmployees = [
        { id: "EMP005", name: "David Wilson" },
        { id: "EMP006", name: "Emma Brown" },
        { id: "EMP007", name: "Chris Taylor" },
      ];
      
      const randomEmployee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)];
      const randomType = Math.random() > 0.5 ? "check_in" : "check_out";
      
      const newActivity: ActivityRecord = {
        id: `${Date.now()}-${Math.random()}`,
        employeeId: randomEmployee.id,
        employeeName: randomEmployee.name,
        type: randomType,
        timestamp: new Date().toISOString(),
      };

      setActivities(prev => [newActivity, ...prev].slice(0, maxItems));
    }, 15000); // Add new activity every 15 seconds

    return () => clearInterval(interval);
  }, [maxItems]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getActivityConfig = (type: ActivityRecord["type"]) => {
    return {
      check_in: {
        icon: LogIn,
        label: "Check In",
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/20",
      },
      check_out: {
        icon: LogOut,
        label: "Check Out",
        color: "text-orange-600",
        bgColor: "bg-orange-100 dark:bg-orange-900/20",
      },
    }[type];
  };

  return (
    <Card data-testid="card-realtime-feed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Real-time Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-no-activities">
                No recent activity
              </div>
            ) : (
              activities.map((activity) => {
                const config = getActivityConfig(activity.type);
                const Icon = config.icon;
                
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-center gap-3 p-3 rounded-lg border hover-elevate"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} alt={activity.employeeName} />
                      <AvatarFallback className="text-xs">
                        {getInitials(activity.employeeName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm" data-testid={`text-activity-employee`}>
                          {activity.employeeName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {activity.employeeId}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span data-testid={`text-activity-type`}>{config.label}</span>
                        <span>•</span>
                        <span data-testid={`text-activity-time`}>
                          {format(new Date(activity.timestamp), 'HH:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}