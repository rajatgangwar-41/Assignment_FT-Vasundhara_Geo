import type { GeoProject } from "@/constants/types";

// api.ts
let promise: Promise<GeoProject[]>;

export async function fetchProjects() {
  if (!promise) {
    promise = await fetch("/geo-projects-data.json").then((res) => {
      if (!res.ok) throw new Error("API failed");
      return res.json();
    });
  }
  return promise;
}
