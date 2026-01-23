import { useVirtualizer } from "@tanstack/react-virtual";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import type { DataTableProps, GeoProject, KeyColumn } from "@/constants/types";
import { cn, formatDate, getStatusVariant } from "@/lib/utils";

export const DataTable = ({
  data,
  sortConfig,
  onSort,
  parentRef,
}: DataTableProps) => {
  const { selectedProjectId, selectProject } = useDashboard();

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const handleRowClick = (project: GeoProject) => {
    selectProject(project.id);
  };

  const handleHeaderClick = (column: KeyColumn) => {
    onSort(column);
  };

  const getSortIcon = (column: KeyColumn) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="h-full w-full">
      {/* Table Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="grid grid-cols-12 gap-4 px-4 py-3">
          {(
            [
              "project_name",
              "latitude",
              "longitude",
              "status",
              "last_updated",
            ] as const
          ).map((column) => {
            return (
              <div
                className={cn(
                  `text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body cursor-pointer hover:text-foreground transition-colors`,
                  column === "project_name" ? "col-span-4" : "col-span-2",
                )}
                onClick={() => handleHeaderClick(column)}
              >
                {column.split("_").join(" ")} {getSortIcon(column)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Virtualized Table Body */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualRow) => {
          const project = data[virtualRow.index];
          const isSelected = project.id === selectedProjectId;

          return (
            <div
              key={project.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={`
                grid grid-cols-12 gap-4 px-4 py-3 border-b cursor-pointer
                hover:bg-accent/10 transition-colors
                ${isSelected ? "bg-accent/10 border-l-4 border-l-accent" : ""}
              `}
              onClick={() => handleRowClick(project)}
            >
              <div className="col-span-4 text-sm font-medium font-body truncate">
                {project.project_name}
              </div>
              <div className="col-span-2 text-xs font-mono text-muted-foreground">
                {project.latitude.toFixed(4)}
              </div>
              <div className="col-span-2 text-xs font-mono text-muted-foreground">
                {project.longitude.toFixed(4)}
              </div>
              <div className="col-span-2">
                <Badge
                  variant="outline"
                  className={`${getStatusVariant(project.status)} text-xs`}
                  data-testid={`status-badge-${project.status.toLowerCase().replace(" ", "-")}`}
                >
                  {project.status}
                </Badge>
              </div>
              <div className="col-span-2 text-sm font-body text-muted-foreground">
                {formatDate(project.last_updated)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
