import type { Status } from "@/constants/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import L from "leaflet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createCustomIcon = (isSelected: boolean) => {
  const color = isSelected ? "#0ea5e9" : "#64748b";
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: all 0.2s;
        ${isSelected ? "transform: scale(1.3);" : ""}
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const getStatusVariant = (status: Status) => {
  const variants = {
    All: "bg-slate-500/15 text-slate-600 border-slate-200",
    Active:
      "bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:text-emerald-400",
    Completed:
      "bg-blue-500/15 text-blue-600 border-blue-200 dark:text-blue-400",
    Pending:
      "bg-amber-500/15 text-amber-600 border-amber-200 dark:text-amber-400",
    "On Hold":
      "bg-slate-500/15 text-slate-600 border-slate-200 dark:text-slate-400",
  };
  return variants[status];
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
