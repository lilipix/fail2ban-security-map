import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "./HeatmapLayer";

export default function MapView({ bans }) {
  const heatPoints = bans.map((b) => [b.lat, b.lon, 1]);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <HeatmapLayer points={heatPoints} />
    </MapContainer>
  );
}
