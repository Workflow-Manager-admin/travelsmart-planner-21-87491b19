import React from "react";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="hero">
      <div className="subtitle">Ultimate Trip Organizer</div>
      <h1 className="title">TravelSmart Planner</h1>
      <div className="description">
        Plan your travels smarter: Build custom itineraries, visualize destinations on a map, get the latest weather for any location, and let AI suggest activities tailored just for you!
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "30px 0" }}>
        <button className="btn btn-large" onClick={() => navigate("/planner")}>
          Start Planning
        </button>
        <button className="btn btn-large" style={{ background: "var(--secondary)", color: "#fff" }} onClick={() => navigate("/map")}>
          Explore Map
        </button>
        <button className="btn btn-large" style={{ background: "var(--accent)", color: "#23253a" }} onClick={() => navigate("/weather")}>
          Check Weather
        </button>
        <button className="btn btn-large" style={{ background: "#cb7cb6", color: "#fff" }} onClick={() => navigate("/ai-chat")}>
          Ask AI
        </button>
      </div>
      <div className="section-description" style={{ marginTop: 18 }}>
        Seamlessly organize your next adventure, get instant info, and receive insightful suggestions – all in one simple app.
      </div>
    </div>
  );
}

export default HomePage;
