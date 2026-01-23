import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/hooks/useDashboard";
import type { Status } from "@/constants/types";

export const FilterControls = () => {
  const { filters, updateFilters } = useDashboard();

  const handleStatusChange = (value: Status) => {
    updateFilters({ status: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const clearSearch = () => {
    updateFilters({ search: "" });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-9 pr-9"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="On Hold">On Hold</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
