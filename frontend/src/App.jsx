import React, { useState, useEffect } from 'react'; // ✅ 'i' छोटा कर दिया गया है
import { Zap, Home, PlaySquare, MessageCircle, Settings, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
// ✅ i18n.js (छोटा i) - आपकी फाइल के नाम से मैच है
import './i18n'; 
// ✅ Screens (बड़ा S) - आपके फोल्डर के नाम से मैच है
import LoginScreen from './Screens/Auth/LoginScreen';

// 100% Real Universal Logo Component
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

  // Exact 2-Second Splash Screen Logic
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

  // 2. Strict Entry Gatekeeper
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Main Application Shell (Facebook Style)
  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-hidden font-sans">
      
      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-20">
        <div className="flex items-center justify-center h-full text-cyan-400 font-black tracking-widest uppercase">
            {activeTab === 'home' && "Home Feed Ready"}
            {activeTab === 'reels' && "Reels Engine Ready"}
            {activeTab === 'ai' && "Master AI Hub Ready"}
            {activeTab === 'chat' && "Messenger Ready"}
            {activeTab === 'menu' && "Settings Menu Ready"}
        </div>
      </main>

      {/* Real Bottom Navigation Bar */}
      <nav className="absolute bottom-0 w-full bg-[#111827]/95 backdrop-blur-md border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'home' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Home size={22}/><span className="text-[9px] uppercase font-bold">{t("home")}</span>
          </button>
          
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'reels' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <PlaySquare size={22}/><span className="text-[9px] uppercase font-bold">{t("reels")}</span>
          </button>
          
          {/* Master AI Logo in Center */}
          <div className="relative -top-6">
            <button onClick={() => setActiveTab('ai')} className="bg-cyan-500 p-5 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.8)] border-4 border-[#0a1014] hover:bg-violet-500 transition-all active:scale-90">
                <BrainCircuit className="text-black" size={26}/>
            </button>
          </div>
          
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'chat' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <MessageCircle size={22}/><span className="text-[9px] uppercase font-bold">{t("chat")}</span>
          </button>
          
          <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${activeTab === 'menu' ? 'text-cyan-400' : 'text-gray-500'}`}>
              <Settings size={22}/><span className="text-[9px] uppercase font-bold">{t("menu")}</span>
          </button>
      </nav>
    </div>
  );
}
