import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkIn?: string;
  checkOut?: string;
  date: string;
  status: "present" | "late" | "absent" | "early_departure";
  totalHours?: number;
  avatar?: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  isLoading?: boolean;
}

export function AttendanceTable({ records, isLoading = false }: AttendanceTableProps) {
  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    const config = {
      present: { label: "Present", variant: "default" as const },
      late: { label: "Late", variant: "secondary" as const },
      absent: { label: "Absent", variant: "destructive" as const },
      early_departure: { label: "Early", variant: "secondary" as const },
    };

    return config[status];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4" data-testid="loading-attendance-table">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg" data-testid="table-attendance">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No attendance records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => {
              const statusConfig = getStatusBadge(record.status);
              return (
                <TableRow key={record.id} data-testid={`row-attendance-${record.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={record.avatar} alt={record.employeeName} />
                        <AvatarFallback className="text-xs">
                          {getInitials(record.employeeName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium" data-testid={`text-employee-name-${record.id}`}>
                        {record.employeeName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-employee-id-${record.id}`}>
                    {record.employeeId}
                  </TableCell>
                  <TableCell data-testid={`text-date-${record.id}`}>
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell data-testid={`text-check-in-${record.id}`}>
                    {record.checkIn || "-"}
                  </TableCell>
                  <TableCell data-testid={`text-check-out-${record.id}`}>
                    {record.checkOut || "-"}
                  </TableCell>
                  <TableCell data-testid={`text-total-hours-${record.id}`}>
                    {record.totalHours ? `${record.totalHours.toFixed(1)}h` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusConfig.variant} 
                      data-testid={`badge-status-${record.id}`}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}