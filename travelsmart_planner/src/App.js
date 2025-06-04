import React, { useState } from 'react';
import './App.css';

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
   * Non-functional mockup for now.
   */
  const [form, setForm] = useState({
    from: '', to: '', dates: '', preferences: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={{paddingTop:120, maxWidth:440, margin:'0 auto'}}>
      <h2 style={{color: '#f8b14f', marginBottom: 4}}>Travel Planner</h2>
      <div className="description" style={{marginBottom: 24}}>
        Fill in your travel details to generate a personalized itinerary.
      </div>
      <form
        style={{display: 'flex', flexDirection: 'column', gap: 14, background:'#fff2', padding:'24px 20px', borderRadius:10}}
        onSubmit={e => { e.preventDefault(); alert('This is a demo form!'); }}
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

// PUBLIC_INTERFACE
function MapPage() {
  /**
   * Placeholder for interactive map (Leaflet etc).
   * For now, shows a styled mockup map area.
   */
  return (
    <div style={{paddingTop:120, display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h2 style={{color:'#cb7cb6'}}>Interactive Map</h2>
      <div className="description" style={{maxWidth:600,marginBottom:16}}>
        Explore destinations, see points of interest, and visualize your routes.
      </div>
      <div style={{
        width: '100%', maxWidth: 800, minHeight: 360,
        background: 'linear-gradient(135deg, #b3eca7 30%, #cb7cb6 90%)',
        borderRadius: 14, border: '2px solid #f8b14f', margin: '18px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
      }}>
        <span style={{fontSize: 44, color: '#f8b14f'}}>🗺️</span>
        <span style={{marginLeft:16}}>Map will appear here</span>
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

// PUBLIC_INTERFACE
function AISuggestionsPage() {
  /**
   * GPT AI Suggestions Chat interface (mockup for now).
   */
  const [messages, setMessages] = useState([
    { user: false, text: "Hi! How can I help with your travel plans?" }
  ]);
  const [input, setInput] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { user: true, text: input }, { user: false, text: "AI: (This is a demo!) Here's a tip for your trip." }]);
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
