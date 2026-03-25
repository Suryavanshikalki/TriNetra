// File: src/screens/Auth/LoginScreen.jsx
import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function LoginScreen({ platform, onLogin }) {
  const [authInput, setAuthInput] = useState('');

  const handleLoginClick = (provider) => {
    if (provider === 'Phone' || provider === 'Email') {
      if (!authInput) return alert("Please enter your Phone or Email first!");
    }
    // API call later, currently triggering the UI state
    onLogin(provider, authInput);
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white text-center relative">
      
      {/* 6 Platform Download Hub */}
      {platform !== 'Installed' && (
        <button className="absolute top-4 w-11/12 bg-green-600 p-3 rounded-xl font-bold flex justify-center shadow-lg hover:bg-green-500 transition">
          <Download className="mr-2"/> Install TriNetra for {platform}
        </button>
      )}

      {/* Splash & Logo */}
      <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border-4 border-green-500 shadow-[0_0_30px_green] mb-6">
        <span className="text-4xl font-black text-green-500">T</span>
      </div>
      <h1 className="text-5xl font-black text-white mb-1 tracking-widest uppercase">TriNetra</h1>
      <p className="text-gray-500 text-xs mb-10 font-bold tracking-widest">NO SKIP. FULL SECURITY.</p>
      
      {/* Login Options */}
      <div className="w-full max-w-sm space-y-4">
        <input 
          type="text" 
          placeholder="Enter Mobile or Email" 
          className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-white outline-none focus:border-green-500 transition"
          value={authInput}
          onChange={(e) => setAuthInput(e.target.value)}
        />
        
        <div className="flex space-x-2">
            <button onClick={() => handleLoginClick('Phone')} className="flex-1 bg-green-600 p-3 rounded-xl font-bold hover:bg-green-500">OTP</button>
            <button onClick={() => handleLoginClick('Email')} className="flex-1 bg-blue-600 p-3 rounded-xl font-bold hover:bg-blue-500">Email</button>
        </div>

        <div className="flex space-x-2 mt-4">
            <button onClick={() => handleLoginClick('Google')} className="flex-1 bg-white text-black p-3 rounded-xl font-bold">Google</button>
            <button onClick={() => handleLoginClick('Apple')} className="flex-1 bg-gray-800 text-white p-3 rounded-xl font-bold">Apple</button>
            <button onClick={() => handleLoginClick('Microsoft')} className="flex-1 bg-blue-800 text-white p-3 rounded-xl font-bold">MS</button>
        </div>
        
        {/* GitHub for AI Coders Only */}
        <button onClick={() => handleLoginClick('GitHub')} className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl font-bold mt-4 hover:border-white transition">
          Log in with GitHub (AI Only)
        </button>
      </div>
    </div>
  );
}
