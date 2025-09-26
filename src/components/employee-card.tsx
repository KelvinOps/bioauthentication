import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, User, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmployeeCardProps {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "suspended";
  lastActivity?: string;
  avatar?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EmployeeCard({
  id,
  name,
  employeeId,
  department,
  position,
  status,
  lastActivity,
  avatar,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const statusColor = {
    active: "default",
    inactive: "secondary",
    suspended: "destructive",
  } as const;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover-elevate" data-testid={`card-employee-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm" data-testid={`text-employee-name`}>{name}</h3>
                <Badge variant={statusColor[status]} className="text-xs" data-testid={`badge-employee-status`}>
                  {status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground" data-testid={`text-employee-id`}>ID: {employeeId}</p>
              <p className="text-sm text-muted-foreground" data-testid={`text-employee-position`}>{position}</p>
              <p className="text-sm text-muted-foreground" data-testid={`text-employee-department`}>{department}</p>
              {lastActivity && (
                <p className="text-xs text-muted-foreground mt-1" data-testid={`text-employee-activity`}>
                  Last activity: {lastActivity}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid={`button-employee-menu-${id}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(id)} data-testid={`button-employee-edit-${id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Employee
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={() => onDelete?.(id)}
                data-testid={`button-employee-delete-${id}`}
              >
                <User className="h-4 w-4 mr-2" />
                Delete Employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}