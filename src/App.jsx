// ==========================================
// TRINETRA SUPER APP - FINAL MASTER FRONTEND
// File: src/App.jsx (The Main Engine)
// ==========================================
import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Search, Menu, Zap, BrainCircuit } from 'lucide-react';

// 👁️🔥 TRINETRA EXACT MATCH: 'Screens' ka 'S' bada hai!
import HomeFeed from './Screens/Home/HomeFeed.jsx';
import ChatWindow from './Screens/Messenger/ChatWindow.jsx';
import AIChatWindow from './Screens/AI/AIChatWindow.jsx';
import LoginScreen from './Screens/Auth/LoginScreen.jsx'; 

// 🚨 Ye rahi aapki dono nayi files jo aaj add hui hain!
import DownloadHub from './Screens/Auth/DownloadHub.jsx'; 
import Preferences from './Screens/Settings/Preferences.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  
  // 🚨 App Download Platform Checker
  const [showPlatformDetect, setShowPlatformDetect] = useState(true);

  // Check if app is installed as PWA or running in Web
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowPlatformDetect(false); 
    }
  }, []);

  // 🛡️ The Gatekeeper: Login Success Handler
  const handleAuthSuccess = (userData) => {
    setUserProfile(userData);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  // ==========================================
  // 🚀 SCREEN ROUTING ENGINE (The Viewport)
  // ==========================================
  
  // 1. Download Hub (App Download Page - Nayi File)
  if (showPlatformDetect && !isLoggedIn) {
      return <DownloadHub onProceedToLogin={() => setShowPlatformDetect(false)} />;
  }

  // 2. The Gatekeeper (Strict Login)
  if (!isLoggedIn) {
      return <LoginScreen onLoginSuccess={handleAuthSuccess} />;
  }

  // ==========================================
  // 📱 MAIN APP UI (After Login)
  // ==========================================
  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white relative font-sans overflow-hidden">
      
      {/* 🌟 HEADER */}
      <header className="p-4 bg-[#111827] border-b border-cyan-500/10 flex justify-between items-center z-10 shadow-lg">
        <h2 className="text-xl font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <Zap size={20} className="animate-pulse" /> {activeTab}
        </h2>
        <div className="flex space-x-4 items-center">
            {activeTab === 'home' && <Search className="text-gray-400 hover:text-white transition cursor-pointer"/>}
            {activeTab === 'settings' && <Menu className="text-gray-400 hover:text-white transition cursor-pointer"/>}
        </div>
      </header>

      {/* 🚀 MAIN CONTENT AREA (The Router) */}
      <main className="flex-1 overflow-hidden bg-[#0a1014] relative">
        
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatWindow onBack={() => setActiveTab('home')} />}
        {activeTab === 'ai' && <AIChatWindow />}
        
        {/* 🚨 Aapki nayi Settings file yahan active hai */}
        {activeTab === 'settings' && <Preferences />}
        
        {activeTab === 'reels' && (
          <div className="h-full flex items-center justify-center bg-black">
              <p className="text-gray-500 font-bold tracking-widest uppercase">TriNetra Reels Engine Active</p>
          </div>
        )}

      </main>

      {/* 📱 BOTTOM NAVIGATION */}
      <nav className="absolute bottom-0 w-full bg-[#111827]/90 backdrop-blur-xl border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400">
              <Home className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Home</span>
          </button>
          
          <button onClick={() => setActiveTab('reels')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400">
              <PlaySquare className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Reels</span>
          </button>
          
          <div className="relative -top-6">
              <button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] border-4 border-[#0a1014]">
                  <BrainCircuit className="text-black w-6 h-6" />
              </button>
          </div>
          
          <button onClick={() => setActiveTab('chat')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400">
              <MessageCircle className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Chat</span>
          </button>
          
          <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400">
              <Settings className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Menu</span>
          </button>
      </nav>
    </div>
  );
}
