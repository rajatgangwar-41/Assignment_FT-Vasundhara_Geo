import { useState, useEffect, useCallback } from "react";
import { FilterControls } from "@/components";
import { DashboardProvider } from "@/context/DashboardContext";
import { Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/useDashboard";
import type { SortConfig, GeoProject } from "@/constants/types";

const hardCodedProject: GeoProject[] = [
  {
    id: crypto.randomUUID().toString(),
    project_name: "Delhi Transportation 1",
    latitude: +(Math.random() * 100).toFixed(4),
    longitude: +(Math.random() * 100).toFixed(4),
    status: "Active",
    // last_updated: "2025-11-23T03:42:16.088Z",
    last_updated: Date.toString(),
  },
];

const DashboardContent = () => {
  const { filters } = useDashboard();
  const [allProjects, setAllProjects] = useState<GeoProject[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<GeoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "project_name",
    direction: "asc",
  });

  const filterAndSortProjects = useCallback(() => {
    let filtered = [...allProjects!];

    // Apply status filter
    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter(
        (p: GeoProject) =>
          p.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((p: GeoProject) =>
        p.project_name.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle different types
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setDisplayedProjects(filtered);
  }, [filters, sortConfig, allProjects]);

  useEffect(() => {
    (async () => {
      await fetchAllProjects();
    })();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [filterAndSortProjects]);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      setAllProjects(hardCodedProject);
      toast.success(`Loaded ${hardCodedProject.length} projects`);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-secondary-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading geo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-400 animate-pulse" />
          <h1 className="text-xl font-bold">Geo Data Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {displayedProjects?.length} of {allProjects?.length} projects
          </div>
          <FilterControls />
          {/* TO Be Done */}
          {/* <ExportControls data={displayedProjects} /> */}
        </div>
      </header>
      <div className="mt-30">{JSON.stringify(displayedProjects)}</div>

      {/* Main Content */}
      <main className="">{/* TO BE DONE */}</main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
