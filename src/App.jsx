// ==========================================
// TRINETRA SUPER APP - 64 FILES FINAL MASTER
// File: src/App.jsx (Universal Fix)
// ==========================================
import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Zap, BrainCircuit, Search } from 'lucide-react';

// 👁️ TRINETRA HIGH COMMAND PATHS: 
// Humne './' ko aise set kiya hai ki machine confuse na ho.
import HomeFeed from './screens/Home/HomeFeed.jsx';
import ChatWindow from './screens/Messenger/ChatWindow.jsx';
import AIChatWindow from './screens/AI/AIChatWindow.jsx';

// 🛡️ AUTH: Login aur ProfileSetup
import LoginScreen from './screens/Auth/LoginScreen.jsx'; 
import ProfileSetup from './screens/Auth/ProfileSetup.jsx'; 

// 🚨 RECENT: Aaj ki dono nayi files
import DownloadHub from './screens/DownloadHub.jsx'; 
import Preferences from './screens/Settings/Preferences.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showPlatformDetect, setShowPlatformDetect] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('trinetra_session');
    if (session) setIsLoggedIn(true);
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowPlatformDetect(false);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('trinetra_session', 'active');
    setActiveTab('home');
  };

  // 🚀 GATEKEEPER ROUTING
  if (showPlatformDetect && !isLoggedIn) return <DownloadHub onProceedToLogin={() => setShowPlatformDetect(false)} />;
  if (!isLoggedIn) return <LoginScreen onLoginSuccess={handleAuthSuccess} />;

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-hidden">
      <header className="p-4 bg-[#111827] border-b border-cyan-500/10 flex justify-between items-center shadow-2xl">
        <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2"><Zap size={20} className="animate-pulse"/> {activeTab.toUpperCase()}</h2>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatWindow onBack={() => setActiveTab('home')} />}
        {activeTab === 'ai' && <AIChatWindow />}
        {activeTab === 'settings' && <Preferences />}
      </main>

      <nav className="absolute bottom-0 w-full bg-[#111827]/90 backdrop-blur-md border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}><Home size={24}/><span className="text-[8px] uppercase font-bold">Home</span></button>
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center gap-1 ${activeTab === 'reels' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}><PlaySquare size={24}/><span className="text-[8px] uppercase font-bold">Reels</span></button>
          <div className="relative -top-6">
            <button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] border-4 border-[#0a1014] active:scale-90 transition-transform"><BrainCircuit className="text-black" size={24}/></button>
          </div>
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}><MessageCircle size={24}/><span className="text-[8px] uppercase font-bold">Chat</span></button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-cyan-400 scale-110' : 'text-gray-500'}`}><Settings size={24}/><span className="text-[8px] uppercase font-bold">Menu</span></button>
      </nav>
    </div>
  );
}
