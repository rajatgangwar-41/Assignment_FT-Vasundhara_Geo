import type { Dispatch, SetStateAction } from "react";

export type Status = "Active" | "Completed" | "Pending" | "On Hold" | "All";
export type KeyColumn =
  | "project_name"
  | "latitude"
  | "longitude"
  | "status"
  | "last_updated";

export type GeoProject = {
  id: string;
  project_name: string;
  latitude: number;
  longitude: number;
  status: Status;
  last_updated: string;
};

export type ProjectID = string | null;
export type Filter = { status: Status; search: string };
export type SortConfig = { key: KeyColumn; direction: "asc" | "desc" };

export type DashboardContextType = {
  selectedProjectId: ProjectID;
  projects: GeoProject[];
  filters: Filter;
  selectProject: (projectId: ProjectID) => void;
  clearSelection: () => void;
  setProjects: Dispatch<SetStateAction<GeoProject[]>>;
  updateFilters: (newFilters: Partial<Filter>) => void;
};
