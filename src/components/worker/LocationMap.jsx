import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "../../services/leafletIconFix";
import socket from "../../socket";

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 18);
  }, [position, map]);

  return null;
};

const LocationMap = () => {

  const [position, setPosition] = useState([18.6770, 73.8987]); // default
  const [accuracy, setAccuracy] = useState(null);

  /* 📡 GPS Logic */
  useEffect(() => {

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(

      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setAccuracy(pos.coords.accuracy);
        setPosition([lat, lng]);

        // 🚀 SEND LIVE LOCATION TO SERVER
        socket.emit("worker-location-update", {
          lat,
          lng,
          updatedAt: Date.now()
        });

      },

      (err) => {
        console.error("GPS error:", err.message);
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, []);

  return (
    <div className="worker-card">

      <div className="location-title">📍 Live Location</div>

      <div className="map-wrapper">
        <MapContainer
          center={position}
          zoom={18}
          scrollWheelZoom={false}
          className="leaflet-map"
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap position={position} />

          <Marker position={position}>
            <Popup>
              You are here <br />
              Accuracy: {accuracy ? accuracy.toFixed(0) : "--"} m
            </Popup>
          </Marker>

          {accuracy && (
            <Circle
              center={position}
              radius={accuracy}
              pathOptions={{
                color: "blue",
                fillOpacity: 0.15,
              }}
            />
          )}

        </MapContainer>
      </div>

      <p className="gps-note">
        GPS accuracy depends on device & signal
      </p>

    </div>
  );
};

export default LocationMap;
