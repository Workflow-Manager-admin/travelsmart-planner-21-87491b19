import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/*
  TravelSmart Planner Main App
  - Provides navigation, context management, and top-level integration
  - Centralizes all logic for API key handling, dynamic routing, and user guidance
  - Pages: Home, Planner, Map, Weather, AI Chat
  - Uses context to link planner/map, environment variables for API keys
*/

/* --- Context Definitions --- */
// PUBLIC_INTERFACE
export const UserRouteContext = createContext();

/* --- ENVIRONMENT KEYS & API URLs --- */
// Configure all API keys from environment (for production, use .env)
const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_KEY || '';
const MAPBOX_STYLE = 'light-v11';
const MAPBOX_DEFAULT_URL =
  `https://api.mapbox.com/styles/v1/mapbox/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_KEY}`;

const OPENWEATHERMAP_KEY = process.env.REACT_APP_OPENWEATHERMAP_KEY || '';
const AMADEUS_API_KEY = process.env.REACT_APP_AMADEUS_API_KEY || '';
const GPT_API_KEY = process.env.REACT_APP_GPT_KEY || '';

/* --- Helper: Map Error Banner --- */
function MapboxErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div style={{
      color: '#fff',
      background: '#e57373', border: '2px solid #f8b14f', borderRadius: 10,
      padding: 12, margin: '10px 0', textAlign: 'center', fontWeight: 600
    }}>
      Map Error: {error}
    </div>
  );
}

/* --- Navbar --- */
// PUBLIC_INTERFACE
function Navbar({ currentPage, onNavigate }) {
  /**
   * App-wide top navigation.
   */
  const navLinks = [
    { key: 'home', label: 'Home' },
    { key: 'planner', label: 'Planner' },
    { key: 'map', label: 'Map' },
    { key: 'weather', label: 'Weather' },
    { key: 'ai', label: 'AI Suggestions' }
  ];

  return (
    <nav className="navbar" style={{background: 'var(--base-dark)'}}>
      <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <div className="logo">
          <span className="logo-symbol" style={{color: '#f8b14f'}}>✈</span> TravelSmart Planner
        </div>
        <div style={{display: 'flex', gap: '8px'}}>
          {navLinks.map(({ key, label }) => (
            <button
              key={key}
              className="btn"
              style={{
                background: currentPage === key ? '#f8b14f' : '#b3eca7',
                color: currentPage === key ? '#fff' : '#222',
                borderBottom: currentPage === key ? '2px solid #cb7cb6' : 'none'
              }}
              onClick={() => onNavigate(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* --- Homepage --- */
// PUBLIC_INTERFACE
function HomePage({ onNavigate }) {
  /**
   * Homepage with a hero section and quick links.
   */
  return (
    <div className="hero" style={{ paddingTop: 120, minHeight: 400 }}>
      <div className="subtitle" style={{color: '#b3eca7', marginBottom: 6, fontWeight: 500}}>Plan Effortlessly</div>
      <h1 className="title" style={{color: '#f8b14f'}}>TravelSmart Planner</h1>
      <div className="description">
        Streamline your trip planning with personalized itineraries, interactive maps, live weather, and smart AI-powered travel tips!
      </div>
      <div style={{display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap', justifyContent: 'center'}}>
        <button className="btn btn-large" style={{background: '#cb7cb6', color:'#fff'}} onClick={() => onNavigate('planner')}>Start Planning</button>
        <button className="btn btn-large" style={{background: '#b3eca7', color:'#223', fontWeight: 600}} onClick={() => onNavigate('map')}>Explore Map</button>
        <button className="btn btn-large" style={{background: '#f8b14f', color:'#fff'}} onClick={() => onNavigate('ai')}>Ask AI</button>
      </div>
    </div>
  );
}

/* --- Planner --- */
// PUBLIC_INTERFACE
function PlannerPage() {
  /**
   * Trip planner with simple form and itinerary context.
   */
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    preferences: '',
  });
  const [itinerary, setItinerary] = useContext(UserRouteContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleGenerate(e) {
    e.preventDefault();
    // Demo placeholder: fill itinerary with fake route/info
    setItinerary({
      ...form,
      summary: `Trip from ${form.origin} to ${form.destination}, ${form.travelers} traveler(s), preferences: ${form.preferences ? form.preferences : 'none'}`
    });
  }

  return (
    <section className="form-section">
      <div className="section-title">Trip Planner</div>
      <div className="section-description">
        Enter your trip details and we'll generate a sample itinerary for you.
      </div>
      <form onSubmit={handleGenerate} style={{marginTop: 18, marginBottom: 16}}>
        <div className="form-group">
          <label className="form-label" htmlFor="origin">Origin</label>
          <input className="form-input" required name="origin" id="origin" placeholder="e.g. New York" value={form.origin} onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="destination">Destination</label>
          <input className="form-input" required name="destination" id="destination" placeholder="e.g. Paris" value={form.destination} onChange={handleChange}/>
        </div>
        <div className="form-group" style={{display: 'flex', gap: 22}}>
          <div style={{flex: 1}}>
            <label className="form-label" htmlFor="startDate">Start Date</label>
            <input className="form-input" required type="date" name="startDate" id="startDate" value={form.startDate} onChange={handleChange}/>
          </div>
          <div style={{flex: 1}}>
            <label className="form-label" htmlFor="endDate">End Date</label>
            <input className="form-input" required type="date" name="endDate" id="endDate" value={form.endDate} onChange={handleChange}/>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="travelers">Travelers</label>
          <input className="form-input" type="number" min="1" max="10" name="travelers" id="travelers" value={form.travelers} onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="preferences">Preferences (optional)</label>
          <input className="form-input" name="preferences" id="preferences" placeholder="Museums, food, shopping..." value={form.preferences} onChange={handleChange}/>
        </div>
        <button className="btn btn-large" type="submit">
          Generate Itinerary
        </button>
      </form>
      <div style={{minHeight: 38}}>
        {itinerary && itinerary.destination &&
          <div className="section-description" style={{background: '#b3eca7', color: '#23253a', padding: '12px 14px', borderRadius: 8}}>
            <div><b>Your Trip:</b></div>
            <div>{itinerary.summary}</div>
          </div>}
      </div>
      <div style={{color: '#888', fontSize: '0.97em', marginTop: 8}}>
        <b>API Note:</b> Integrate Amadeus or other APIs using keys from environment variables for live itineraries.
      </div>
    </section>
  );
}

/* --- Map Page --- */
// PUBLIC_INTERFACE
function MapPage() {
  /**
   * Map view with option for displaying itinerary routes.
   * Fails gracefully if Mapbox key is missing.
   */
  const [itinerary] = useContext(UserRouteContext);
  const [mapError, setMapError] = useState('');

  // Paris by default; draw polyline if possible with itinerary
  const start = itinerary && itinerary.origin ? itinerary.origin : 'Paris';
  const dest = itinerary && itinerary.destination ? itinerary.destination : 'Paris';

  // Demo: [lat,lng] for Paris
  const defaultCenter = [48.8566, 2.3522];
  // In a real app, fetch actual coordinates for start/dest locations via geocoding!

  let mapTileUrl = MAPBOX_KEY
    ? `https://api.mapbox.com/styles/v1/mapbox/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_KEY}`
    : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';

  let attribution = MAPBOX_KEY
    ? `&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>, &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>`
    : `&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; OpenMapTiles &copy; OpenStreetMap contributors`;

  useEffect(() => {
    if (!MAPBOX_KEY) setMapError('No Mapbox API Key, showing Stadia demo tiles.');
    else setMapError('');
  }, [MAPBOX_KEY]);

  return (
    <section className="map-section">
      <div className="section-title">Map & Route</div>
      <div className="section-description">
        Explore your destination(s) and route below.
      </div>
      <MapboxErrorBanner error={mapError}/>
      <div style={{ minHeight: 380, borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
        <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom={true} style={{ height: 380, width: '100%' }}>
          <TileLayer
            attribution={attribution}
            url={mapTileUrl}
          />
          <Marker position={defaultCenter}>
            <Popup>
              {start} (demo marker)
            </Popup>
          </Marker>
          {/* Extend: Render polylines/routes if itinerary contains multiple waypoints */}
        </MapContainer>
      </div>
      <div style={{ color: '#888', fontSize: '0.99em', marginTop: 8 }}>
        <b>API Note:</b> Add Mapbox API Key in .env for high-res maps and live routes! Basic demo tiles are always available.
      </div>
    </section>
  );
}

/* --- Weather Page --- */
// PUBLIC_INTERFACE
function WeatherPage() {
  /**
   * Basic weather fetch for demo; plug in OpenWeatherMap API to show real weather.
   */
  // Demo weather for Paris
  const [weather] = useState({
    city: 'Paris', temp: 22, icon: '☀️', desc: 'Sunny', forecast: '🌧️ Tomorrow 16°C, Wed ⛅ 18°C'
  });

  useEffect(() => {
    // Extend: fetch weather based on context/itinerary if API key available
    // Example:
    // if (OPENWEATHERMAP_KEY) fetch('weather API url ...')
  }, []);

  return (
    <section className="weather-section">
      <div className="section-title">Weather</div>
      <div className="section-description">
        See current and forecast weather for your destination.
      </div>
      <div className="weather-cards-container">
        <div className="weather-card">
          <div className="weather-title">{weather.icon} {weather.city}</div>
          <div className="weather-temp">{weather.temp}°C</div>
          <div>{weather.desc}</div>
          <div className="weather-forecast">{weather.forecast}</div>
        </div>
      </div>
      <div style={{ color: '#888', fontSize: '0.98em', marginTop: 10 }}>
        <b>API Note:</b> Integrate OpenWeatherMap for live data (API key required).
      </div>
    </section>
  );
}

/* --- AI Chat Page --- */
// PUBLIC_INTERFACE
function ChatPage() {
  /**
   * Chat bot for receiving travel advice. Plug in GPT/Cohere via API key.
   */
  const [msgs, setMsgs] = useState([
    { sender: 'ai', text: 'Hello! Ask me anything about your trip or destination.' }
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const chatWindowEnd = useRef(null);

  useEffect(() => {
    if (chatWindowEnd.current) chatWindowEnd.current.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, pending]);

  // Simulate async call to AI API
  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setMsgs(msgs => [...msgs, { sender: 'user', text: input.trim() }]);
    setInput('');
    setPending(true);

    setTimeout(() => {
      setMsgs(msgs => [...msgs, {
        sender: 'ai',
        text: "Here's a travel tip: Check for local public transport apps at your destination to save money and stress! (Demo reply)"
      }]);
      setPending(false);
    }, 1200); // fake delay
  }

  return (
    <section className="chat-section">
      <div className="section-title">AI Suggestions</div>
      <div className="section-description">
        Get instant answers to your questions about travel, destination activities, or planning.
      </div>
      <div className="chat-window">
        <div className="chat-messages">
          {msgs.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.sender}`}>{m.text}</div>
          ))}
          {pending && (
            <div className="chat-bubble ai">...</div>
          )}
          <div ref={chatWindowEnd}></div>
        </div>
        <form className="chat-input-row" onSubmit={handleSend} autoComplete="off">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask AI for tips, recommendations..."
            autoFocus
          />
          <button className="btn" style={{borderRadius: 7}} disabled={pending || !input.trim()} type="submit">Send</button>
        </form>
      </div>
      <div style={{ fontSize: '0.89em', color: '#aaa', marginTop: 12 }}>
        <b>API Note:</b> Connect OpenAI or Cohere for actual responses (provide a GPT API key).
      </div>
    </section>
  );
}

/* --- MAIN APP --- */
// PUBLIC_INTERFACE
function App() {
  /**
   * Main App: handles page routing, context mgmt, displays navigation/user instructions
   * Integrates all major features (planner, map, weather, AI chat)
   * All API keys must be present in .env for full functionality
   */

  // Navigation state (instead of react-router for basic demo)
  const [currentPage, setCurrentPage] = useState('home');

  // Planner data context (shared by planner and map)
  const [itinerary, setItinerary] = useState(null);

  // API Guidance Banner
  const showBanner = !MAPBOX_KEY || !OPENWEATHERMAP_KEY || !AMADEUS_API_KEY || !GPT_API_KEY;
  let missingKeys = [];
  if (!MAPBOX_KEY) missingKeys.push('Mapbox');
  if (!OPENWEATHERMAP_KEY) missingKeys.push('OpenWeatherMap');
  if (!AMADEUS_API_KEY) missingKeys.push('Amadeus');
  if (!GPT_API_KEY) missingKeys.push('GPT/Cohere');

  // Page renderer
  let PageComponent = null;
  if (currentPage === 'home') PageComponent = () => <HomePage onNavigate={setCurrentPage}/>;
  if (currentPage === 'planner') PageComponent = PlannerPage;
  if (currentPage === 'map') PageComponent = MapPage;
  if (currentPage === 'weather') PageComponent = WeatherPage;
  if (currentPage === 'ai') PageComponent = ChatPage;

  return (
    <UserRouteContext.Provider value={[itinerary, setItinerary]}>
      <div className="app">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage}/>
        <main className="main-content">
          <div className="container">
            {showBanner &&
              <div style={{
                background: '#ffecc0',
                color: '#cb7cb6',
                border: '1.5px solid #f8b14f',
                borderRadius: 8,
                padding: '12px 18px',
                marginBottom: 22,
                fontWeight: 500,
                textAlign: 'center'
              }}>
                <b>Notice:</b> For live data (weather, map, routes, AI), add the following API keys to your <code>.env</code> file:<br/>
                <span style={{ color: '#b3eca7', fontWeight: 600 }}>{missingKeys.join(', ')}</span>
              </div>
            }
            <PageComponent/>
          </div>
        </main>
      </div>
    </UserRouteContext.Provider>
  );
}

export default App;
