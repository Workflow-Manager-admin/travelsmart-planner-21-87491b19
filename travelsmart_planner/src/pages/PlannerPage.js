import React, { useState } from "react";

// PUBLIC_INTERFACE
function PlannerPage() {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "1",
    preferences: "",
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handles form field change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  // Stub: Placeholder for API integration
  function handleGenerateItinerary(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate async fetch; insert fetch/axios with Amadeus API here
    setTimeout(() => {
      setItinerary({
        destination: form.destination,
        duration: "5 days",
        summary: "Day 1: Arrival • Day 2: Museums • Day 3: Landmarks • Day 4: Shopping • Day 5: Return.",
      });
      setLoading(false);
    }, 1400);
  }

  return (
    <section className="form-section">
      <div className="section-title">Trip Planner</div>
      <div className="section-description">
        Enter your trip details. We'll generate a personalized itinerary for you.
      </div>
      <form onSubmit={handleGenerateItinerary} style={{ marginTop: 18, marginBottom: 16 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="origin">Origin</label>
          <input className="form-input" required name="origin" id="origin" placeholder="e.g., New York" value={form.origin} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="destination">Destination</label>
          <input className="form-input" required name="destination" id="destination" placeholder="e.g., Paris" value={form.destination} onChange={handleChange} />
        </div>
        <div className="form-group" style={{ display: 'flex', gap: 22 }}>
          <div style={{ flex: 1 }}>
            <label className="form-label" htmlFor="startDate">Start Date</label>
            <input className="form-input" required type="date" name="startDate" id="startDate" value={form.startDate} onChange={handleChange} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label" htmlFor="endDate">End Date</label>
            <input className="form-input" required type="date" name="endDate" id="endDate" value={form.endDate} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group" style={{ maxWidth: 200 }}>
          <label className="form-label" htmlFor="travelers">Travelers</label>
          <select className="form-select" name="travelers" id="travelers" value={form.travelers} onChange={handleChange}>
            {[1,2,3,4,5,6].map(n => (<option key={n} value={n}>{n}</option>))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="preferences">Preferences / Special Requests</label>
          <input className="form-input" name="preferences" id="preferences" placeholder="Museums, food, etc." value={form.preferences} onChange={handleChange} />
        </div>
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      <div style={{ minHeight: 58 }}>
        {itinerary && (
          <div className="section-description" style={{ background: "var(--accent)", color: "#23253a", padding: "18px 15px", borderRadius: 8, fontWeight: 500 }}>
            <div><b>Your {itinerary.duration} in {itinerary.destination}:</b></div>
            <div style={{ marginTop: 8 }}>{itinerary.summary}</div>
          </div>
        )}
      </div>
      <div style={{ color: "#888", fontSize: "0.97em", marginTop: 16 }}>
        <b>API Note:</b> Integrate <span style={{ color: "#cb7cb6" }}>Amadeus</span> travel APIs here (API keys in requirements).
      </div>
    </section>
  );
}

export default PlannerPage;
