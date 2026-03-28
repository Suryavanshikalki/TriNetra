import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; 

// 👁️ TRINETRA MASTER FIX: Yahan 'c' ko chhota kar diya gaya hai (Usercontext.jsx)
// kyunki aapke GitHub me file ka naam yahi hai!
import { UserProvider } from './context/Usercontext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
