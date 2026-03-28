// File: src/screens/Auth/LoginScreen.jsx
import React, { useState, useEffect } from 'react';
import { Download, Eye, Github, Mail, Phone, Chrome, Apple, Monitor } from 'lucide-react';

export default function LoginScreen({ platform, onLogin }) {
  const [showSplash, setShowSplash] = useState(true);
  const [authInput, setAuthInput] = useState('');

  // 👁️🔥 Point 1: Splash Screen (TriNetra Name & Logo for 2 Seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = (provider) => {
    if (provider === 'Phone' || provider === 'Email') {
      if (!authInput) return alert("Security Check: Please enter your Mobile or Email first!");
    }
    
    /**
     * 🛡️ Point 2: GitHub Gatekeeper Logic
     * GitHub se login par system sirf AI Section (Mode A/B) kholega.
     * Baki 5 tariko se pura Social Universe khulega.
     */
    alert(`Generating Permanent TriNetra ID for ${provider}...`);
    onLogin(provider, authInput);
  };

  // Splash Screen UI
  if (showSplash) {
    return (
      <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white animate-pulse">
        <Eye size={100} className="text-cyan-400 mb-4 shadow-[0_0_50px_rgba(0,230,255,0.5)]" />
        <h1 className="text-4xl font-black tracking-[0.3em] uppercase italic">TriNetra</h1>
        <p className="text-cyan-500 text-[10px] mt-2 tracking-widest font-bold">THE ULTIMATE 6-IN-1 UNIVERSE</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
      
      {/* 🌐 Point 1: Website Download Hub (Auto-Detect OS) */}
      {platform !== 'Installed' && (
        <button className="absolute top-6 w-11/12 max-w-sm bg-cyan-500 text-black p-3 rounded-2xl font-black flex justify-center items-center shadow-[0_10px_20px_rgba(0,230,255,0.3)] hover:scale-105 transition-all">
          <Download className="mr-2" size={20}/> INSTALL FOR {platform.toUpperCase()}
        </button>
      )}

      {/* TriNetra Universal Logo */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,230,255,0.2)] rotate-45">
          <Eye size={50} className="text-cyan-400 -rotate-45" />
        </div>
      </div>
      
      <h1 className="text-4xl font-black text-white mb-1 tracking-tighter italic">TriNetra Login</h1>
      <p className="text-gray-500 text-[10px] mb-10 font-bold tracking-[0.2em] uppercase">Security Level: Permanent ID Generation</p>
      
      {/* 🛡️ Point 2: Gatekeeper Login Options (NO SKIP) */}
      <div className="w-full max-w-sm space-y-4">
        <div className="relative">
            <input 
              type="text" 
              placeholder="Mobile Number / Email Address" 
              className="w-full bg-gray-900/50 border border-gray-800 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all placeholder:text-gray-600 font-medium"
              value={authInput}
              onChange={(e) => setAuthInput(e.target.value)}
            />
        </div>
        
        {/* Main 5 Methods (Social + AI Access) */}
        <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleLoginClick('Phone')} className="bg-cyan-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-500 transition-all">
                <Phone size={18}/> OTP
            </button>
            <button onClick={() => handleLoginClick('Email')} className="bg-blue-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all">
                <Mail size={18}/> EMAIL
            </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
            <button onClick={() => handleLoginClick('Google')} className="bg-white text-black p-4 rounded-2xl font-black flex items-center justify-center shadow-lg active:scale-90 transition">
                <Chrome size={20}/>
            </button>
            <button onClick={() => handleLoginClick('Apple')} className="bg-gray-800 text-white p-4 rounded-2xl font-black flex items-center justify-center shadow-lg active:scale-90 transition">
                <Apple size={20}/>
            </button>
            <button onClick={() => handleLoginClick('Microsoft')} className="bg-blue-800 text-white p-4 rounded-2xl font-black flex items-center justify-center shadow-lg active:scale-90 transition">
                <Monitor size={20}/>
            </button>
        </div>
        
        <div className="pt-4 border-t border-gray-800">
            {/* 🚨 Point 2: GitHub Login (Strict AI Entry) */}
            <button 
              onClick={() => handleLoginClick('GitHub')} 
              className="w-full bg-black border-2 border-gray-700 p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:border-white transition-all group"
            >
              <Github size={22} className="group-hover:text-cyan-400" />
              <span>DEVELOPER PORTAL (AI ONLY)</span>
            </button>
            <p className="text-[9px] text-gray-600 mt-3 font-bold uppercase tracking-widest">
                GitHub access restricted to Mode A & Mode B
            </p>
        </div>
      </div>

      <p className="absolute bottom-6 text-[9px] text-gray-700 font-bold">
        TRINETRA SECURITY HUB v5.0 • NO SKIP POLICY ACTIVE
      </p>
    </div>
  );
}
