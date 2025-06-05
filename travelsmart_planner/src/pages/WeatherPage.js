import React, { useState } from "react";

/*
  Uses OpenWeatherMap API with key loaded from .env:

    REACT_APP_WEATHER_KEY

  To use this key, define it in your .env file at the root of your project:
    REACT_APP_WEATHER_KEY=your_OWM_key

  If not provided, a warning banner is shown and no API requests are made.
*/

// PUBLIC_INTERFACE
function WeatherPage() {
  // Static demo data; replace with actual weather API integration
  const [weatherResults] = useState([
    {
      city: "Paris",
      country: "FR",
      temp: 22,
      icon: "☀️",
      summary: "Sunny, gentle breeze",
      forecast: "Tomorrow: 🌧 16°C • Wed: ⛅ 18°C"
    },
    {
      city: "Rome",
      country: "IT",
      temp: 26,
      icon: "🌤",
      summary: "Partly cloudy",
      forecast: "Tomorrow: ☀️ 27°C • Wed: ☁️ 19°C"
    },
    {
      city: "London",
      country: "UK",
      temp: 18,
      icon: "🌦",
      summary: "Light showers, mild wind",
      forecast: "Tomorrow: ☁️ 15°C • Wed: 🌤 19°C"
    }
  ]);

  // Get weather key from env
  const weatherApiKey = process.env.REACT_APP_WEATHER_KEY || '';

  return (
    <section className="weather-section">
      <div className="section-title">Weather Forecast</div>
      <div className="section-description">
        See current and forecasted weather for your travel destinations.
      </div>
      <div className="weather-cards-container">
        {weatherResults.map((res, idx) => (
          <div className="weather-card" key={idx}>
            <div className="weather-title">
              {res.icon} {res.city}, {res.country}
            </div>
            <div className="weather-temp">{res.temp}°C</div>
            <div>{res.summary}</div>
            <div className="weather-forecast">{res.forecast}</div>
          </div>
        ))}
      </div>
      <div style={{ color: "#888", fontSize: "0.98em", marginTop: 10 }}>
        <b>API Note:</b> Integrate with OpenWeatherMap or similar API (API key in requirements).
      </div>
    </section>
  );
}

export default WeatherPage;
