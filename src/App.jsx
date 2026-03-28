// ==========================================
// TRINETRA SUPER APP - TOTAL 64 FILES MASTER
// File: src/App.jsx (The Final Engine)
// ==========================================
import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Search, Menu, Zap, BrainCircuit } from 'lucide-react';

// 👁️ TRINETRA DEEP RECOVERY: Exact File Paths
import HomeFeed from './screens/Home/HomeFeed.jsx';
import ChatWindow from './screens/Messenger/ChatWindow.jsx';
import AIChatWindow from './screens/AI/AIChatWindow.jsx';
import SettingsMenu from './screens/Settings/SettingsMenu.jsx';

// 🛡️ AUTH FILES (Aapke bataye anusar)
import LoginScreen from './screens/Auth/LoginScreen.jsx'; 
import ProfileSetup from './screens/Auth/ProfileSetup.jsx'; 

// 🚨 NEW FILES (Jo aaj banayi hain)
import DownloadHub from './screens/DownloadHub.jsx'; 
import Preferences from './screens/Settings/Preferences.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [showPlatformDetect, setShowPlatformDetect] = useState(true);

  // 🛡️ Persistence Check: Agar user pehle se login hai
  useEffect(() => {
    const savedUser = localStorage.getItem('trinetra_session');
    if (savedUser) {
      setUserProfile(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    
    // PWA Detection
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPlatformDetect(false);
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUserProfile(userData);
    setIsLoggedIn(true);
    localStorage.setItem('trinetra_session', JSON.stringify(userData));
    setActiveTab('home');
  };

  // 🚀 MASTER ROUTING
  if (showPlatformDetect && !isLoggedIn) {
      return <DownloadHub onProceedToLogin={() => setShowPlatformDetect(false)} />;
  }

  if (!isLoggedIn) {
      return <LoginScreen onLoginSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white relative font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="p-4 bg-[#111827] border-b border-cyan-500/10 flex justify-between items-center z-10 shadow-lg">
        <h2 className="text-xl font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <Zap size={20} className="animate-pulse" /> {activeTab}
        </h2>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-hidden bg-[#0a1014] relative">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatWindow onBack={() => setActiveTab('home')} />}
        {activeTab === 'ai' && <AIChatWindow />}
        {activeTab === 'settings' && <Preferences />}
        
        {activeTab === 'reels' && (
          <div className="h-full flex items-center justify-center bg-black">
              <p className="text-gray-500 font-bold tracking-widest uppercase">TriNetra Reels Engine Active</p>
          </div>
        )}
      </main>

      {/* NAVIGATION BAR */}
      <nav className="absolute bottom-0 w-full bg-[#111827]/90 backdrop-blur-xl border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-40">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Home className="w-6 h-6" /><span className="text-[8px] font-bold uppercase">Home</span>
          </button>
          
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center gap-1 ${activeTab === 'reels' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <PlaySquare className="w-6 h-6" /><span className="text-[8px] font-bold uppercase">Reels</span>
          </button>
          
          <div className="relative -top-6">
              <button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] border-4 border-[#0a1014]">
                  <BrainCircuit className="text-black w-6 h-6" />
              </button>
          </div>
          
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <MessageCircle className="w-6 h-6" /><span className="text-[8px] font-bold uppercase">Chat</span>
          </button>
          
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Settings className="w-6 h-6" /><span className="text-[8px] font-bold uppercase">Menu</span>
          </button>
      </nav>
    </div>
  );
}
