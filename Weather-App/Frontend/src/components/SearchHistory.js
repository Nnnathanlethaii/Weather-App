// frontend/src/components/SearchHistory.js
import React from 'react';
import styles from '../styles/SearchHistory.module.css';

export default function SearchHistory({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className={styles.container}>
      <h4>Recent Searches</h4>
      <ul className={styles.list}>
        {history.map((item, idx) => (
          <li key={idx}>
            <button onClick={() => onSelect(item.params)} className={styles.button}>
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
