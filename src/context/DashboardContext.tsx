import type { GeoProject, Filter, ProjectID } from "@/constants/types";
import { useState, useCallback, type ReactNode } from "react";
import { DashboardContext } from "./context";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectID>("");
  const [projects, setProjects] = useState<GeoProject[]>([]);
  const [filters, setFilters] = useState<Filter>({
    status: "All",
    search: "",
  });

  const selectProject = useCallback((projectId: ProjectID) => {
    setSelectedProjectId(projectId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<Filter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const value = {
    selectedProjectId,
    projects,
    filters,
    selectProject,
    clearSelection,
    setProjects,
    updateFilters,
  };

  return <DashboardContext value={value}>{children}</DashboardContext>;
};
