import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ExportButtonsProps {
  onExport?: (format: "excel" | "csv" | "pdf") => void;
  isExporting?: boolean;
  data?: any[];
  filename?: string;
}

export function ExportButtons({
  onExport,
  isExporting = false,
  data = [],
  filename = "attendance_report",
}: ExportButtonsProps) {
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const handleExport = async (format: "excel" | "csv" | "pdf") => {
    setExportingFormat(format);
    // Todo: remove mock functionality
    console.log(`Exporting ${data.length} records as ${format}`);
    
    try {
      await onExport?.(format);
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setExportingFormat(null);
    }
  };

  const exportOptions = [
    {
      format: "excel" as const,
      label: "Export to Excel",
      icon: FileSpreadsheet,
      color: "text-green-600",
      description: "XLSX format with formatting",
    },
    {
      format: "csv" as const,
      label: "Export to CSV",
      icon: FileText,
      color: "text-blue-600",
      description: "Comma-separated values",
    },
    {
      format: "pdf" as const,
      label: "Export to PDF",
      icon: Download,
      color: "text-red-600",
      description: "Formatted PDF report",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={isExporting || exportingFormat !== null}
          data-testid="button-export-dropdown"
        >
          <Download className="h-4 w-4 mr-2" />
          {exportingFormat ? `Exporting ${exportingFormat.toUpperCase()}...` : "Export"}
          {(isExporting || exportingFormat) && (
            <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isCurrentlyExporting = exportingFormat === option.format;
          
          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isExporting || exportingFormat !== null}
              data-testid={`button-export-${option.format}`}
            >
              <div className="flex items-center w-full">
                <Icon className={`h-4 w-4 mr-2 ${option.color}`} />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description} • {data.length} records
                  </div>
                </div>
                {isCurrentlyExporting && (
                  <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}