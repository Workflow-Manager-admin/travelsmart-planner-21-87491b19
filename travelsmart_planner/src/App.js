import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Context to share itinerary/route between planner and map
const UserRouteContext = createContext();

/**
 * IMPORTANT: For Vite support, all environment variables must be referenced as import.meta.env.VITE_YOUR_KEY.
 * To fully work with Vite, rename any .env variables from REACT_APP_* to VITE_*.
 * Example: .env entry should be VITE_WEATHER_KEY instead of REACT_APP_WEATHER_KEY, and so on.
 */

// Mapbox tile support: configure from .env if present (Vite: VITE_MAPBOX_KEY, CRA: REACT_APP_MAPBOX_KEY)
const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY || '';
const MAPBOX_STYLE = 'light-v11';
const MAPBOX_DEFAULT_URL =
  `https://api.mapbox.com/styles/v1/mapbox/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_KEY}`;

// Helper for Mapbox error
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

console.log('process.env', process.env);
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

 
/**
 * PUBLIC_INTERFACE
 * Travel Planner Page using Amadeus API for real-time itineraries.
 *
 * Handles authentication using environment-provided API Key and Secret.
 * Fetches a real itinerary from Amadeus Flight Offers when the form is submitted.
 * Handles errors, displays loading states, and provides guidance if API keys are missing.
 */
function PlannerPage({ onItinerary }) {
  const [form, setForm] = useState({
    from: '', to: '', dates: '', preferences: ''
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Read Amadeus API keys from .env (must be prefixed with VITE_ for Vite! If using CRA, use REACT_APP_)
  const amadeusApiKey = import.meta.env.VITE_AMADEUS_API_KEY;
  const amadeusApiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // PUBLIC_INTERFACE: Authenticate with Amadeus OAuth2 API to get Bearer token
  async function getAmadeusAccessToken() {
    // See: https://developers.amadeus.com/self-service-apis/docs/getting-started/authorize-access/api-key
    const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: amadeusApiKey,
      client_secret: amadeusApiSecret,
    }).toString();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `Could not authenticate with Amadeus: ${response.status} ${errText}`
      );
    }
    const json = await response.json();
    return json.access_token;
  }

  // PUBLIC_INTERFACE: Call Amadeus Flight Offers Search API
  async function fetchItineraryFromAmadeus(userData) {
    if (!amadeusApiKey || !amadeusApiSecret) {
      throw new Error(
        'Amadeus API key or secret is missing. Please set REACT_APP_AMADEUS_API_KEY and REACT_APP_AMADEUS_API_SECRET in your .env.'
      );
    }
    // Step 1: Get access token
    const token = await getAmadeusAccessToken();

    // Step 2: Parse and prepare parameters for search
    // Accepts city names or IATA (try to infer if possible)
    const from = (userData.from || '').trim().toUpperCase().slice(0, 3);
    const to = (userData.to || '').trim().toUpperCase().slice(0, 3);

    // Parse dates: Accepts '2024-08-10 to 2024-08-20' or single; default to today+1
    let dateOfTravel = '';
    if (userData.dates) {
      // Try to parse first date in "YYYY-MM-DD" or "YYYY-MM-DD to YYYY-MM-DD"
      const dateMatch = userData.dates.match(/(\d{4}-\d{2}-\d{2})/);
      dateOfTravel = dateMatch ? dateMatch[1] : '';
    }
    if (!dateOfTravel) {
      // Default: Tomorrow
      dateOfTravel = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    }

    // Step 3: Query Amadeus Flight Offers Search API
    const searchParams = new URLSearchParams({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: dateOfTravel,
      adults: "1",
      nonStop: "false",
      max: "3", // get up to 3 options for demo
    }).toString();

    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `Amadeus itinerary API error: ${res.status} ${errText}`
      );
    }
    const data = await res.json();

    // Step 4: Parse relevant details from Amadeus API results
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('No itineraries found. Check city codes or try a different trip.');
    }

    // For each offer, extract basic flight segment data and price
    const results = data.data.map((offer, idx) => {
      const itinerary = offer.itineraries?.[0]; // only outbound for now
      const firstSegment = itinerary?.segments?.[0];
      const dep = firstSegment?.departure;
      const arr = firstSegment?.arrival;
      // Build summary string
      return (
        `Option ${idx + 1}: ` +
        `Depart ${dep?.iataCode || from} ` +
        `(${dep?.at?.slice(0, 16) || dateOfTravel}) → ` +
        `Arrive ${arr?.iataCode || to} (${arr?.at?.slice(0, 16) || "?"}), ` +
        `Price: ${offer.price?.total || "? "}${offer.price?.currency || ""} ` +
        (userData.preferences ? ` - Pref: ${userData.preferences}` : "")
      );
    });
    return results;
  }

  // PUBLIC_INTERFACE: Static fallback itinerary if fetch fails or not configured
  function generateItinerary(userData) {
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

  // Handle form submission: authenticate, call API, parse/display result
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      // Get itinerary from Amadeus, or fallback if no keys
      let results;
      if (amadeusApiKey && amadeusApiSecret) {
        results = await fetchItineraryFromAmadeus(form);
      } else {
        throw new Error(
          'Amadeus API key or secret is missing. Please set REACT_APP_AMADEUS_API_KEY and REACT_APP_AMADEUS_API_SECRET in your .env.'
        );
      }
      const newItinerary = {
        from: form.from,
        to: form.to,
        dates: form.dates,
        preferences: form.preferences,
        steps: results
      };
      setItinerary(newItinerary);
      if (typeof onItinerary === "function") {
        onItinerary(newItinerary);
      }
    } catch (err) {
      // Show user-friendly error & fallback
      setError(
        "Could not fetch itinerary from Amadeus: " +
        (err?.message || "Unknown error") +
        ". Showing static demo itinerary below."
      );
      const demoItinerary = {
        from: form.from,
        to: form.to,
        dates: form.dates,
        preferences: form.preferences,
        steps: generateItinerary(form)
      };
      setItinerary(demoItinerary);
      if (typeof onItinerary === "function") {
        onItinerary(demoItinerary);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 120, maxWidth: 440, margin: '0 auto' }}>
      <h2 style={{ color: '#f8b14f', marginBottom: 4 }}>Travel Planner</h2>
      <div className="description" style={{ marginBottom: 24 }}>
        Fill in your travel details to generate a personalized itinerary.
      </div>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          background: '#fff2',
          padding: '24px 20px',
          borderRadius: 10
        }}
        onSubmit={handleSubmit}
      >
        <label>
          From (city or IATA code)
          <input
            name="from"
            type="text"
            value={form.from}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g., London or LHR"
          />
        </label>
        <label>
          To (city or IATA code)
          <input
            name="to"
            type="text"
            value={form.to}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g., Paris or CDG"
          />
        </label>
        <label>
          Dates
          <input
            name="dates"
            type="text"
            value={form.dates}
            onChange={handleChange}
            placeholder="e.g. 2024-09-10 to 2024-09-13"
            style={inputStyle}
          />
        </label>
        <label>
          Preferences
          <input
            name="preferences"
            type="text"
            value={form.preferences}
            onChange={handleChange}
            placeholder="Beaches, food, museums..."
            style={inputStyle}
          />
        </label>
        <button
          className="btn btn-large"
          type="submit"
          style={{ background: '#cb7cb6' }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Itinerary"}
        </button>
      </form>
      {error && (
        <div style={{
          color: '#dc3545',
          background: '#fff7f7',
          border: '1px solid #f8b14f',
          borderRadius: 8,
          marginTop: 16,
          padding: 12,
          fontWeight: 500
        }}>
          {error}
        </div>
      )}
      {itinerary && (
        <div style={{ marginTop: 30, background: '#fff', borderRadius: 10, padding: 18 }}>
          <h3 style={{ color: '#f8b14f' }}>Your Itinerary</h3>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>
            {itinerary.dates && <span>Dates: {itinerary.dates}<br /></span>}
            {itinerary.from && itinerary.to && (
              <span>
                From <strong>{itinerary.from}</strong> to <strong>{itinerary.to}</strong>
              </span>
            )}
          </div>
          <ol>
            {/* Each step shows real Amadeus result or fallback */}
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

function MapPage() {
  /**
   * Interactive MapPage: now supports Mapbox tiles from .env or OSM fallback,
   * uses route context if provided by Planner, plots dynamic point-to-point routes, shows map errors.
   */
  // Read route from context, fallback demo if not set
  const userRoute = useContext(UserRouteContext) || {};
  // Optionally, allow Map page to locally override route for demo/test

  // Allow user to simulate switching between OSM/Mapbox if no API key
  const [error, setError] = useState('');
  const [showTiles, setShowTiles] = useState(true);

  // Accept coordinates for map (from/to) from planner/user context, or fallback demo cities
  const route = {
    from: userRoute?.from || "London",
    to: userRoute?.to || "Paris"
  };

  const fromCoords = getLatLng(route.from);
  const toCoords = getLatLng(route.to);

  // Center map - default to midpoint or fallback Paris
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

  // Try Mapbox if API key present, otherwise OSM fallback
  let tileUrl = '';
  let attribution = '';
  if (MAPBOX_KEY) {
    tileUrl = MAPBOX_DEFAULT_URL;
    attribution =
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles &copy;<a href="https://www.mapbox.com/">Mapbox</a>';
  } else {
    tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  }

  const handleTileError = (e) => {
    setError("Could not load map tiles. " +
      (MAPBOX_KEY
        ? "Check your Mapbox API key in .env or your network connection."
        : "OpenStreetMap may be unavailable."));
    setShowTiles(false); // Hide the map
  };

  return (
    <div style={{ paddingTop: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ color: '#cb7cb6' }}>Interactive Map</h2>
      <div className="description" style={{ maxWidth: 600, marginBottom: 16 }}>
        Explore destinations, see points of interest, and visualize your routes.
      </div>
      <MapboxErrorBanner error={error} />
      {(showTiles) ? (
        <div style={{ width: '100%', maxWidth: 800, minHeight: 360, margin: '18px 0', borderRadius: 14, border: '2px solid #f8b14f', overflow: 'hidden', background: '#e8f9ed' }}>
          <MapContainer center={center} zoom={5} style={{ height: 360, width: "100%" }} scrollWheelZoom={true}>
            <TileLayer
              attribution={attribution}
              url={tileUrl}
              onError={handleTileError}
              maxZoom={18}
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
      ) : (
        <div style={{ color: "#cb7cb6", margin: "32px auto", textAlign: "center" }}>
          The map could not be displayed.<br />
          {MAPBOX_KEY ?
            "There may be a problem with your Mapbox API key or Mapbox service."
            : "OpenStreetMap tiles are not available. Please check your connection or Mapbox configuration."}
        </div>
      )}
    </div>
  );
}

 
/**
 * Weather page: fetches live weather using OpenWeatherMap for the specified user destination (city).
 * Uses REACT_APP_WEATHER_KEY from .env (process.env).
 * Allows input of any city; fetches and displays weather in real time after user request.
 */
function WeatherPage() {
  // Robust API key diagnostics: display exactly what the app sees,
  // and sanitize leading/trailing whitespace.
  // Use VITE_WEATHER_KEY via import.meta.env for Vite (or REACT_APP_WEATHER_KEY for CRA, but prefer VITE_*)
  let rawWeatherApiKey = import.meta.env.VITE_WEATHER_KEY;
  let weatherApiKey = (
    typeof rawWeatherApiKey === "string"
      ? rawWeatherApiKey.trim()
      : ""
  );

  const [searchCity, setSearchCity] = useState('');
  const [pending, setPending] = useState(''); // city being searched
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Return a simple emoji icon for given OpenWeatherMap summary
  function getWeatherIcon(main) {
    switch ((main || '').toLowerCase()) {
      case'clouds': return '🌥️';
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
  // Fetches weather for a given city; updates weather and error states
  async function fetchWeather(city) {
    setLoading(true);
    setPending(city);
    setWeather(null);
    setError('');
    // Provide maximal diagnostics for debugging env/key issues
    if (!weatherApiKey) {
      let envStateDetails = `REACT_APP_WEATHER_KEY = ${
        typeof rawWeatherApiKey === "undefined"
          ? "undefined"
          : JSON.stringify(rawWeatherApiKey)
      }`;
      setError(
        'Weather API key missing. Please ensure you have set REACT_APP_WEATHER_KEY in your .env file in the root of "travelsmart_planner" folder, the app was restarted after editing .env, and you have no extraneous whitespace or unquoted values.\n\n'
        + "What the app currently sees: " + envStateDetails
      );
      setLoading(false);
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${weatherApiKey}`;
      const res = await fetch(url);
      if (!res.ok) {
        let msg = `API error: ${res.status}`;
        try { const json = await res.json(); if (json.message) msg += ` - ${json.message}`; } catch (e) {}
        throw new Error(msg);
      }
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        desc: data.weather[0].description,
        city: data.name,
        country: data.sys.country,
        icon: getWeatherIcon(data.weather[0].main),
        wind: data.wind.speed,
        humidity: data.main.humidity,
        code: data.weather[0].main
      });
    } catch (e) {
      setError('Could not fetch weather for "' + city + `": ` + (e.message || 'Unknown error'));
      setWeather(null);
    } finally {
      setLoading(false);
      setPending('');
    }
  }

  // PUBLIC_INTERFACE: Handle form ("search city") submission
  function handleSubmit(e) {
    e.preventDefault();
    const city = searchCity.trim();
    if (!city) return;
    fetchWeather(city);
  }

  // Optionally, show a default city's weather when page loads (can change this if desired)
  useEffect(() => {
    // Show Paris as the initial weather result for demo
    fetchWeather('Paris');
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ paddingTop: 120, minHeight: 350 }}>
      <h2 style={{ color: '#b3eca7' }}>Weather by Destination</h2>
      <div className="description" style={{ marginBottom: 16 }}>
        Check the latest weather for your travel spot! Powered by{' '}
        <a href="https://openweathermap.org/" style={{ color: '#f8b14f' }}>OpenWeatherMap</a>
      </div>
      <form style={{ display: 'flex', gap: 8, marginBottom: 16, maxWidth: 400 }} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city (e.g. Vienna)"
          value={searchCity}
          onChange={e => setSearchCity(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: 4, border: '1px solid #cb7cb6', flex: 1 }}
          disabled={loading}
        />
        <button className="btn" style={{ background: '#cb7cb6', color: '#fff' }} type="submit" disabled={loading || !searchCity.trim()}>
          {loading ? 'Fetching...' : 'Show Weather'}
        </button>
      </form>
      {error && (
        <div style={{ color: '#e57373', marginBottom: 10, background: '#fffbea', border: '1px solid #f8b14f', padding: 8, borderRadius: 6 }}>
          {error}
        </div>
      )}
      {loading && <div>Loading weather data...</div>}

      {weather && (
        <div style={{
          marginTop: 18,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
          maxWidth: 310,
          margin: '0 auto',
          padding: '24px 20px',
          color: '#222',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: 55 }}>{weather.icon}</div>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#f8b14f', marginBottom: 2 }}>
            {weather.city}{weather.country ? ', ' + weather.country : ''}
          </div>
          <div style={{ fontWeight: 600, fontSize: 30, margin: '8px 0' }}>
            {weather.temp}&deg;C
          </div>
          <div style={{ textTransform: 'capitalize', marginBottom: 8 }}>{weather.desc}</div>
          <div style={{ fontSize: '1em', color: '#777', marginBottom: 0 }}>Humidity: {weather.humidity}% &nbsp;|&nbsp; Wind: {weather.wind} m/s</div>
        </div>
      )}
      {!weather && !loading && !error && (
        <div style={{ color: '#cb7cb6', marginTop: 24 }}>Enter a city to see live weather.</div>
      )}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Generates a travel suggestion using the Cohere API.
 * @param {string} userMsg The user message/question.
 * @param {string} cohereApiKey The API key for Cohere (from VITE_COHERE_KEY if using Vite).
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

  // Pull Cohere API Key from .env (must be prefixed with VITE_ for Vite support!)
  const cohereApiKey = import.meta.env.VITE_COHERE_KEY;

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
        { user: false, text: "AI (error): Cohere API key is missing. Please set VITE_COHERE_KEY in your .env file (not REACT_APP_COHERE_KEY), restart your dev server, and try again." }
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

function App() {
  /**
   * Main TravelSmart Planner container, switches between main feature pages and provides user route data via context.
   */
  const [page, setPage] = useState('home');
  // Track itinerary/route state at app level to pass to Map
  const [plannerRoute, setPlannerRoute] = useState({});

  // Share route state: when planner generates an itinerary, we capture from/to and dates
  function handleItineraryUpdate(itinerary) {
    // itinerary: { from, to, dates, preferences, steps }
    if (itinerary && itinerary.from && itinerary.to) {
      setPlannerRoute({ from: itinerary.from, to: itinerary.to });
    }
  }

  let pageContent;
  switch (page) {
    case 'home':
      pageContent = <HomePage onNavigate={setPage} />; break;
    case 'planner':
      pageContent = <PlannerPage onItinerary={handleItineraryUpdate} />; break;
    case 'map':
      pageContent = <MapPage />; break;
    case 'weather':
      pageContent = <WeatherPage />; break;
    case 'ai':
      pageContent = <AISuggestionsPage />; break;
    default:
      pageContent = <HomePage onNavigate={setPage} />;
  }

  // Show a one-time hint at the top of the app if a .env variable seems missing (could be improved)
  let envNotices = [];
  if (!import.meta.env.VITE_WEATHER_KEY) {
    envNotices.push('VITE_WEATHER_KEY');
  }
  if (!import.meta.env.VITE_COHERE_KEY) {
    envNotices.push('VITE_COHERE_KEY');
  }
  if (!import.meta.env.VITE_AMADEUS_API_KEY || !import.meta.env.VITE_AMADEUS_API_SECRET) {
    envNotices.push('VITE_AMADEUS_API_KEY / VITE_AMADEUS_API_SECRET');
  }
  // Show at-top alert if any primary variable missing (makes migration advice clear)
  return (
    <UserRouteContext.Provider value={plannerRoute}>
      <div className="app" style={{background:'#fafffb', minHeight:'100vh'}}>
        {envNotices.length > 0 && (
          <div style={{
            background: '#f8b14f', color: '#fff', fontWeight: 600,
            textAlign: "center", padding: 12, borderBottom: "2px solid #cb7cb6"
          }}>
            <div>
              <span role="img" aria-label="info" style={{marginRight:6}}>⚠️</span>
              Some .env API variables are missing: <span style={{fontWeight:800}}>{envNotices.join(', ')}</span>.&nbsp;
              For Vite compatibility, rename all environment variables from <b>REACT_APP_*</b> to <b>VITE_*</b> and access them via <code>import.meta.env.VITE_YOUR_KEY</code>.<br />
              After fixing .env, fully restart the dev server!
            </div>
          </div>
        )}
        <Navbar currentPage={page} onNavigate={setPage}/>
        <main style={{padding:'0 0 64px 0'}}>
          <div className="container">
            {pageContent}
          </div>
        </main>
      </div>
    </UserRouteContext.Provider>
  );
}

export default App;  