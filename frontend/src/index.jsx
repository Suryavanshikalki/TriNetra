import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// ✅ i18n.js के लिए सबसे सुरक्षित रास्ता (Vite के लिए)
import './i18n'; 

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
  // 🔥 Error logging को और मजबूत बनाया गया है
  console.error("TriNetra Critical Error: Root element not found in index.html. Check if id='root' exists.");
}
