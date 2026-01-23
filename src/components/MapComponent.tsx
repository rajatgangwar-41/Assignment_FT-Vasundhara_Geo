import { useEffect, useRef } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import type { GeoProject } from "@/constants/types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet - Not needed since i am using custom icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// Custom marker icons
const createCustomIcon = (isSelected: boolean) => {
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

// Component to handle map updates
function MapController({ selectedProject }: { selectedProject: GeoProject }) {
  const map = useMap();

  useEffect(() => {
    if (selectedProject) {
      map.flyTo([selectedProject.latitude, selectedProject.longitude], 12, {
        duration: 1.5,
      });
    }
  }, [selectedProject, map]);

  return null;
}

export const MapComponent = ({ projects }: { projects: GeoProject[] }) => {
  const { selectedProjectId, selectProject } = useDashboard();
  const mapRef = useRef(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleMarkerClick = (project: GeoProject) => {
    selectProject(project.id);
  };

  // Calculate center based on all projects
  const center: LatLngExpression =
    projects.length > 0
      ? [
          projects.reduce((sum, p) => sum + p.latitude, 0) / projects.length,
          projects.reduce((sum, p) => sum + p.longitude, 0) / projects.length,
        ]
      : [20, 0];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={2}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" //Uncomment for greyish background
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects.map((project) => (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={createCustomIcon(project.id === selectedProjectId)}
            eventHandlers={{
              click: () => handleMarkerClick(project),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{project.project_name}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {project.status}
                </p>
                <p className="text-xs">
                  {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapController selectedProject={selectedProject as GeoProject} />
      </MapContainer>
    </div>
  );
};
