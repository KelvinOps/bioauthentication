import { ExportButtons } from '../export-buttons';

const mockData = [
  { id: '1', name: 'John Doe', checkIn: '09:15 AM', status: 'present' },
  { id: '2', name: 'Sarah Smith', checkIn: '09:45 AM', status: 'late' },
  { id: '3', name: 'Mike Johnson', status: 'absent' },
];

export default function ExportButtonsExample() {
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Export Attendance Data</h3>
        <p className="text-muted-foreground">{mockData.length} records ready for export</p>
      </div>
      <ExportButtons
        onExport={handleExport}
        data={mockData}
      />
    </div>
  );
}