import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/*
  Uses Mapbox API for maps if a .env key is provided:

    REACT_APP_MAPBOX_KEY

  Otherwise, falls back to Stadia demo tiles and warns the user.
*/

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

  // Mapbox key and tile url setup
  const mapboxKey = process.env.REACT_APP_MAPBOX_KEY || '';
  const mapboxStyle = "light-v11";
  const mapboxUrl = mapboxKey
    ? `https://api.mapbox.com/styles/v1/mapbox/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxKey}`
    : "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
  const attribution = mapboxKey
    ? '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>, &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    : '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; OpenMapTiles &copy; OpenStreetMap contributors';

  return (
    <section className="map-section">
      <div className="section-title">Interactive Map</div>
      <div className="section-description">
        Explore your destination(s) and route below. (Demo: Paris as an example.)
      </div>

      {!mapboxKey && (
        <div style={{
          background: "#ffe4e1",
          color: "#ae6c46",
          border: "1.5px solid #f8b14f",
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 12,
          fontWeight: 500,
          textAlign: "center"
        }}>
          <b>Mapbox API Key is missing.</b> Using fallback map tiles. For high-res maps, add<br/>
          <code>REACT_APP_MAPBOX_KEY</code> to your <code>.env</code>.<br/>
          <span style={{color:"#cb7cb6",fontSize:"0.93em"}}>.env example:<br/>
            REACT_APP_MAPBOX_KEY=your_mapbox_token
          </span>
        </div>
      )}

      <div style={{ minHeight: 380, borderRadius: 10, overflow: "hidden", marginBottom: 18 }}>
        <MapContainer center={center} zoom={6} scrollWheelZoom={true} style={{ height: 380, width: "100%" }}>
          <TileLayer
            attribution={attribution}
            url={mapboxUrl}
          />
          <Marker position={center}>
            <Popup>
              Paris, FR (Demo marker)
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div style={{ color: "#888", fontSize: "0.99em", marginTop: 8 }}>
        <b>API Note:</b> Provide <code>REACT_APP_MAPBOX_KEY</code> for real Mapbox tiles, or continue using demo tiles (features may be limited).
      </div>
    </section>
  );
}

export default MapPage;
