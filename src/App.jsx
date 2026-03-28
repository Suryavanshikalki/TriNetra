// ==========================================
// TRINETRA SUPER APP - 64 FILES MASTER ENGINE
// ==========================================
import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Zap, BrainCircuit, Search, Menu } from 'lucide-react';

// 👁️ TRINETRA EXACT RECOVERY: Aapke screenshots ke hisaab se paths set hain
// Note: 'screens' ka 's' chhota rakha hai jaisa aapke 12:44 waale photo me tha.
import HomeFeed from './screens/Home/HomeFeed.jsx';
import ChatWindow from './screens/Messenger/ChatWindow.jsx';
import AIChatWindow from './screens/AI/AIChatWindow.jsx';

// 🛡️ AUTH CHECK: Login aur ProfileSetup 'Auth' folder mein hain
import LoginScreen from './screens/Auth/LoginScreen.jsx'; 
import ProfileSetup from './screens/Auth/ProfileSetup.jsx'; 

// 🚨 SCREEN CHECK: DownloadHub aur Preferences seedhe 'screens' folder mein hain
import DownloadHub from './screens/DownloadHub.jsx'; 
import Preferences from './screens/Settings/Preferences.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showPlatformDetect, setShowPlatformDetect] = useState(true);

  // Persistence logic (Data Safe)
  useEffect(() => {
    const session = localStorage.getItem('trinetra_session');
    if (session) setIsLoggedIn(true);
    
    // Check if app is installed (PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowPlatformDetect(false);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('trinetra_session', 'active');
    setActiveTab('home');
  };

  // 🚀 MASTER ROUTER (Gatekeeper)
  // 1. Pehle Download Page dikhao
  if (showPlatformDetect && !isLoggedIn) {
      return <DownloadHub onProceedToLogin={() => setShowPlatformDetect(false)} />;
  }

  // 2. Phir Login Screen dikhao
  if (!isLoggedIn) {
      return <LoginScreen onLoginSuccess={handleAuthSuccess} />;
  }

  // 3. Login ke baad asli App
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

      {/* 🚀 MAIN CONTENT AREA */}
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

      {/* 📱 BOTTOM NAVIGATION */}
      <nav className="absolute bottom-0 w-full bg-[#111827]/90 backdrop-blur-xl border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Home className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Home</span>
          </button>
          
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center gap-1 ${activeTab === 'reels' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <PlaySquare className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Reels</span>
          </button>
          
          {/* 🧠 The Master AI Button */}
          <div className="relative -top-6">
              <button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] border-4 border-[#0a1014] active:scale-90 transition-transform">
                  <BrainCircuit className="text-black w-6 h-6" />
              </button>
          </div>
          
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <MessageCircle className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Chat</span>
          </button>
          
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Settings className="w-6 h-6" />
              <span className="text-[8px] font-bold tracking-widest uppercase">Menu</span>
          </button>
      </nav>
    </div>
  );
}
