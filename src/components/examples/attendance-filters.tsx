import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

// Updated interface to match AttendanceFiltersType
interface AttendanceFilters {
  search: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  departments: string[];
  employees: string[];
  status: 'all' | 'present' | 'absent' | 'late' | 'early_departure';
  shift: 'all' | 'morning' | 'afternoon' | 'night';
  sortBy: 'name' | 'department' | 'time' | 'status';
  sortOrder: 'asc' | 'desc';
}

interface AttendanceFiltersProps {
  onFiltersChange?: (filters: AttendanceFilters) => void;
  isLoading?: boolean;
}

export function AttendanceFilters({ onFiltersChange, isLoading = false }: AttendanceFiltersProps) {
  const [filters, setFilters] = useState<AttendanceFilters>({
    search: "",
    dateRange: {
      from: null,
      to: null,
    },
    departments: [],
    employees: [],
    status: 'all',
    shift: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const updateFilters = (newFilters: Partial<AttendanceFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  const clearFilters = () => {
    const cleared: AttendanceFilters = {
      search: "",
      dateRange: {
        from: null,
        to: null,
      },
      departments: [],
      employees: [],
      status: 'all',
      shift: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
    };
    setFilters(cleared);
    onFiltersChange?.(cleared);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.dateRange.from || 
    filters.dateRange.to || 
    filters.departments.length > 0 || 
    filters.employees.length > 0 ||
    filters.status !== 'all' || 
    filters.shift !== 'all';

  return (
    <Card data-testid="card-attendance-filters">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
              {isLoading && (
                <div className="ml-2 flex items-center text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-600 mr-1"></div>
                  Loading...
                </div>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={isLoading}
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Name or ID..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-8"
                  disabled={isLoading}
                  data-testid="input-search-employee"
                />
              </div>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                    disabled={isLoading}
                    data-testid="button-date-from"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from || undefined}
                    onSelect={(selectedDate: Date | undefined) => 
                      updateFilters({ 
                        dateRange: { 
                          ...filters.dateRange, 
                          from: selectedDate || null 
                        } 
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                    disabled={isLoading}
                    data-testid="button-date-to"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to || undefined}
                    onSelect={(selectedDate: Date | undefined) => 
                      updateFilters({ 
                        dateRange: { 
                          ...filters.dateRange, 
                          to: selectedDate || null 
                        } 
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value: AttendanceFilters['status']) => updateFilters({ status: value })}
                disabled={isLoading}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="early_departure">Early Departure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shift Filter */}
            <div className="space-y-2">
              <Label htmlFor="shift">Shift</Label>
              <Select
                value={filters.shift}
                onValueChange={(value: AttendanceFilters['shift']) => updateFilters({ shift: value })}
                disabled={isLoading}
              >
                <SelectTrigger data-testid="select-shift">
                  <SelectValue placeholder="All shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: AttendanceFilters['sortBy']) => updateFilters({ sortBy: value })}
                disabled={isLoading}
              >
                <SelectTrigger data-testid="select-sort-by">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}