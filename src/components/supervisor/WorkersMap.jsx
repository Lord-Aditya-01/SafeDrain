import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "../../services/leafletIconFix";
import { useEffect, useRef } from "react";
import L from "leaflet";

const normalIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const sosIcon = L.divIcon({
  className: "",
  html: `<div class="sos-marker"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const warningIcon = L.divIcon({
  className: "",
  html: `<div class="warning-marker"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const FocusWorker = ({ worker }) => {
  const map = useMap();

  useEffect(() => {
    if (worker) {
      map.setView([worker.lat, worker.lng], 17);
    }
  }, [worker, map]);

  return null;
};

const AutoCenter = ({ workers }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!hasCentered.current && workers.length > 0) {
      map.setView(
        [workers[0].lat, workers[0].lng],
        map.getZoom()
      );
      hasCentered.current = true;
    }
  }, [workers, map]);

  return null;
};

const WorkersMap = ({ workers = [], selectedWorker }) => {

  return (
    <div style={{ height: "80vh", borderRadius: "12px", overflow: "hidden" }}>
      {workers.length === 0 && (
        <p style={{ color: "white", padding: "8px" }}>
          No workers live yet…
        </p>
      )}

      <MapContainer
        center={[18.6785, 73.8970]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoCenter workers={workers} />
        <FocusWorker worker={selectedWorker} />

        {workers
          .filter(worker => worker.lat && worker.lng)   // ⭐ Prevent invalid marker crash
          .map((worker) => (
            <Marker
              key={worker.workerId}
              position={[worker.lat, worker.lng]}
              icon={
                worker.status === "EMERGENCY"
                  ? sosIcon
                  : worker.status === "WARNING"
                  ? warningIcon
                  : normalIcon
              }
            >
              <Popup>
                <strong>{worker.name}</strong>
                <br />
                ID: {worker.id}
                <br />
                Status:{" "}
                <span
                  style={{
                    color:
                      worker.status === "EMERGENCY"
                        ? "red"
                        : worker.status === "WARNING"
                        ? "orange"
                        : "green",
                    fontWeight: "bold",
                  }}
                >
                  {worker.status}
                </span>
                <br />
                Updated:{" "}
                {new Date(worker.updatedAt).toLocaleTimeString()}
              </Popup>
            </Marker>
        ))}

      </MapContainer>
    </div>
  );
};

export default WorkersMap;
