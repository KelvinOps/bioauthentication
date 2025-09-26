import { EmployeeCard } from '../employee-card';

export default function EmployeeCardExample() {
  const handleEdit = (id: string) => console.log('Edit employee:', id);
  const handleDelete = (id: string) => console.log('Delete employee:', id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-4xl">
      <EmployeeCard
        id="1"
        name="John Doe"
        employeeId="EMP001"
        department="Engineering"
        position="Software Developer"
        status="active"
        lastActivity="Check In - 09:15 AM"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EmployeeCard
        id="2"
        name="Sarah Smith"
        employeeId="EMP002"
        department="Marketing"
        position="Marketing Manager"
        status="inactive"
        lastActivity="Check Out - 06:00 PM"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EmployeeCard
        id="3"
        name="Mike Johnson"
        employeeId="EMP003"
        department="Sales"
        position="Sales Representative"
        status="suspended"
        lastActivity="No activity today"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}