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

interface AttendanceFiltersProps {
  onFiltersChange?: (filters: AttendanceFilters) => void;
  isLoading?: boolean;
}

interface AttendanceFilters {
  search: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  status: string;
  department: string;
}

export function AttendanceFilters({ onFiltersChange, isLoading }: AttendanceFiltersProps) {
  const [filters, setFilters] = useState<AttendanceFilters>({
    search: "",
    dateFrom: null,
    dateTo: null,
    status: "",
    department: "",
  });

  const updateFilters = (newFilters: Partial<AttendanceFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  const clearFilters = () => {
    const cleared = {
      search: "",
      dateFrom: null,
      dateTo: null,
      status: "",
      department: "",
    };
    setFilters(cleared);
    onFiltersChange?.(cleared);
  };

  const hasActiveFilters = filters.search || filters.dateFrom || filters.dateTo || filters.status || filters.department;

  return (
    <Card data-testid="card-attendance-filters">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    data-testid="button-date-from"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom || undefined}
                    onSelect={(date) => updateFilters({ dateFrom: date || null })}
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
                    data-testid="button-date-to"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo || undefined}
                    onSelect={(date) => updateFilters({ dateTo: date || null })}
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
                onValueChange={(value) => updateFilters({ status: value })}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="early_departure">Early Departure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={filters.department}
                onValueChange={(value) => updateFilters({ department: value })}
              >
                <SelectTrigger data-testid="select-department">
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}