import { AttendanceTable } from '../attendance-table';

const mockAttendanceRecords = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    checkIn: '09:15 AM',
    checkOut: '06:00 PM',
    date: '2024-01-15',
    status: 'present' as const,
    totalHours: 8.5,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Sarah Smith',
    checkIn: '09:45 AM',
    checkOut: '06:15 PM',
    date: '2024-01-15',
    status: 'late' as const,
    totalHours: 8.2,
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    date: '2024-01-15',
    status: 'absent' as const,
  },
  {
    id: '4',
    employeeId: 'EMP004',
    employeeName: 'Lisa Anderson',
    checkIn: '09:00 AM',
    checkOut: '04:30 PM',
    date: '2024-01-15',
    status: 'early_departure' as const,
    totalHours: 7.5,
  },
];

export default function AttendanceTableExample() {
  return (
    <div className="p-4">
      <AttendanceTable records={mockAttendanceRecords} />
    </div>
  );
}