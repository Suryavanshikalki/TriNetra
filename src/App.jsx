import React, { useState, useEffect } from 'react';
import { Zap, Home, PlaySquare, MessageCircle, Settings, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './i18n'; 
import LoginScreen from './screens/Auth/LoginScreen';

// 100% Real Universal Logo Component (Point 1)
export const TriNetraLogo = ({ size = 24, pulse = false }) => (
  <div className={`flex items-center justify-center bg-black border border-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] ${pulse ? 'animate-pulse' : ''}`} style={{ width: size, height: size }}>
    <Zap size={size * 0.6} className="text-cyan-400" />
  </div>
);

export default function App() {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Exact 2-Second Splash Screen Logic (Point 1)
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
  };

  // 1. Splash Screen UI
  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1014] text-white">
        <TriNetraLogo size={80} pulse={true} />
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] mt-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          TriNetra
        </h1>
      </div>
    );
  }

  // 2. Strict Entry Gatekeeper - No Skip Button (Point 2)
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Real 100% Facebook-style Navigation Shell (Point 12)
  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-hidden font-sans">
      
      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-20">
        {activeTab === 'home' && <div className="flex items-center justify-center h-full text-cyan-400 font-black tracking-widest uppercase">Home Feed Ready</div>}
        {activeTab === 'reels' && <div className="flex items-center justify-center h-full text-cyan-400 font-black tracking-widest uppercase">Reels Engine Ready</div>}
        {activeTab === 'ai' && <div className="flex items-center justify-center h-full text-cyan-400 font-black tracking-widest uppercase">Master AI Hub Ready</div>}
        {activeTab === 'chat' && <div className="flex items-center justify-center h-full text-cyan-400 font-black tracking-widest uppercase">Messenger Ready</div>}
        {activeTab === 'menu' && <div className="flex items-center justify-center h-full text-cyan-400 font-black tracking-widest uppercase">Settings Menu Ready</div>}
      </main>

      {/* Real Bottom Navigation Bar (Point 12) */}
      <nav className="absolute bottom-0 w-full bg-[#111827]/95 backdrop-blur-md border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'home' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Home size={22}/><span className="text-[9px] uppercase font-bold">{t("Home")}</span>
          </button>
          
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'reels' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <PlaySquare size={22}/><span className="text-[9px] uppercase font-bold">{t("Reels")}</span>
          </button>
          
          {/* Master AI Logo in Middle (Point 11) */}
          <div className="relative -top-6">
            <button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-5 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.8)] border-4 border-[#0a1014] hover:bg-violet-500 transition-all active:scale-90">
                <BrainCircuit className="text-black" size={26}/>
            </button>
          </div>
          
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'chat' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <MessageCircle size={22}/><span className="text-[9px] uppercase font-bold">{t("Chat")}</span>
          </button>
          
          <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'menu' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Settings size={22}/><span className="text-[9px] uppercase font-bold">{t("Menu")}</span>
          </button>
      </nav>
    </div>
  );
}
