// Leaflet and react-leaflet imports are required at the top for ESLint compliance (import/first)
import React, { useState, useEffect } from 'react';
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

 
// PUBLIC_INTERFACE
function PlannerPage() {
  /**
   * Travel Planner Form for collecting user trip info.
   * Now, generates and displays an itinerary on submit.
   * Integrates Amadeus API using env keys in process.env:
   *   - process.env.REACT_APP_AMADEUS_API_KEY
   *   - process.env.REACT_APP_AMADEUS_API_SECRET
   */
  const [form, setForm] = useState({
    from: '', to: '', dates: '', preferences: ''
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reference Amadeus API keys securely via process.env
  const amadeusApiKey = process.env.REACT_APP_AMADEUS_API_KEY;
  const amadeusApiSecret = process.env.REACT_APP_AMADEUS_API_SECRET;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // STUB: Stub fetch to Amadeus; in real use, use amadeusApiKey/Secret for auth headers
  async function fetchItineraryFromAmadeus(userData) {
    // Placeholder for server call:
    // e.g., await fetch('/api/planner', { headers: { 'x-amadeus-key': amadeusApiKey, ... } }) 
    // For now, return static/dynamic locally
    return [
      `Depart from ${userData.from}`,
      "Day 1: Arrival and hotel check-in.",
      `Explore local cuisine. (${userData.preferences || 'Try the most famous dish.'})`,
      "Day 2: Main sightseeing tour and museums.",
      "Evening: Relax at a popular nearby cafe.",
      "Day 3: Take a city walking tour. Buy souvenirs.",
      `Return to ${userData.from} from ${userData.to}.`
    ];
  }

  // PUBLIC_INTERFACE
  const generateItinerary = (userData) => {
    // Demo result - normally would call Amadeus/GPT API with amadeusApiKey, amadeusApiSecret
    // Kept for fallback/demo
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

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    // Use Amadeus keys here for real call
    // Placeholder: Fetch demo itinerary, stub using Amadeus API key
    let dynamic;
    try {
      dynamic = await fetchItineraryFromAmadeus(form);
    } catch (err) {
      // fallback if fetch fails, should not occur in demo
      dynamic = generateItinerary(form);
    }
    setItinerary({
      from: form.from,
      to: form.to,
      dates: form.dates,
      preferences: form.preferences,
      steps: dynamic
    });
    setLoading(false);
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
   * Weather page: fetches live weather using OpenWeatherMap and displays card for each selected destination.
   * Uses REACT_APP_WEATHER_KEY from .env (process.env).
   * User can choose from a preset list or input a custom city.
   */
  const weatherApiKey = process.env.REACT_APP_WEATHER_KEY; // Secure API key reference

  // List of cities to showcase; can be adjusted for actual selection later
  const defaultCities = ['London', 'Athens', 'Reykjavik', 'Paris', 'Tokyo'];

  const [cities, setCities] = useState(defaultCities);
  const [weatherData, setWeatherData] = useState({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Fetch current weather for all cities on load or cities update
    // Only fire if API key exists
    if (!weatherApiKey) {
      setError('Weather API key missing. Set REACT_APP_WEATHER_KEY in .env');
      return;
    }
    setLoading(true);
    setError('');
    // Fetch in parallel
    Promise.all(
      cities.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${weatherApiKey}`
        )
          .then(async (res) => {
            if (!res.ok) throw new Error(`API error: ${res.status} for ${city}`);
            const data = await res.json();
            return { city, data };
          })
          .catch((err) => ({ city, error: err.message }))
      )
    )
      .then((results) => {
        // Build dictionary city -> weather details (or error)
        const byCity = {};
        results.forEach((r) => {
          if (r.data) {
            // Map OpenWeather fields to UI model
            byCity[r.city] = {
              temp: Math.round(r.data.main.temp),
              desc: r.data.weather[0].description,
              icon: getWeatherIcon(r.data.weather[0].main)
            };
          } else {
            byCity[r.city] = { temp: '--', desc: 'Could not fetch', icon: '❓', error: r.error };
          }
        });
        setWeatherData(byCity);
        setLoading(false);
      })
      .catch((err) => {
        setError('Problem loading weather: ' + err.message);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [cities, weatherApiKey]);

  // PUBLIC_INTERFACE
  function handleAddCity(e) {
    e.preventDefault();
    const newCity = input.trim();
    if (newCity && !cities.map(c => c.toLowerCase()).includes(newCity.toLowerCase())) {
      setCities([newCity, ...cities]);
      setInput('');
    }
  }

  // Return a simple emoji icon for given OpenWeatherMap summary
  function getWeatherIcon(main) {
    switch ((main || '').toLowerCase()) {
      case 'clouds': return '🌥️';
      case 'clear': return '☀️';
      case 'rain': return '🌧️';
      case 'drizzle': return '🌦️';
      case 'snow': return '❄️';
      case 'thunderstorm': return '⛈️';
      case 'mist': case 'fog': return '🌫️';
      default: return '🌡️';
    }
  }

  // PUBLIC_INTERFACE
  return (
    <div style={{paddingTop:120}}>
      <h2 style={{color:'#b3eca7'}}>Weather by Destination</h2>
      <div className="description" style={{marginBottom:16}}>
        See what to pack with up-to-date weather! Powered by <a href="https://openweathermap.org/" style={{color:'#f8b14f'}}>OpenWeatherMap</a>
      </div>
      <form style={{display:'flex', gap:8, marginBottom:16}} onSubmit={handleAddCity}>
        <input
          type="text"
          placeholder="Add city (e.g. Vienna)"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{padding:'8px 10px', borderRadius:4, border:'1px solid #cb7cb6'}}
        />
        <button className="btn" style={{background:'#cb7cb6', color:'#fff'}} type="submit" disabled={loading || !input.trim()}>Add</button>
      </form>
      {error && (
        <div style={{color:'#e57373', marginBottom:10, background:'#fffbea', border:'1px solid #f8b14f', padding:8, borderRadius:6}}>
          {error}
        </div>
      )}
      {loading && <div>Loading weather data...</div>}
      <div style={{display:'flex', gap:22, flexWrap:'wrap', marginTop:18}}>
        {cities.map((city) => {
          const w = weatherData[city];
          return (
            <div key={city} style={{
              background:'#fff',
              padding:'18px 22px',
              borderRadius:10,
              boxShadow:'0 4px 24px 0 rgba(0,0,0,0.07)',
              minWidth:160,
              color:'#222',
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              opacity: w && w.error ? 0.6 : 1
            }}>
              <div style={{fontSize:41}}>{(w && w.icon) || '🌡️'}</div>
              <div style={{fontWeight:600,fontSize:'1.18rem',color:'#f8b14f'}}>{city}</div>
              <div style={{fontWeight:500, fontSize:22, margin:'6px 0'}}>{(w && w.temp)!==undefined ? w.temp : '--'}&#8451;</div>
              <div>{(w && w.desc) || '...'}</div>
              {w && w.error &&
                <div style={{color:'#d66', fontSize:'0.95em', marginTop:10}} title={w.error}>
                  Could not fetch
                </div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Generates a travel suggestion using the Cohere API.
 * @param {string} userMsg The user message/question.
 * @param {string} cohereApiKey The API key for Cohere (from REACT_APP_COHERE_KEY).
 * @returns {Promise<string>} Resolves to the AI's reply text or error message.
 */
async function cohereAIAutoReply(userMsg, cohereApiKey) {
  // Uses Cohere's /v1/generate endpoint: https://docs.cohere.com/reference/generate
  const endpoint = "https://api.cohere.ai/v1/generate";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cohereApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: userMsg,
        max_tokens: 120,
        temperature: 0.7,
        // Optional improvement: you can add stop_sequences, etc.
        stop_sequences: [],
        return_likelihoods: "NONE"
      })
    });
    if (!res.ok) {
      // Try to extract Cohere error message if available
      let errMsg = `Cohere API error: ${res.status}`;
      try {
        const errBody = await res.json();
        if (errBody.message) errMsg = errBody.message;
      } catch (jsonErr) {
        // Could not parse error JSON
      }
      throw new Error(errMsg);
    }
    const data = await res.json();
    if (
      data &&
      Array.isArray(data.generations) &&
      data.generations.length > 0 &&
      typeof data.generations[0].text === "string"
    ) {
      // Clean final text output
      return "AI: " + data.generations[0].text.trim();
    } else {
      throw new Error("Malformed response from Cohere.");
    }
  } catch (e) {
    // Robust inline error handling for API/network/response issues
    return "AI (error): Could not get suggestion (" + e.message + ")";
  }
}

// PUBLIC_INTERFACE
function AISuggestionsPage() {
  /**
   * GPT AI Suggestions Chat interface using the Cohere API and a real API key from REACT_APP_COHERE_KEY.
   * Features:
   *   - Sends user message to Cohere API, gets AI reply, displays response and errors.
   *   - Fully asynchronous, robust error handling and per-response UI feedback.
   *   - Relevant inline comments for maintenance.
   */
  const [messages, setMessages] = useState([
    { user: false, text: "Hi! How can I help with your travel plans?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Pull Cohere API Key from .env via react-scripts (must be prefixed with REACT_APP_)
  const cohereApiKey = process.env.REACT_APP_COHERE_KEY;

  /**
   * Handles sending of user input to the Cohere API, and updates chat UI with responses.
   * Adds relevant error messages for missing API key, or API/network issues.
   */
  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Immediately add the user's message to the chat and set loading
    setMessages((prev) => [...prev, { user: true, text: input }]);
    setLoading(true);

    if (!cohereApiKey) {
      // Cohere key missing - fail fast and give user actionable error
      setMessages((prev) => [
        ...prev,
        { user: false, text: "AI (error): Cohere API key is missing. Please set REACT_APP_COHERE_KEY in your .env file." }
      ]);
      setLoading(false);
      setInput('');
      return;
    }

    // Fetch AI reply. Any error or malformed response is handled within cohereAIAutoReply (displays error string)
    try {
      // Await real network call to Cohere:
      const reply = await cohereAIAutoReply(input, cohereApiKey);
      setMessages((prev) => [...prev, { user: false, text: reply }]);
    } catch (err) {
      // Defensive catch, though API should always return via the error string above
      setMessages((prev) => [
        ...prev,
        { user: false, text: "AI (error): Failed to get suggestion." }
      ]);
    }
    setLoading(false);
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
        {/* Show all chat bubbles */}
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
        {/* Typing indicator when waiting for AI */}
        {loading && (
          <div style={{
            margin:'8px 0',
            alignSelf: 'flex-start'
          }}>
            <span style={{
              background: '#cb7cb6',
              color:'#fff',
              padding:'8px 12px',
              borderRadius:7,
              fontSize:'1rem',
              opacity: 0.72,
              display: 'inline-block'
            }}>AI is typing...</span>
          </div>
        )}
      </div>
      <form style={{display:'flex', gap:8}} onSubmit={send}>
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything about your trip..."
          style={{flex:1, fontSize:'1rem', padding:'10px 12px', borderRadius:4, border:'1px solid #b3eca7'}}
        />
        <button
          className="btn"
          style={{background:'#f8b14f', color:'#fff', fontWeight:600}}
          type="submit"
          disabled={loading || !input.trim()}>
          {loading ? "..." : "Send"}
        </button>
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