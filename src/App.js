import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const KEY = "ccdb8e75e5a4052e769bc71c0c7935f8";

// Map weather conditions to icon URLs (you can replace with your own icons or use emoji as placeholders)
const weatherIcons = {
  clear: "☀️",           // sunny
  clouds: "☁️",
  rain: "🌧️",
  thunderstorm: "⛈️",
  snow: "❄️",
  fog: "🌫️",
  mist: "🌫️",
  default: "🌡️",
};

const App = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [weatherClass, setWeatherClass] = useState("");
  const [dateTime, setDateTime] = useState(new Date());

  // Update dateTime every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`
      );
      setData(response.data);

      const weather = response.data.weather[0].main.toLowerCase();
      if (weather.includes("clear")) setWeatherClass("sunny");
      else if (weather.includes("cloud")) setWeatherClass("cloudy");
      else if (weather.includes("rain")) setWeatherClass("rainy");
      else if (weather.includes("thunderstorm")) setWeatherClass("stormy");
      else if (weather.includes("snow")) setWeatherClass("snowy");
      else if (weather.includes("fog") || weather.includes("mist")) setWeatherClass("foggy");
      else setWeatherClass("default");

    } catch (err) {
      alert("City not found. Please try again.");
      setWeatherClass("default");
      setData(null);
    }
  };

  // Get icon based on weather condition
  const getWeatherIcon = () => {
    if (!data) return weatherIcons.default;
    const weather = data.weather[0].main.toLowerCase();
    if (weather.includes("clear")) return weatherIcons.clear;
    if (weather.includes("cloud")) return weatherIcons.clouds;
    if (weather.includes("rain")) return weatherIcons.rain;
    if (weather.includes("thunderstorm")) return weatherIcons.thunderstorm;
    if (weather.includes("snow")) return weatherIcons.snow;
    if (weather.includes("fog") || weather.includes("mist")) return weatherIcons.fog;
    return weatherIcons.default;
  };

  // Format date and time nicely
  const formatDateTime = (dt) => {
    return dt.toLocaleString(); // You can customize this format if you want
  };

  return (
    <div className={`app-container ${weatherClass}`}>
      <h1 className="title">Weather App</h1>
      <div className="input-container">
        <input
          type="text"
          className="input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter the City Name"
        />
        <button className="button" onClick={fetchData}>Fetch</button>
      </div>

      {data && (
        <div className="weather-container">
          <h2 className="city">
            {data.name}, {data.sys.country} {getWeatherIcon()}
          </h2>
          <p>Date & Time: {formatDateTime(dateTime)}</p>
          <p>Temperature: {Math.round(data.main.temp - 273.15)}°C</p>
          <p>Weather: {data.weather[0].description}</p>
          <p>Latitude: {data.coord.lat}</p>
          <p>Longitude: {data.coord.lon}</p>
        </div>
      )}
    </div>
  );
};

export default App;
