import type { SortConfig, GeoProject, KeyColumn } from "@/constants/types";
import {
  useState,
  useEffect,
  useRef,
  // useDeferredValue,
  // useMemo,
  useCallback,
} from "react";
import {
  FilterControls,
  MapComponent,
  DataTable,
  ExportControls,
} from "@/components";
import { DashboardProvider } from "@/context/DashboardContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/useDashboard";
import { fetchProjects } from "@/api/api";
// import { useDebounce } from "@/hooks/useDebounce";
// import { debounce } from "@tanstack/react-virtual";

const DashboardContent = () => {
  const { filters } = useDashboard();
  const [allProjects, setAllProjects] = useState<GeoProject[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<GeoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "project_name",
    direction: "asc",
  });

  const tableParentRef = useRef(null);
  // const debouncedSearch = debounce(window, filters.search, 500);
  // const deferredSearch = useDeferredValue(debouncedSearch);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      let response: GeoProject[] = await fetchProjects();

      // const normalized = response.map((p) => ({
      //   ...p,
      //   _search: p.project_name.toLowerCase(),
      // }));
      // setAllProjects(normalized.slice(0, 100));
      // toast.success(`Loaded ${normalized.length} projects`);
      response = response.filter((_, ind) => ind % 50 === 0);
      setAllProjects(response);
      toast.success(`Loaded ${response.length} projects`);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = useCallback(() => {
    let filtered = [...allProjects!];

    // Apply status filter
    if (filters.status && filters.status !== "All") {
      filtered = filtered.filter(
        (p: GeoProject) =>
          p.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    //   // search filter (deferred)
    // if (deferredSearch) {
    //   result = result.filter((p) =>
    //     p._search.includes(deferredSearch.toLowerCase()),
    //   );
    // }

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

  const handleSort = (column: KeyColumn) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    (async () => {
      await fetchAllProjects();
    })();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [filterAndSortProjects]);

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
          <ExportControls data={displayedProjects} />
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full w-full">
              <MapComponent projects={displayedProjects} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full w-full overflow-auto" ref={tableParentRef}>
              <DataTable
                data={displayedProjects}
                sortConfig={sortConfig}
                onSort={handleSort}
                parentRef={tableParentRef}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
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
