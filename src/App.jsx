// ==========================================
// TRINETRA SUPER APP - FINAL MASTER FRONTEND
// File: src/App.jsx (The Main Engine)
// ==========================================
import React, { useState, useEffect, useRef } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Sparkles, Download, Search, Menu, Zap, Globe } from 'lucide-react';

// 👁️🔥 Blueprint Components (14 Master Files Jo Humne Banayi Hain)
import HomeFeed from './screens/Home/HomeFeed';
import ChatWindow from './screens/Messenger/ChatWindow';
import AIChatWindow from './screens/AI/AIChatWindow';
import Preferences from './screens/Settings/Preferences';
import DownloadHub from './screens/Auth/DownloadHub'; // PWA Link
import LoginScreen from './screens/Auth/LoginScreen'; // New Gatekeeper

export default function App() {
  // 🛡️ Global App State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  
  // 🚨 Master Blueprints Flags
  const [isAiOnlyMode, setIsAiOnlyMode] = useState(false); // GitHub Coders Only
  const [showPlatformDetect, setShowPlatformDetect] = useState(true); // Point 1: 6 OS

  // Point 1: Universal Deployment Hub Check
  useEffect(() => {
    // Check if app is installed as PWA or running in Web
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowPlatformDetect(false); // Already installed
    }
  }, []);

  // 🛡️ The Gatekeeper: Login Success Handler
  const handleAuthSuccess = (userData, provider) => {
    setUserProfile(userData);
    setIsLoggedIn(true);
    
    // GitHub Logic: Force AI Mode (Point 2)
    if(provider === 'GitHub' || userData.isGithubUser) { 
        setIsAiOnlyMode(true); 
        setActiveTab('ai'); 
    } else {
        setActiveTab('home'); // Normal Social Users
    }
  };

  // ==========================================
  // 🚀 SCREEN ROUTING ENGINE (The Viewport)
  // ==========================================
  
  // 1. Point 1: The Download Hub (Before Login)
  if (showPlatformDetect && !isLoggedIn) {
      return <DownloadHub onProceedToLogin={() => setShowPlatformDetect(false)} />;
  }

  // 2. Point 2: The Gatekeeper (Strict Login)
  if (!isLoggedIn) {
      return <LoginScreen onLoginSuccess={handleAuthSuccess} />;
  }

  // ==========================================
  // 📱 MAIN APP UI (After Login)
  // ==========================================
  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white relative font-sans overflow-hidden">
      
      {/* 🌟 HEADER (Dynamic based on Active Tab) */}
      {!isAiOnlyMode && activeTab !== 'chat' && activeTab !== 'ai' && (
        <header className="p-4 bg-[#111827] border-b border-cyan-500/10 flex justify-between items-center z-10 shadow-lg">
          <h2 className="text-xl font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <Zap size={20} className="animate-pulse" /> {activeTab}
          </h2>
          <div className="flex space-x-4 items-center">
              {activeTab === 'home' && <Search className="text-gray-400 hover:text-white transition cursor-pointer"/>}
              {activeTab === 'settings' && <Menu className="text-gray-400 hover:text-white transition cursor-pointer"/>}
          </div>
        </header>
      )}

      {/* 🚀 MAIN CONTENT AREA (The Router) */}
      <main className="flex-1 overflow-hidden bg-[#0a1014] relative">
        
        {/* 1. SOCIAL HUB (Point 4) */}
        {activeTab === 'home' && !isAiOnlyMode && (
          <HomeFeed />
        )}

        {/* 2. MESSENGER (Point 5) */}
        {activeTab === 'chat' && !isAiOnlyMode && (
          <ChatWindow onBack={() => setActiveTab('home')} onCall={(type) => alert(`ZegoCloud ${type} call initiating...`)} />
        )}

        {/* 3. MASTER AI (Point 11) */}
        {activeTab === 'ai' && (
          <AIChatWindow 
            onBack={() => setIsAiOnlyMode ? alert("GitHub Mode: Social Features Locked.") : setActiveTab('home')} 
            userCredits={userProfile?.dailyAiLimit || 8}
            isPaid={userProfile?.isPaidChatbot || false}
          />
        )}

        {/* 4. REELS (Point 4) - Placeholder till connected */}
        {activeTab === 'reels' && !isAiOnlyMode && (
          <div className="h-full flex items-center justify-center bg-black">
              <p className="text-gray-500 font-bold tracking-widest uppercase">TriNetra Reels Engine Active</p>
          </div>
        )}

        {/* 5. SETTINGS & PREFERENCES (Point 12 & 13) */}
        {activeTab === 'settings' && !isAiOnlyMode && (
          <Preferences />
        )}

      </main>

      {/* 📱 BOTTOM NAVIGATION (Point 12-A) */}
      {!isAiOnlyMode && (
        <nav className="absolute bottom-0 w-full bg-[#111827]/90 backdrop-blur-xl border-t border-cyan-500/20 flex justify-around py-2 pb-6 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            
            <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-1">
                <Home className={`w-6 h-6 transition-all ${activeTab === 'home' ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}/>
                <span className="text-[8px] font-bold tracking-widest uppercase text-gray-500">Home</span>
            </button>
            
            <button onClick={() => setActiveTab('reels')} className="flex flex-col items-center gap-1">
                <PlaySquare className={`w-6 h-6 transition-all ${activeTab === 'reels' ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}/>
                <span className="text-[8px] font-bold tracking-widest uppercase text-gray-500">Reels</span>
            </button>
            
            {/* 🧠 The Master AI Button (Center) */}
            <div className="relative -top-6">
                <button 
                    onClick={() => setActiveTab('ai')} 
                    className="bg-cyan-500 p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-90 transition-transform flex items-center justify-center border-4 border-[#0a1014]"
                >
                    <BrainCircuit className="text-black w-6 h-6" />
                </button>
            </div>
            
            <button onClick={() => setActiveTab('chat')} className="flex flex-col items-center gap-1">
                <MessageCircle className={`w-6 h-6 transition-all ${activeTab === 'chat' ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}/>
                <span className="text-[8px] font-bold tracking-widest uppercase text-gray-500">Chat</span>
            </button>
            
            <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center gap-1">
                <Settings className={`w-6 h-6 transition-all ${activeTab === 'settings' ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}/>
                <span className="text-[8px] font-bold tracking-widest uppercase text-gray-500">Menu</span>
            </button>
        </nav>
      )}
    </div>
  );
}
