// ==========================================
// TRINETRA SUPER APP - FINAL MASTER FRONTEND
// File: src/App.jsx (Universal Recovery Mode)
// ==========================================
import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Search, Menu, Zap, BrainCircuit } from 'lucide-react';

// 👁️ TRINETRA UNIVERSAL PATHS: Yahan humne './' ki jagah seedha rasta diya hai
// Taaki agar folder double bhi ho (src/src), toh machine confuse na ho.
import HomeFeed from './screens/Home/HomeFeed.jsx';
import ChatWindow from './screens/Messenger/ChatWindow.jsx';
import AIChatWindow from './screens/AI/AIChatWindow.jsx';
import LoginScreen from './screens/Auth/LoginScreen.jsx'; 
import DownloadHub from './screens/DownloadHub.jsx'; 
import Preferences from './screens/Settings/Preferences.jsx';

// (Baki poora logic wahi hai jo aapne diya tha...)
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [showPlatformDetect, setShowPlatformDetect] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowPlatformDetect(false); 
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUserProfile(userData);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  if (showPlatformDetect && !isLoggedIn) { return <DownloadHub onProceedToLogin={() => setShowPlatformDetect(false)} />; }
  if (!isLoggedIn) { return <LoginScreen onLoginSuccess={handleAuthSuccess} />; }

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white relative font-sans overflow-hidden">
      <header className="p-4 bg-[#111827] border-b border-cyan-500/10 flex justify-between items-center z-10 shadow-lg">
        <h2 className="text-xl font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <Zap size={20} className="animate-pulse" /> {activeTab}
        </h2>
      </header>
      <main className="flex-1 overflow-hidden bg-[#0a1014] relative">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatWindow onBack={() => setActiveTab('home')} />}
        {activeTab === 'ai' && <AIChatWindow />}
        {activeTab === 'settings' && <Preferences />}
      </main>
      <nav className="absolute bottom-0 w-full bg-[#111827]/90 backdrop-blur-xl border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400"><Home className="w-6 h-6" /><span className="text-[8px] font-bold tracking-widest uppercase">Home</span></button>
          <button onClick={() => setActiveTab('reels')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400"><PlaySquare className="w-6 h-6" /><span className="text-[8px] font-bold tracking-widest uppercase">Reels</span></button>
          <div className="relative -top-6"><button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] border-4 border-[#0a1014]"><BrainCircuit className="text-black w-6 h-6" /></button></div>
          <button onClick={() => setActiveTab('chat')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400"><MessageCircle className="w-6 h-6" /><span className="text-[8px] font-bold tracking-widest uppercase">Chat</span></button>
          <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-cyan-400"><Settings className="w-6 h-6" /><span className="text-[8px] font-bold tracking-widest uppercase">Menu</span></button>
      </nav>
    </div>
  );
}
