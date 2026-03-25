// File: src/components/NavBar.jsx
import React from 'react';
import { Home, PlaySquare, MessageCircle, Settings, Sparkles } from 'lucide-react';

export default function NavBar({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 w-full bg-[#0a1014] border-t border-gray-800 flex justify-around py-3 pb-6 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <Home onClick={() => setActiveTab('home')} className={`w-7 h-7 cursor-pointer transition ${activeTab === 'home' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`} />
      <PlaySquare onClick={() => setActiveTab('reels')} className={`w-7 h-7 cursor-pointer transition ${activeTab === 'reels' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`} />
      
      {/* BIG SPLASH AI LOGO IN CENTER */}
      <div onClick={() => setActiveTab('ai')} className="bg-green-500 p-3 rounded-full -mt-7 cursor-pointer shadow-[0_0_20px_green] hover:scale-110 transition-transform">
         <Sparkles className="text-black w-6 h-6" />
      </div>
      
      <MessageCircle onClick={() => setActiveTab('chat')} className={`w-7 h-7 cursor-pointer transition ${activeTab === 'chat' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`} />
      <Settings onClick={() => setActiveTab('settings')} className={`w-7 h-7 cursor-pointer transition ${activeTab === 'settings' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`} />
    </nav>
  );
}
