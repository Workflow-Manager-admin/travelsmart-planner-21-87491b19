// Leaflet and react-leaflet imports are required at the top for ESLint compliance (import/first)
import React, { useState } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// PUBLIC_INTERFACE
function PlannerPage() {
  /**
   * Travel Planner Form for collecting user trip info.
   * Now, generates and displays an itinerary on submit.
   */
  const [form, setForm] = useState({
    from: '', to: '', dates: '', preferences: ''
  });
  const [itinerary, setItinerary] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Very basic "dynamic" itinerary generator (can upgrade to real API later).
  const generateItinerary = (userData) => {
    // Demo result - normally would call Amadeus/GPT API
    return [
      `Depart from ${userData.from}`,
      "Day 1: Arrival and hotel check-in.",
      `Explore local cuisine. (${userData.preferences || 'Try the most famous dish.'})`,
      "Day 2: Main sightseeing tour and museums.",
      "Evening: Relax at a popular nearby cafe.",
      "Day 3: Take a city walking tour. Buy souvenirs.",
      `Return to ${userData.from} from ${userData.to}.`
    ];
  };

  const handleSubmit = e => {
    e.preventDefault();
    const dynamic = generateItinerary(form);
    setItinerary({
      from: form.from,
      to: form.to,
      dates: form.dates,
      preferences: form.preferences,
      steps: dynamic
    });
  };

  return (
    <div style={{paddingTop:120, maxWidth:440, margin:'0 auto'}}>
      <h2 style={{color: '#f8b14f', marginBottom: 4}}>Travel Planner</h2>
      <div className="description" style={{marginBottom: 24}}>
        Fill in your travel details to generate a personalized itinerary.
      </div>
      <form
        style={{display: 'flex', flexDirection: 'column', gap: 14, background:'#fff2', padding:'24px 20px', borderRadius:10}}
        onSubmit={handleSubmit}
      >
        <label>
          From
          <input name="from" type="text" value={form.from} onChange={handleChange} required style={inputStyle} />
        </label>
        <label>
          To
          <input name="to" type="text" value={form.to} onChange={handleChange} required style={inputStyle} />
        </label>
        <label>
          Dates
          <input name="dates" type="text" value={form.dates} onChange={handleChange} placeholder="e.g. 2024-08-15 to 2024-08-20" style={inputStyle} />
        </label>
        <label>
          Preferences
          <input name="preferences" type="text" value={form.preferences} onChange={handleChange} placeholder="Beaches, food, museums..." style={inputStyle} />
        </label>
        <button className="btn btn-large" type="submit" style={{background:'#cb7cb6'}}>Get Itinerary</button>
      </form>
      {itinerary && (
        <div style={{marginTop:30, background:'#fff', borderRadius:10, padding:18}}>
          <h3 style={{color:'#f8b14f'}}>Your Itinerary</h3>
          <div style={{fontWeight:500, marginBottom:8}}>
            {itinerary.dates && <span>Dates: {itinerary.dates}<br/></span>}
            {itinerary.from && itinerary.to && (
              <span>From <strong>{itinerary.from}</strong> to <strong>{itinerary.to}</strong></span>
            )}
          </div>
          <ol>
            {itinerary.steps.map((step, idx) => <li key={idx}>{step}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
const inputStyle = {
  padding: '8px 10px',
  marginTop:4,
  borderRadius: 4,
  border: '1px solid #ccc',
  fontSize: '1rem',
  width:'100%'
};

/**
 * Try to convert city name to rough lat/lon using a static "database".
 */
function getLatLng(city) {
  // Demo dataset for main European cities. A real app would use proper API.
  const dict = {
    london: [51.5074, -0.1278],
    paris: [48.8566, 2.3522],
    berlin: [52.52, 13.405],
    rome: [41.9028, 12.4964],
    athens: [37.9838, 23.7275],
    madrid: [40.4168, -3.7038],
    lisbon: [38.7223, -9.1393],
    reykjavik: [64.1466, -21.9426],
    newyork: [40.7128, -74.006],
    tokyo: [35.6895, 139.6917]
  };
  if (!city) return null;
  const lower = city.trim().toLowerCase().replace(/[, ]/g,"");
  return dict[lower] || null;
}

// PUBLIC_INTERFACE
function MapPage() {
  /**
   * Interactive MapPage: shows a live Leaflet map. If itinerary available, plots route.
   * Falls back to Paris if nothing set.
   */
  // Quick local itinerary demo: in a real app would get this from app state/context.
  const [route, setRoute] = useState(() => {
    // For demo, try sample cities.
    return {
      from: "London",
      to: "Paris"
    };
  });

  // Geocode "from" and "to"
  const fromCoords = getLatLng(route.from);
  const toCoords = getLatLng(route.to);

  // Center center: midpoint or default Paris
  let center = [48.8566, 2.3522];
  if (fromCoords && toCoords) {
    center = [
      (fromCoords[0] + toCoords[0]) / 2,
      (fromCoords[1] + toCoords[1]) / 2
    ];
  } else if (fromCoords) {
    center = fromCoords;
  } else if (toCoords) {
    center = toCoords;
  }

  return (
    <div style={{paddingTop:120, display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h2 style={{color:'#cb7cb6'}}>Interactive Map</h2>
      <div className="description" style={{maxWidth:600,marginBottom:16}}>
        Explore destinations, see points of interest, and visualize your routes.
      </div>
      <div style={{ width: '100%', maxWidth: 800, minHeight: 360, margin: '18px 0', borderRadius: 14, border: '2px solid #f8b14f', overflow: 'hidden', background:'#e8f9ed'}}>
        <MapContainer center={center} zoom={5} style={{ height: 360, width: "100%" }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {fromCoords && (
            <Marker position={fromCoords}>
              <Popup>Start: {route.from}</Popup>
            </Marker>
          )}
          {toCoords && (
            <Marker position={toCoords}>
              <Popup>Destination: {route.to}</Popup>
            </Marker>
          )}
          {fromCoords && toCoords && (
            <Polyline positions={[fromCoords, toCoords]} color="#f8b14f" weight={5} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function WeatherPage() {
  /**
   * Weather page: shows mockup weather cards for destinations.
   */
  const mockWeather = [
    { city: 'London', temp: 19, desc: 'Cloudy', icon: '🌥️' },
    { city: 'Athens', temp: 31, desc: 'Sunny', icon: '☀️' },
    { city: 'Reykjavik', temp: 9, desc: 'Rainy', icon: '🌧️' }
  ];
  return (
    <div style={{paddingTop:120}}>
      <h2 style={{color:'#b3eca7'}}>Weather by Destination</h2>
      <div className="description" style={{marginBottom:16}}>See what to pack with up-to-date weather!</div>
      <div style={{display:'flex', gap:22, flexWrap:'wrap', marginTop:18}}>
        {mockWeather.map((w) => (
          <div key={w.city} style={{
            background:'#fff',
            padding:'18px 22px',
            borderRadius:10,
            boxShadow:'0 4px 24px 0 rgba(0,0,0,0.07)',
            minWidth:160,
            color:'#222',
            display:'flex',
            flexDirection:'column',
            alignItems:'center'
          }}>
            <div style={{fontSize:41}}>{w.icon}</div>
            <div style={{fontWeight:600,fontSize:'1.18rem',color:'#f8b14f'}}>{w.city}</div>
            <div style={{fontWeight:500, fontSize:22, margin:'6px 0'}}>{w.temp}&#8451;</div>
            <div>{w.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Simple AI suggestion function. Produces dynamic but local results for demo.
 * In reality, would call a backend or API like Cohere/OpenAI.
 */
function simpleAIAutoReply(userMsg) {
  const lower = userMsg.toLowerCase();
  if (lower.includes("food")) return "AI: For local food, try the top-rated restaurants on your first night!";
  if (lower.includes("museum")) return "AI: The city museum opens from 10am; don't miss the special art tour.";
  if (lower.includes("weather")) return "AI: Check the forecast before packing – summer is usually warm with light rains.";
  if (lower.includes("itinerary")) return "AI: Here is a sample itinerary: Day 1 - Explore the city; Day 2 - Take a guided tour; Day 3 - Relax at a local park.";
  if (lower.includes("flight")) return "AI: Consider flying midweek for the lowest fares!";
  if (lower.includes("budget")) return "AI: Set aside some budget for unique local experiences beyond just attractions.";
  return "AI: That's a great question! I'll look up some helpful travel tips for you.";
}

// PUBLIC_INTERFACE
function AISuggestionsPage() {
  /**
   * GPT AI Suggestions Chat interface (dynamic for demo now).
   */
  const [messages, setMessages] = useState([
    { user: false, text: "Hi! How can I help with your travel plans?" }
  ]);
  const [input, setInput] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { user: true, text: input },
      { user: false, text: simpleAIAutoReply(input) }
    ]);
    setInput('');
  };

  return (
    <div style={{paddingTop:120, maxWidth: 480, margin:'0 auto', display:'flex', flexDirection:'column', height:'60vh'}}>
      <h2 style={{color:'#f8b14f'}}>AI Travel Assistant</h2>
      <div className="description" style={{marginBottom:16}}>Chat with our AI for recommendations, tips, or itinerary help.</div>
      <div style={{
        flex:1,
        background:'#fff2',
        borderRadius:8,
        padding:'16px 8px',
        marginBottom:14,
        overflowY:'auto',
        border: '1px solid #b3eca7',
        minHeight:180
      }}>
        {messages.map((m, i) =>
          <div key={i} style={{
            margin:'8px 0',
            alignSelf: m.user ? 'flex-end' : 'flex-start'
          }}>
            <span style={{
              background: m.user ? '#f8b14f' : '#cb7cb6',
              color:'#fff',
              padding:'8px 12px',
              borderRadius:7,
              fontSize:'1rem',
              display: 'inline-block'
            }}>{m.text}</span>
          </div>
        )}
      </div>
      <form style={{display:'flex', gap:8}} onSubmit={send}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything about your trip..."
          style={{flex:1, fontSize:'1rem', padding:'10px 12px', borderRadius:4, border:'1px solid #b3eca7'}}
        />
        <button className="btn" style={{background:'#f8b14f', color:'#fff', fontWeight:600}} type="submit">Send</button>
      </form>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main TravelSmart Planner container, switches between main feature pages.
   */
  const [page, setPage] = useState('home');

  let pageContent;
  switch (page) {
    case 'home':
      pageContent = <HomePage onNavigate={setPage} />; break;
    case 'planner':
      pageContent = <PlannerPage />; break;
    case 'map':
      pageContent = <MapPage />; break;
    case 'weather':
      pageContent = <WeatherPage />; break;
    case 'ai':
      pageContent = <AISuggestionsPage />; break;
    default:
      pageContent = <HomePage onNavigate={setPage} />;
  }

  return (
    <div className="app" style={{background:'#fafffb', minHeight:'100vh'}}>
      <Navbar currentPage={page} onNavigate={setPage}/>
      <main style={{padding:'0 0 64px 0'}}>
        <div className="container">
          {pageContent}
        </div>
      </main>
    </div>
  );
}

export default App;
