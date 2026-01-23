import type { GeoProject, Status } from "@/constants/types";
import capitalData from "@/data/country-capital-lat-long-population.json";

/* -------------------- Mock Geo Data -------------------- */
export let MOCK_DATA_CACHE: GeoProject[];

function generateMockGeoData(count = 5000) {
  const statuses = ["Active", "Completed", "Pending", "On Hold"];
  const projectTypes = [
    "Infrastructure",
    "Urban Development",
    "Transportation",
    "Energy",
    "Water Management",
    "Telecommunications",
  ];

  const updatedCountriesData = capitalData.map((capital) => {
    return [capital["Capital City"], capital.Latitude, capital.Longitude];
  });

  const cities = [
    //   ["New York", 40.7128, -74.006],
    //   ["London", 51.5074, -0.1278],
    //   ["Tokyo", 35.6762, 139.6503],
    //   ["Paris", 48.8566, 2.3522],
    //   ["Sydney", -33.8688, 151.2093],
    //   ["Mumbai", 19.076, 72.8777],
    //   ["Dubai", 25.2048, 55.2708],
    //   ["Singapore", 1.3521, 103.8198],
    //   ["Toronto", 43.6532, -79.3832],
    //   ["Berlin", 52.52, 13.405],
    ...updatedCountriesData,
  ];

  const data: GeoProject[] = [];

  for (let i = 0; i < count; i++) {
    const [city, lat, lon] = cities[Math.floor(Math.random() * cities.length)];

    const daysAgo = Math.floor(Math.random() * 365);
    const lastUpdated = new Date(Date.now() - daysAgo * 86400000).toISOString();

    data.push({
      id: crypto.randomUUID(),
      project_name: `${city} ${
        projectTypes[Math.floor(Math.random() * projectTypes.length)]
      } ${String(i + 1).padStart(4, "0")}`,
      latitude: +((lat as number) + (Math.random() * 4 - 2)).toFixed(6),
      longitude: +((lon as number) + (Math.random() * 4 - 2)).toFixed(6),
      status: statuses[Math.floor(Math.random() * statuses.length)] as Status,
      last_updated: lastUpdated,
    });
  }

  return data;
}

export function getMockData(length = 5000) {
  if (!MOCK_DATA_CACHE) {
    MOCK_DATA_CACHE = generateMockGeoData(length);
  }
  return MOCK_DATA_CACHE;
}
