// src/components/attendance-filters.tsx
import React from 'react';
import type { AttendanceFiltersType } from '../../types/attendance';

// Import with proper typing - this might help if there's an import issue
const AttendanceFilters = React.lazy(() => 
  import('../attendance-filters').then(module => ({ 
    default: module.AttendanceFilters 
  }))
);

// Or use dynamic import if the above doesn't work
// const AttendanceFilters = dynamic(() => import('../attendance-filters').then(mod => mod.AttendanceFilters), {
//   ssr: false
// });

interface AttendanceFiltersExampleProps {
  className?: string;
  onFiltersUpdate?: (filters: AttendanceFiltersType) => void;
}

const AttendanceFiltersExample: React.FC<AttendanceFiltersExampleProps> = ({ 
  className,
  onFiltersUpdate 
}) => {
  
  const handleFiltersChange = React.useCallback((filters: AttendanceFiltersType): void => {
    console.log('Filters changed:', filters);
    
    // Example of how you might handle the filters
    if (filters.dateRange.from && filters.dateRange.to) {
      console.log('Date range selected:', {
        from: filters.dateRange.from.toISOString().split('T')[0],
        to: filters.dateRange.to.toISOString().split('T')[0]
      });
    }
    
    if (filters.departments.length > 0) {
      console.log('Departments filtered:', filters.departments);
    }
    
    if (filters.employees.length > 0) {
      console.log('Employees filtered:', filters.employees);
    }
    
    if (filters.status !== 'all') {
      console.log('Status filter:', filters.status);
    }
    
    if (filters.shift !== 'all') {
      console.log('Shift filter:', filters.shift);
    }
    
    console.log('Sort settings:', {
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    });
    
    // Call parent callback if provided
    onFiltersUpdate?.(filters);
  }, [onFiltersUpdate]);

  // Create a properly typed props object
  const attendanceFiltersProps = React.useMemo(() => ({
    onFiltersChange: handleFiltersChange
  }), [handleFiltersChange]);

  return (
    <div className={`p-4 space-y-4 ${className || ''}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Attendance Filters Demo</h2>
        <p className="text-slate-400">
          Use the filters below to refine attendance data. Check the console to see filter changes.
        </p>
      </div>
      
      <React.Suspense fallback={<div>Loading filters...</div>}>
        <AttendanceFilters {...attendanceFiltersProps} />
      </React.Suspense>
      
      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="text-white font-medium mb-2">Filter Usage Tips:</h3>
        <ul className="text-slate-400 text-sm space-y-1">
          <li>• Date range is required for most operations</li>
          <li>• Multiple departments can be selected simultaneously</li>
          <li>• Employee filter works in conjunction with department filter</li>
          <li>• Status filter applies to all selected employees</li>
          <li>• Shift filter helps narrow down by work schedule</li>
          <li>• Sort options affect the order of results</li>
        </ul>
      </div>
    </div>
  );
};

export default AttendanceFiltersExample;