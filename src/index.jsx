// File: src/index.js (or src/main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // यह वो App.jsx है जो मैंने पहले दी थी
import { UserProvider } from './context/UserContext'; // हमारी नई Context फाइल
import './index.css'; // आपकी CSS फाइल (अगर है तो)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
