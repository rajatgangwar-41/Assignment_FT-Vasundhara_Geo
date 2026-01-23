import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import type { GeoProject } from "@/constants/types";

export const ExportControls = ({ data }: { data: GeoProject[] }) => {
  const exportToCSV = () => {
    const csvData = data.map((project) => ({
      "Project Name": project.project_name,
      Latitude: project.latitude,
      Longitude: project.longitude,
      Status: project.status,
      "Last Updated": project.last_updated,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `geo-projects-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const exportToJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, `geo-projects-${new Date().toISOString().split("T")[0]}.json`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>Export as CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
