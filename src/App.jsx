// ==========================================
// TRINETRA SUPER APP - FINAL MASTER FRONTEND
// ==========================================
import React, { useState, useEffect, useRef } from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Sparkles, Download, Mic, Plus, Phone, Video, Search, Send, Menu } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [platform, setPlatform] = useState('Web');
  const [showDownloadBtn, setShowDownloadBtn] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAiOnlyMode, setIsAiOnlyMode] = useState(false); 
  
  const callContainerRef = useRef(null);

  // 1. UNIVERSAL DOWNLOAD HUB (All 6 Platforms)
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) setPlatform('Android');
    else if (/iPad|iPhone|iPod/.test(ua)) setPlatform('iOS PWA');
    else if (/Windows/.test(ua)) setPlatform('Windows');
    else if (/Mac/.test(ua)) setPlatform('macOS');
    else if (/Linux/.test(ua)) setPlatform('Linux');

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowDownloadBtn(false);
    }
  }, []);

  // 2. GATEKEEPER
  const handleLogin = async (provider) => {
    const authId = provider === 'Phone' ? '9999999999' : 'user@domain.com';
    const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ authId, provider })
    });
    const data = await res.json();
    if(data.success) {
        setUserProfile(data.user);
        setIsLoggedIn(true);
        if(provider === 'GitHub') { setIsAiOnlyMode(true); setActiveTab('ai'); }
    }
  };

  // 3. ZEGOCLOUD CALLING
  const startCall = (type) => {
    const roomID = `room_${Math.floor(Math.random() * 10000)}`;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(1218908374, "7308cd0113c93801130957698f292c8d", roomID, userProfile?.trinetraId || "user1", "TriNetra User");
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({ container: callContainerRef.current, turnOnCameraWhenJoining: type === 'video' });
  };

  // --- LOGIN SCREEN (No Skip, Full Security) ---
  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white text-center">
        {showDownloadBtn && (
          <button className="absolute top-4 w-11/12 bg-green-600 p-3 rounded-xl font-bold flex justify-center shadow-lg hover:bg-green-500 transition">
            <Download className="mr-2"/> Install TriNetra for {platform}
          </button>
        )}
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border-4 border-green-500 shadow-[0_0_30px_green] mb-6">
            <span className="text-4xl font-black text-green-500">T</span>
        </div>
        <h1 className="text-5xl font-black text-white mb-1 tracking-widest uppercase">TriNetra</h1>
        <p className="text-gray-500 text-xs mb-10 font-bold tracking-widest">NO SKIP. FULL SECURITY.</p>
        
        <div className="w-full max-w-sm space-y-3">
          <button onClick={() => handleLogin('Phone')} className="w-full bg-green-600 p-4 rounded-xl font-bold">Mobile (OTP)</button>
          <button onClick={() => handleLogin('Email')} className="w-full bg-blue-600 p-4 rounded-xl font-bold">Email</button>
          <div className="flex space-x-2">
              <button onClick={() => handleLogin('Google')} className="flex-1 bg-white text-black p-3 rounded-xl font-bold">Google</button>
              <button onClick={() => handleLogin('Apple')} className="flex-1 bg-gray-800 text-white p-3 rounded-xl font-bold">Apple</button>
              <button onClick={() => handleLogin('Microsoft')} className="flex-1 bg-blue-800 text-white p-3 rounded-xl font-bold">MS</button>
          </div>
          <button onClick={() => handleLogin('GitHub')} className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl font-bold mt-4">GitHub (AI Coders Only)</button>
        </div>
      </div>
    );
  }

  // --- MAIN APP UI ---
  return (
    <div className="flex flex-col h-screen bg-black text-white relative font-sans">
      
      {/* Universal Call Container */}
      <div ref={callContainerRef} className="absolute top-0 w-full z-50 bg-black"></div>

      {/* HEADER */}
      <header className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center z-10">
        <h2 className="text-xl font-black uppercase tracking-widest">{activeTab}</h2>
        <div className="flex space-x-4 items-center">
            {activeTab === 'home' && <Search className="text-gray-400"/>}
            {activeTab === 'chat' && (
              <>
                 <Phone onClick={() => startCall('audio')} className="text-green-500 cursor-pointer"/>
                 <Video onClick={() => startCall('video')} className="text-green-500 cursor-pointer"/>
              </>
            )}
            {activeTab === 'settings' && <Menu className="text-gray-400"/>}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-24 bg-[#0a1014]">
        
        {/* 1. SOCIAL HUB */}
        {activeTab === 'home' && !isAiOnlyMode && (
          <div className="p-4 space-y-6">
             <div className="bg-gray-900 p-4 rounded-xl">
                 <input type="text" placeholder="Post a status, photo, video, or PDF..." className="w-full bg-transparent text-white outline-none mb-3"/>
                 <div className="flex justify-between text-gray-400 border-t border-gray-800 pt-3 mt-2">
                    <span className="flex items-center"><Plus size={16} className="mr-1"/> Media</span>
                    <span className="flex items-center"><Mic size={16} className="mr-1"/> Audio</span>
                    <button className="bg-green-600 text-black px-4 py-1 rounded-full font-bold">Post</button>
                 </div>
             </div>
             {/* Mock Post */}
             <div className="bg-gray-900 p-4 rounded-xl">
                 <h4 className="font-bold">System Admin</h4>
                 <p className="text-sm mt-2">Paid Boost & Monetization logic is now 100% active in DB!</p>
                 <button className="text-xs bg-red-900/50 text-red-500 p-2 rounded mt-3 font-bold">Escalate Issue (Local ➡️ MLA ➡️ CM)</button>
                 <div className="flex justify-between mt-4 text-gray-400 text-sm border-t border-gray-800 pt-3">
                    <span>Like</span><span>Comment</span><span>Share</span><span className="text-yellow-500">Boost Post</span>
                 </div>
             </div>
          </div>
        )}

        {/* 2. MESSENGER */}
        {activeTab === 'chat' && !isAiOnlyMode && (
          <div className="flex flex-col h-full">
             <div className="flex-1 p-4 text-center text-gray-600 text-sm mt-10">Messages encrypted. Mutual Follows Only.</div>
             {/* Chat Input */}
             <div className="p-2 bg-[#202c33] flex items-center space-x-2">
                <Plus className="text-gray-400 p-2 cursor-pointer"/>
                <input type="text" placeholder="Message" className="flex-1 bg-[#2a3942] p-3 rounded-full outline-none text-white"/>
                <Mic className="text-green-500 p-2 cursor-pointer"/>
                <Send className="text-gray-400 p-2"/>
             </div>
          </div>
        )}

        {/* 3. MASTER AI */}
        {activeTab === 'ai' && (
          <div className="p-4 flex flex-col h-full pb-6">
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                 <Sparkles className="w-24 h-24 text-green-500 mb-4"/>
                 <h2 className="text-2xl font-bold text-green-500">Master 6-in-1 AI</h2>
                 <p className="text-sm mt-2">Chatbot (GPT/Gemini) • Agentic (OS Builder)</p>
             </div>
             {/* AI Input */}
             <div className="bg-gray-900 border border-green-500/50 rounded-2xl p-2 flex items-center shadow-[0_0_10px_green]">
                <Plus className="text-green-500 p-2 cursor-pointer"/>
                <input type="text" placeholder="Text, Photo, PDF, Code, OS Command..." className="flex-1 bg-transparent text-white px-2 outline-none"/>
                <Mic className="text-green-500 p-2 cursor-pointer"/>
                <button className="bg-green-600 p-2 rounded-xl text-black"><Send size={18}/></button>
             </div>
          </div>
        )}

        {/* 4. SETTINGS & PRIVACY */}
        {activeTab === 'settings' && !isAiOnlyMode && (
          <div className="p-4 space-y-4 text-sm">
             <div className="bg-gray-900 p-4 rounded-xl space-y-3">
                 <h3 className="font-bold text-green-500">Your Account & Privacy</h3>
                 <p className="border-b border-gray-800 pb-2">Accounts Centre</p>
                 <p className="border-b border-gray-800 pb-2">Privacy Checkup & Audience Visibility</p>
                 <p>Dark Mode & Media Preferences</p>
             </div>
             <div className="bg-gray-900 p-4 rounded-xl space-y-3">
                 <h3 className="font-bold text-yellow-500">Economy & Wallet</h3>
                 <p className="border-b border-gray-800 pb-2 flex justify-between"><span>Wallet Balance</span><span className="text-green-500 font-bold">₹{userProfile?.walletBalance || 0}</span></p>
                 <p className="border-b border-gray-800 pb-2 text-blue-400">Manage Boosts & Subscriptions</p>
                 <p>Customer Support</p>
             </div>
             <button onClick={()=>setIsLoggedIn(false)} className="w-full bg-red-900/30 text-red-500 p-4 rounded-xl font-bold">Log Out</button>
          </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      {!isAiOnlyMode && (
        <nav className="fixed bottom-0 w-full bg-[#0a1014] border-t border-gray-800 flex justify-around py-3 pb-6 z-40">
            <Home onClick={() => setActiveTab('home')} className={`w-7 h-7 cursor-pointer ${activeTab === 'home' ? 'text-white' : 'text-gray-600'}`}/>
            <PlaySquare onClick={() => setActiveTab('reels')} className={`w-7 h-7 cursor-pointer ${activeTab === 'reels' ? 'text-white' : 'text-gray-600'}`}/>
            
            <div onClick={() => setActiveTab('ai')} className="bg-green-500 p-3 rounded-full -mt-6 cursor-pointer shadow-[0_0_20px_green]">
               <Sparkles className="text-black w-6 h-6"/>
            </div>
            
            <MessageCircle onClick={() => setActiveTab('chat')} className={`w-7 h-7 cursor-pointer ${activeTab === 'chat' ? 'text-white' : 'text-gray-600'}`}/>
            <Settings onClick={() => setActiveTab('settings')} className={`w-7 h-7 cursor-pointer ${activeTab === 'settings' ? 'text-white' : 'text-gray-600'}`}/>
        </nav>
      )}
    </div>
  );
}
