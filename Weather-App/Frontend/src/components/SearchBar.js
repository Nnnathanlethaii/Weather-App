// frontend/src/components/SearchBar.js
import React, { useState } from 'react';
import styles from '../styles/SearchBar.module.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    onSearch({ q: query.trim() });
    setQuery('');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSearch({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        alert('Unable to retrieve your location.');
      }
    );
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.searchButton}>
          🔍
        </button>
      </form>
      <button onClick={handleUseCurrentLocation} className={styles.locationButton}>
        📍 Use My Location
      </button>
    </div>
  );
}
