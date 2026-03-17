import { useState } from "react";
import { Polyline } from "react-leaflet";

const ManholeNavigator = ({ position, manholes }) => {

  const [targetId, setTargetId] = useState("");
  const [route, setRoute] = useState(null);

  // 🔍 Find route
  const findRoute = async () => {

    if (!manholes || !targetId) {
      alert("Enter valid Manhole ID");
      return;
    }

    const target = manholes.features.find(
      f => String(f.properties?.id) === targetId
    );

    if (!target) {
      alert("Manhole not found");
      return;
    }

    const [destLng, destLat] = target.geometry.coordinates;
    const [startLat, startLng] = position;

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const coords = data.routes[0].geometry.coordinates;

      const routeLatLng = coords.map(c => [c[1], c[0]]);

      setRoute(routeLatLng);

    } catch (err) {
      console.error("Routing error:", err);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>

      <input
        type="number"
        placeholder="Enter Manhole ID"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        style={{ padding: "6px", marginRight: "8px" }}
      />

      <button onClick={findRoute}>
        Navigate
      </button>

      {/* Draw route */}
      {route && (
        <Polyline
          positions={route}
          pathOptions={{ color: "blue", weight: 4 }}
        />
      )}

    </div>
  );
};

export default ManholeNavigator;