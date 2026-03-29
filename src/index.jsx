import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './i18n.js'; // 100% Real Translation Engine

// Rendering the main TriNetra Super App Shell
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("TriNetra Critical Error: Root element not found in index.html");
}
