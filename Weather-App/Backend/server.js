// backend/server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { getCached, setCached } from './cache.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.error('ERROR: OPENWEATHER_API_KEY is not set in .env');
  process.exit(1);
}

// Enable CORS for all routes (you can restrict origins in production)
app.use(cors());
app.use(express.json());

/**
 * GET /api/weather
 * Query parameters:
 *   - q (string) : city name, e.g. "London"   (optional if lat/lon provided)
 *   - lat (number), lon (number) : coordinates (optional if q provided)
 *   - units (string) : "metric" or "imperial" (default: "metric")
 *
 * Returns:
 *   {
 *     current: { ... },     // current weather data
 *     forecast: { ... }     // 5-day / 3-hour forecast data
 *   }
 */
app.get('/api/weather', async (req, res) => {
  try {
    const { q, lat, lon, units = 'metric' } = req.query;

    if (!q && (!lat || !lon)) {
      return res.status(400).json({ error: 'Please provide either city name (q) or lat & lon.' });
    }

    // Build params for API call
    const commonParams = {
      appid: API_KEY,
      units,
    };

    // 1. Current weather
    let currentParams;
    if (q) currentParams = { ...commonParams, q };
    else currentParams = { ...commonParams, lat, lon };

    // 2. 5-day forecast
    let forecastParams = { ...commonParams };
    if (q) forecastParams.q = q;
    else {
      forecastParams.lat = lat;
      forecastParams.lon = lon;
    }

    // Check cache first
    const cacheKeyCurrent = ['weather', currentParams];
    const cacheKeyForecast = ['forecast', forecastParams];

    const cachedCurrent = getCached('weather', currentParams);
    const cachedForecast = getCached('forecast', forecastParams);

    let currentData, forecastData;

    if (cachedCurrent) {
      currentData = cachedCurrent;
    } else {
      const url = `${BASE_URL}/weather`;
      const resp = await axios.get(url, { params: currentParams });
      currentData = resp.data;
      setCached('weather', currentParams, currentData);
    }

    if (cachedForecast) {
      forecastData = cachedForecast;
    } else {
      const url2 = `${BASE_URL}/forecast`;
      const resp2 = await axios.get(url2, { params: forecastParams });
      forecastData = resp2.data;
      setCached('forecast', forecastParams, forecastData);
    }

    return res.json({ current: currentData, forecast: forecastData });
  } catch (err) {
    console.error(err.message);
    if (err.response) {
      // If OpenWeather returns an error
      return res.status(err.response.status).json({ error: err.response.data.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Weather proxy server running on http://localhost:${PORT}`);
});
