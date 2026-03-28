import React from 'react';
import ReactDOM from 'react-dom/client';
// 👁️ TRINETRA FIX: Yahan App ke aage .jsx joda gaya hai
import App from './App.jsx'; 
// 👁️ TRINETRA FIX: Yahan UserContext ke aage .jsx joda gaya hai
import { UserProvider } from './context/UserContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
