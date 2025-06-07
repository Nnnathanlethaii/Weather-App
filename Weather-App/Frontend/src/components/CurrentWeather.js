// frontend/src/components/CurrentWeather.js
import React from 'react';
import { formatDateTime } from '../utils/helpers';
import styles from '../styles/CurrentWeather.module.css';

export default function CurrentWeather({ data, units }) {
  // `data` is OpenWeatherMap’s “current” object
  const {
    name,
    sys: { country, sunrise, sunset },
    weather,
    main: { temp, feels_like, humidity, temp_min, temp_max },
    wind: { speed },
    dt,
    timezone,
  } = data;

  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';

  return (
    <div className={styles.container}>
      <h2>
        {name}, {country}
      </h2>
      <p>{weather[0].description}</p>
      <div className={styles.mainInfo}>
        <img src={iconUrl} alt={weather[0].description} />
        <div className={styles.temps}>
          <span className={styles.currentTemp}>
            {Math.round(temp)}
            {tempUnit}
          </span>
          <span className={styles.feelsLike}>
            Feels like: {Math.round(feels_like)}
            {tempUnit}
          </span>
        </div>
      </div>
      <div className={styles.details}>
        <div>
          <strong>Min:</strong> {Math.round(temp_min)}
          {tempUnit}
        </div>
        <div>
          <strong>Max:</strong> {Math.round(temp_max)}
          {tempUnit}
        </div>
        <div>
          <strong>Humidity:</strong> {humidity}%
        </div>
        <div>
          <strong>Wind:</strong> {speed} {speedUnit}
        </div>
        <div>
          <strong>Sunrise:</strong> {formatDateTime(sunrise, timezone).split(', ')[1]}
        </div>
        <div>
          <strong>Sunset:</strong> {formatDateTime(sunset, timezone).split(', ')[1]}
        </div>
        <div>
          <strong>Last updated:</strong> {formatDateTime(dt, timezone)}
        </div>
      </div>
    </div>
  );
}
