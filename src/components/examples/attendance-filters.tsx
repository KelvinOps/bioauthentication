import { AttendanceFilters } from '../attendance-filters';

export default function AttendanceFiltersExample() {
  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  return (
    <div className="p-4">
      <AttendanceFilters onFiltersChange={handleFiltersChange} />
    </div>
  );
}