import { type DashboardContextType } from "@/constants/types";
import { createContext } from "react";

export const DashboardContext = createContext<DashboardContextType>({
  selectedProjectId: null,
  projects: [],
  filters: { status: "All", search: "" },
  selectProject: () => {},
  clearSelection: () => {},
  setProjects: () => {},
  updateFilters: () => {},
});
