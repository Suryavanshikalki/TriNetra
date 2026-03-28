import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; 

// 👁️ TRINETRA FIX: Yahan chhota 'c' kar diya gaya hai
import { UserProvider } from './context/Usercontext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
