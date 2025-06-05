import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import MapPage from './pages/MapPage';
import WeatherPage from './pages/WeatherPage';
import ChatPage from './pages/ChatPage';

// PUBLIC_INTERFACE
function App() {
  // To re-mount main scrollable region at route change for better UX
  function ScrollToTop() {
    const { pathname } = useLocation();
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <NavBar />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/ai-chat" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;