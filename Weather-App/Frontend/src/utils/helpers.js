// frontend/src/utils/helpers.js

/**
 * Convert a Unix timestamp (in seconds) to human‐readable local time.
 * @param {number} ts  Unix timestamp (seconds)
 * @param {string} timezoneOffset  Seconds offset from UTC (provided by OpenWeatherMap)
 * @returns {string} e.g. "Tue, Jun 3, 2025 14:05"
 */
export function formatDateTime(ts, timezoneOffset) {
  // OpenWeatherMap returns timezone offset in seconds
  const date = new Date((ts + timezoneOffset) * 1000);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * From the 3‐hourly forecast array (40 items), pick one data point per day at around 12:00 local time.
 * If exactly 12:00 is missing, picks the closest timestamp to 12:00.
 *
 * @param {Array} list  forecast.list array
 * @param {number} timezoneOffset
 * @returns {Array}  Array of up to 5 objects: { dt, temp, icon, description }
 */
export function extractDailyForecast(list, timezoneOffset) {
  const days = {};
  list.forEach((item) => {
    // Convert timestamp + offset to local date string "YYYY-MM-DD"
    const localTime = (item.dt + timezoneOffset) * 1000;
    const dateObj = new Date(localTime);
    const dateKey = dateObj.toISOString().slice(0, 10);

    // Target hour is 12:00 local (noon)
    const hourLocal = dateObj.getUTCHours();

    if (!days[dateKey]) {
      days[dateKey] = { item, hourDiff: Math.abs(hourLocal - 12) };
    } else {
      const existing = days[dateKey];
      const existingHourLocal = new Date((existing.item.dt + timezoneOffset) * 1000).getUTCHours();
      const existingDiff = Math.abs(existingHourLocal - 12);
      const newDiff = Math.abs(hourLocal - 12);
      if (newDiff < existingDiff) {
        days[dateKey] = { item, hourDiff: newDiff };
      }
    }
  });

  // Now transform "days" into sorted array of up to 5 entries
  const sortedKeys = Object.keys(days).sort();
  const result = sortedKeys.slice(0, 5).map((dateKey) => {
    const { item } = days[dateKey];
    return {
      dt: item.dt,
      temp: item.main.temp,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    };
  });

  return result;
}
