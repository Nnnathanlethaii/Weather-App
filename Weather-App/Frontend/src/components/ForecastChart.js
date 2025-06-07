// frontend/src/components/ForecastChart.js
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { extractDailyForecast, formatDateTime } from '../utils/helpers';
import styles from '../styles/ForecastChart.module.css';

export default function ForecastChart({ forecastData, timezoneOffset, units }) {
  // forecastData is OpenWeatherMap's "forecast" object
  const { list } = forecastData;

  // Memoize daily data extraction
  const dailyData = useMemo(() => {
    const daily = extractDailyForecast(list, timezoneOffset);
    // Transform to chart data: [{ date: 'Mon 06/02', temp: 23 }, ...]
    return daily.map((item) => ({
      date: new Date((item.dt + timezoneOffset) * 1000).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'numeric',
        day: 'numeric',
      }),
      temp: Math.round(item.temp),
      icon: item.icon,
      description: item.description,
    }));
  }, [list, timezoneOffset]);

  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className={styles.container}>
      <h3>5‐Day Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit={tempUnit} />
          <Tooltip formatter={(value, name) => [`${value}${tempUnit}`, 'Temp']} />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#0077cc"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className={styles.iconsRow}>
        {dailyData.map((day) => (
          <div key={day.date} className={styles.dayIcon}>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              title={day.description}
            />
            <span>{day.temp}{tempUnit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
