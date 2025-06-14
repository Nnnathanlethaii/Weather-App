// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css'; // optional global resets
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
