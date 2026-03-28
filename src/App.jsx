// ==========================================
// TRINETRA SUPER APP - 64 FILES MASTER ENGINE
// ==========================================
import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Zap, BrainCircuit, Search } from 'lucide-react';

// 👁️ TRINETRA EXACT RECOVERY: Ye raaste aapki list se 1000% match hain
import HomeFeed from './screens/Home/HomeFeed.jsx';
import ChatWindow from './screens/Messenger/ChatWindow.jsx';
import AIChatWindow from './screens/AI/AIChatWindow.jsx';
import SettingsMenu from './screens/Settings/SettingsMenu.jsx';

// 🛡️ AUTH & NEW FILES (Jo aapne banayi hain)
import LoginScreen from './screens/Auth/LoginScreen.jsx'; 
import ProfileSetup from './screens/Auth/ProfileSetup.jsx'; 
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
    if (window.matchMedia('(display-mode: standalone)').matches) setShowPlatformDetect(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('trinetra_session', 'active');
    setActiveTab('home');
  };

  // 🚀 MASTER ROUTER
  if (showPlatformDetect && !isLoggedIn) return <DownloadHub onProceedToLogin={() => setShowPlatformDetect(false)} />;
  if (!isLoggedIn) return <LoginScreen onLoginSuccess={handleAuthSuccess} />;

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-hidden">
      <header className="p-4 bg-[#111827] border-b border-cyan-500/10 flex justify-between items-center">
        <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2"><Zap size={20}/> {activeTab}</h2>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'chat' && <ChatWindow onBack={() => setActiveTab('home')} />}
        {activeTab === 'ai' && <AIChatWindow />}
        {activeTab === 'settings' && <Preferences />}
      </main>

      <nav className="absolute bottom-0 w-full bg-[#111827]/90 border-t border-cyan-500/20 flex justify-around py-2 pb-6">
          <button onClick={() => setActiveTab('home')} className="flex flex-col items-center"><Home/><span className="text-[8px] uppercase">Home</span></button>
          <button onClick={() => setActiveTab('reels')} className="flex flex-col items-center"><PlaySquare/><span className="text-[8px] uppercase">Reels</span></button>
          <div className="relative -top-6"><button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-4 rounded-full"><BrainCircuit className="text-black"/></button></div>
          <button onClick={() => setActiveTab('chat')} className="flex flex-col items-center"><MessageCircle/><span className="text-[8px] uppercase">Chat</span></button>
          <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center"><Settings/><span className="text-[8px] uppercase">Menu</span></button>
      </nav>
    </div>
  );
}
