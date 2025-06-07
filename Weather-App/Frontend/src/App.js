// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { fetchWeather } from './api';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastChart from './components/ForecastChart';
import SearchHistory from './components/SearchHistory';
import LoadingSpinner from './components/LoadingSpinner';

import styles from './styles/App.module.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [units, setUnits] = useState('metric'); // allow toggle Celsius/Fahrenheit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('weatherSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
  }, [history]);

  const handleSearch = async (searchParams) => {
    setError('');
    setLoading(true);
    setWeatherData(null);
    try {
      const data = await fetchWeather({ ...searchParams, units });
      setWeatherData(data);

      // Add to history (by city name or coords)
      const key = searchParams.q
        ? searchParams.q.trim().toLowerCase()
        : `${searchParams.lat.toFixed(2)},${searchParams.lon.toFixed(2)}`;

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.key !== key);
        return [{ key, label: searchParams.q || 'My Location', params: searchParams }, ...filtered].slice(0, 5);
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch weather.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (params) => {
    handleSearch(params);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Weather Dashboard</h1>
        <div className={styles.unitToggle}>
          <button
            onClick={() => setUnits('metric')}
            className={units === 'metric' ? styles.active : ''}
          >
            °C
          </button>
          <button
            onClick={() => setUnits('imperial')}
            className={units === 'imperial' ? styles.active : ''}
          >
            °F
          </button>
        </div>
      </header>

      <SearchBar onSearch={handleSearch} />

      {loading && <LoadingSpinner />}

      {error && <div className={styles.error}>{error}</div>}

      {weatherData && (
        <>
          <CurrentWeather data={weatherData.current} units={units} />
          <ForecastChart
            forecastData={weatherData.forecast}
            timezoneOffset={weatherData.current.timezone}
            units={units}
          />
        </>
      )}

      <SearchHistory history={history} onSelect={handleHistoryClick} />
    </div>
  );
}

export default App;
