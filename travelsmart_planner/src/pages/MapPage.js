import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon import issue when used with React
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// PUBLIC_INTERFACE
function MapPage() {
  // Demo center: Paris
  const center = [48.8566, 2.3522];

  return (
    <section className="map-section">
      <div className="section-title">Interactive Map</div>
      <div className="section-description">
        Explore your destination(s) and route below. (Demo: Paris as an example.)
      </div>
      <div style={{ minHeight: 380, borderRadius: 10, overflow: "hidden", marginBottom: 18 }}>
        <MapContainer center={center} zoom={6} scrollWheelZoom={true} style={{ height: 380, width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; OpenMapTiles &copy; OpenStreetMap contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
          <Marker position={center}>
            <Popup>
              Paris, FR (Demo marker)
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div style={{ color: "#888", fontSize: "0.99em", marginTop: 8 }}>
        <b>API Note:</b> Dynamic markers and paths can be rendered here. Add Mapbox token or custom tiles as needed.
      </div>
    </section>
  );
}

export default MapPage;
