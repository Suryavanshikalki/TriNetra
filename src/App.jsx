import React, { useState } from 'react';
import { Home, PlaySquare, MessageCircle, Wallet, Paperclip, MoreVertical, Heart, MessageSquare, Send } from 'https://esm.sh/lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans">
      
      {/* Top Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
        <h1 className="text-2xl font-bold text-green-500 tracking-wider">TriNetra</h1>
        <div className="flex space-x-4">
          <Heart className="w-6 h-6 text-gray-300" />
          <MessageCircle className="w-6 h-6 text-gray-300" />
        </div>
      </header>

      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto pb-20">
        
        {/* === HOME TAB (STORY & POSTS) === */}
        {activeTab === 'home' && (
          <div>
            {/* Stories Section (Instagram Style) */}
            <div className="flex space-x-4 p-4 overflow-x-auto border-b border-gray-800 scrollbar-hide">
              <div className="flex flex-col items-center min-w-[70px]">
                <div className="w-16 h-16 rounded-full border-2 border-green-500 p-[2px]">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Your Story" className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-xs mt-1 text-gray-400">Your Story</span>
              </div>
              {/* Dummy Stories */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center min-w-[70px]">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-[2px]">
                    <img src={`https://i.pravatar.cc/150?img=${i + 20}`} alt="Agent" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-xs mt-1 text-gray-400">Agent 00{i}</span>
                </div>
              ))}
            </div>

            {/* Post Section */}
            <div className="p-0">
              <div className="bg-gray-900 mb-4 border-b border-gray-800">
                {/* Post Header */}
                <div className="flex justify-between items-center p-3">
                  <div className="flex items-center space-x-2">
                    <img src="https://i.pravatar.cc/150?img=33" className="w-8 h-8 rounded-full" alt="User" />
                    <span className="font-semibold text-sm">Commander_X</span>
                  </div>
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </div>
                
                {/* Post Image */}
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">[ Target Location Image / Intel ]</span>
                </div>

                {/* Post Actions & Masterstroke PDF Comment */}
                <div className="p-3">
                  <div className="flex space-x-4 mb-2">
                    <Heart className="w-6 h-6" />
                    <MessageSquare className="w-6 h-6" />
                    <Send className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold mb-1">1,042 likes</p>
                  <p className="text-sm"><span className="font-bold mr-2">Commander_X</span>Target acquired at sector 7. Need PDF verification.</p>
                  
                  {/* MASTERSTROKE: PDF Attachment in Comment */}
                  <div className="mt-3 flex items-center bg-gray-800 rounded-full px-4 py-2">
                    <img src="https://i.pravatar.cc/150?img=11" className="w-6 h-6 rounded-full mr-2" alt="You" />
                    <input type="text" placeholder="Add a comment or PDF..." className="bg-transparent flex-1 text-sm outline-none text-white" />
                    <button className="text-green-400 hover:text-green-300 ml-2">
                      <Paperclip className="w-5 h-5" /> {/* PDF Attachment Icon */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab === 'reels' && <div className="flex items-center justify-center h-full text-gray-500">Reels Interface Coming Next...</div>}
        {activeTab === 'chat' && <div className="flex items-center justify-center h-full text-gray-500">WhatsApp Style Chat Coming Next...</div>}
        {activeTab === 'wallet' && <div className="flex items-center justify-center h-full text-gray-500">Agent Wallet Coming Next...</div>}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around p-3 pb-5">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-green-500' : 'text-gray-400'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center ${activeTab === 'reels' ? 'text-green-500' : 'text-gray-400'}`}>
          <PlaySquare className="w-6 h-6" />
          <span className="text-[10px] mt-1">Reels</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center ${activeTab === 'chat' ? 'text-green-500' : 'text-gray-400'}`}>
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] mt-1">Chat</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center ${activeTab === 'wallet' ? 'text-green-500' : 'text-gray-400'}`}>
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] mt-1">Wallet</span>
        </button>
      </nav>

    </div>
  );
}
