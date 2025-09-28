import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface AttendanceFilters {
  studentId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  timestamp: string;
  status: string;
  checkInTime?: string;
  method: string;
  notes?: string;
  student?: {
    id: string;
    name: string;
    studentId: string;
    email?: string;
    class?: string;
  };
}

// Define proper error type
interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export function useAttendance(filters?: AttendanceFilters) {
  return useQuery({
    queryKey: ["/api/attendance", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.studentId) params.append("studentId", filters.studentId);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.status) params.append("status", filters.status);

      const url = `/api/attendance${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch attendance");
      return await response.json();
    },
  });
}

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["/api/attendance/today"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
    queryFn: async () => {
      const response = await fetch("/api/attendance/today");
      if (!response.ok) throw new Error("Failed to fetch today's attendance");
      return await response.json();
    },
  });
}

export function useAttendanceStats() {
  return useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch attendance stats");
      return await response.json();
    },
  });
}

export function useCreateAttendance() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attendanceData: {
      studentId: string;
      status: string;
      checkInTime?: string;
      method?: string;
      notes?: string;
    }) => {
      const response = await apiRequest("POST", "/api/attendance", attendanceData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Attendance Recorded",
        description: "Attendance has been successfully recorded",
      });
      
      // Invalidate and refetch attendance queries
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      toast({
        title: "Failed to Record Attendance",
        description: apiError.message || "An error occurred while recording attendance",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateAttendance() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Partial<{
        status: string;
        checkInTime: string;
        notes: string;
      }> 
    }) => {
      const response = await apiRequest("PUT", `/api/attendance/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Attendance Updated",
        description: "Attendance record has been successfully updated",
      });
      
      // Invalidate and refetch attendance queries
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      toast({
        title: "Failed to Update Attendance",
        description: apiError.message || "An error occurred while updating attendance",
        variant: "destructive",
      });
    },
  });
}

export function useExportAttendance() {
  const { toast } = useToast();

  const exportToCSV = (filters?: AttendanceFilters) => {
    try {
      const params = new URLSearchParams({
        format: "csv",
      });
      
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.studentId) params.append("studentId", filters.studentId);

      const url = `/api/reports/export?${params.toString()}`;
      
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Started",
        description: "Attendance report is being downloaded",
      });
    } catch {
      toast({
        title: "Export Failed",
        description: "Failed to export attendance data",
        variant: "destructive",
      });
    }
  };

  const exportTodayToCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    exportToCSV({
      startDate: today,
      endDate: today,
    });
  };

  return {
    exportToCSV,
    exportTodayToCSV,
  };
}

export function useRealtimeAttendance() {
  const { data: attendance, ...query } = useTodayAttendance();

  // Return the latest 10 attendance records for real-time display
  const recentActivity = attendance?.slice(0, 10) || [];

  return {
    recentActivity,
    totalToday: attendance?.length || 0,
    ...query,
  };
}