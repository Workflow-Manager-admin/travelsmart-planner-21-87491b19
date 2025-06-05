import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
function NavBar() {
  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="logo">
          <span className="logo-symbol">✈</span> TravelSmart Planner
        </div>
        <div className="nav-links">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/planner" className={linkClass}>
            Planner
          </NavLink>
          <NavLink to="/map" className={linkClass}>
            Map
          </NavLink>
          <NavLink to="/weather" className={linkClass}>
            Weather
          </NavLink>
          <NavLink to="/ai-chat" className={linkClass}>
            AI Suggestions
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
