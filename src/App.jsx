import React, { useState } from 'react';
import { Home, PlaySquare, MessageCircle, Wallet, Paperclip, MoreVertical, Heart, MessageSquare, Send, Phone, Video, ArrowLeft, CheckCircle, Clock, MapPin, Image as ImageIcon, User, FileText } from 'https://esm.sh/lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeChat, setActiveChat] = useState(null); // null = Chat List, String = Chat Name
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans overflow-hidden">
      
      {/* === HEADER (बदलता रहेगा) === */}
      {activeTab === 'chat' && activeChat ? (
        // Chat Detail Header
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center space-x-3">
            <ArrowLeft className="w-6 h-6 text-green-500 cursor-pointer" onClick={() => setActiveChat(null)} />
            <img src="https://i.pravatar.cc/150?img=33" className="w-10 h-10 rounded-full" alt="User" />
            <div>
              <h1 className="text-lg font-bold">{activeChat}</h1>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Video className="w-6 h-6 text-gray-300" />
            <Phone className="w-6 h-6 text-gray-300" />
            <MoreVertical className="w-6 h-6 text-gray-300" />
          </div>
        </header>
      ) : (
        // Main App Header
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
          <h1 className="text-2xl font-bold text-green-500 tracking-wider">
            {activeTab === 'home' && 'TriNetra'}
            {activeTab === 'reels' && 'TriNetra Reels'}
            {activeTab === 'chat' && 'Secure Chat'}
            {activeTab === 'wallet' && 'Agent Ledger'}
          </h1>
          {activeTab === 'home' && (
            <div className="flex space-x-4">
              <Heart className="w-6 h-6 text-gray-300" />
              <MessageCircle className="w-6 h-6 text-gray-300" onClick={() => setActiveTab('chat')} />
            </div>
          )}
        </header>
      )}

      {/* === MAIN CONTENT AREA === */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        
        {/* 1. HOME TAB (Story & Post + PDF Comment) */}
        {activeTab === 'home' && (
          <div>
            {/* Stories */}
            <div className="flex space-x-4 p-4 overflow-x-auto border-b border-gray-800 scrollbar-hide">
              <div className="flex flex-col items-center min-w-[70px]">
                <div className="w-16 h-16 rounded-full border-2 border-green-500 p-[2px]">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Your Story" className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-xs mt-1 text-gray-400">Your Story</span>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center min-w-[70px]">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-[2px]">
                    <img src={`https://i.pravatar.cc/150?img=${i + 20}`} alt="Agent" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-xs mt-1 text-gray-400">Agent 00{i}</span>
                </div>
              ))}
            </div>

            {/* Post */}
            <div className="bg-gray-900 mb-4 border-b border-gray-800">
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center space-x-2">
                  <img src="https://i.pravatar.cc/150?img=33" className="w-8 h-8 rounded-full" alt="User" />
                  <span className="font-semibold text-sm">Commander_X</span>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center border-y border-gray-700">
                <span className="text-gray-500">[ Target Image / Video Here ]</span>
              </div>
              <div className="p-3">
                <div className="flex space-x-4 mb-2">
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                  <MessageSquare className="w-6 h-6" />
                  <Send className="w-6 h-6" />
                </div>
                <p className="text-sm"><span className="font-bold mr-2">Commander_X</span>Target located. Need detailed PDF report.</p>
                
                {/* PDF Comment Masterstroke */}
                <div className="mt-3 flex items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
                  <img src="https://i.pravatar.cc/150?img=11" className="w-6 h-6 rounded-full mr-2" alt="You" />
                  <input type="text" placeholder="Add a comment or PDF..." className="bg-transparent flex-1 text-sm outline-none text-white" />
                  <button className="text-green-400 hover:text-green-300 ml-2 flex items-center bg-gray-700 p-1.5 rounded-full">
                    <Paperclip className="w-4 h-4" /> 
                    <span className="text-[10px] ml-1 font-bold">PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. REELS TAB (Full Screen Vertical Video) */}
        {activeTab === 'reels' && (
          <div className="h-full bg-black relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
               <PlaySquare className="w-16 h-16 text-gray-600 mb-4" />
               <span className="text-gray-500 font-bold tracking-widest">[ REEL VIDEO PLAYING ]</span>
            </div>
            {/* Reels Actions Right Side */}
            <div className="absolute right-4 bottom-24 flex flex-col space-y-6 items-center">
              <div className="flex flex-col items-center"><Heart className="w-8 h-8 text-white" /><span className="text-xs">12k</span></div>
              <div className="flex flex-col items-center"><MessageSquare className="w-8 h-8 text-white" /><span className="text-xs">450</span></div>
              <div className="flex flex-col items-center"><Send className="w-8 h-8 text-white" /><span className="text-xs">Share</span></div>
              <div className="flex flex-col items-center"><MoreVertical className="w-8 h-8 text-white" /></div>
            </div>
            {/* Reels User Info Bottom */}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-2 mb-2">
                <img src="https://i.pravatar.cc/150?img=44" className="w-8 h-8 rounded-full" alt="User" />
                <span className="font-bold text-white shadow-md">Agent_Ghost</span>
                <button className="border border-white px-2 py-0.5 rounded text-xs font-bold">Follow</button>
              </div>
              <p className="text-sm text-white max-w-[80%]">Operation shadow drop completed successfully. #OSINT #TriNetra</p>
            </div>
          </div>
        )}

        {/* 3. CHAT TAB (WhatsApp Style with Attachments) */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            {!activeChat ? (
              /* Chat List */
              <div className="flex-1 bg-gray-950">
                {['Commander_X', 'Agent_Ghost', 'HQ_Control', 'Alpha_Team'].map((name, i) => (
                  <div key={i} onClick={() => setActiveChat(name)} className="flex items-center p-4 border-b border-gray-900 hover:bg-gray-900 cursor-pointer">
                    <img src={`https://i.pravatar.cc/150?img=${i + 30}`} className="w-12 h-12 rounded-full" alt={name} />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between"><h3 className="font-bold">{name}</h3><span className="text-xs text-gray-500">10:42 AM</span></div>
                      <p className="text-sm text-gray-400 truncate">Roger that. Sending the PDF report now.</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Inside Chat Room */
              <div className="flex-1 flex flex-col bg-gray-950 bg-opacity-95" style={{ backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
                  <div className="self-start bg-gray-800 p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl max-w-[80%]">
                     <p className="text-sm">Did you get the target's location?</p>
                     <span className="text-[10px] text-gray-400 float-right mt-1">10:40 AM</span>
                  </div>
                  <div className="self-end bg-green-900 p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl max-w-[80%] border border-green-700">
                     <p className="text-sm">Yes. I will attach the PDF dossier and map location.</p>
                     <span className="text-[10px] text-green-300 float-right mt-1 flex items-center">10:42 AM <CheckCircle className="w-3 h-3 ml-1 text-blue-400" /></span>
                  </div>
                </div>

                {/* Bottom Chat Input with Attachment Menu */}
                <div className="p-2 bg-gray-900 border-t border-gray-800 relative">
                  
                  {/* Attachment Pop-up Menu */}
                  {showAttachMenu && (
                    <div className="absolute bottom-16 left-4 bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700 grid grid-cols-4 gap-4 w-[calc(100%-2rem)]">
                      <div className="flex flex-col items-center"><div className="bg-purple-500 p-3 rounded-full mb-1"><FileText className="w-6 h-6 text-white"/></div><span className="text-xs">Document</span></div>
                      <div className="flex flex-col items-center"><div className="bg-pink-500 p-3 rounded-full mb-1"><ImageIcon className="w-6 h-6 text-white"/></div><span className="text-xs">Gallery</span></div>
                      <div className="flex flex-col items-center"><div className="bg-green-500 p-3 rounded-full mb-1"><MapPin className="w-6 h-6 text-white"/></div><span className="text-xs">Location</span></div>
                      <div className="flex flex-col items-center"><div className="bg-blue-500 p-3 rounded-full mb-1"><User className="w-6 h-6 text-white"/></div><span className="text-xs">Contact</span></div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <button onClick={() => setShowAttachMenu(!showAttachMenu)} className="p-2 rounded-full hover:bg-gray-800 text-gray-400">
                      <Paperclip className="w-6 h-6" />
                    </button>
                    <input type="text" placeholder="Message..." className="flex-1 bg-gray-800 rounded-full px-4 py-2 outline-none text-white border border-gray-700" />
                    <button className="p-3 bg-green-600 rounded-full hover:bg-green-500 text-white">
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. WALLET / AGENT LEDGER TAB (Transparent Payment Tracker) */}
        {activeTab === 'wallet' && (
          <div className="p-4">
            <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800 flex justify-between items-center shadow-lg shadow-green-900/20">
               <div>
                 <p className="text-gray-400 text-sm">Total Network Payouts</p>
                 <h2 className="text-3xl font-bold text-green-500">₹ 4,50,000</h2>
               </div>
               <Wallet className="w-12 h-12 text-gray-700" />
            </div>

            <h3 className="font-bold text-gray-300 mb-4 px-1">Agent Payment Ledger</h3>
            <div className="space-y-3">
               {/* Paid Agent */}
               <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                   <img src="https://i.pravatar.cc/150?img=33" className="w-10 h-10 rounded-full" alt="Agent" />
                   <div><p className="font-bold">Commander_X</p><p className="text-xs text-gray-500">Task: Target Locating</p></div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-green-500">₹ 25,000</p>
                   <p className="text-xs flex items-center justify-end text-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Paid</p>
                 </div>
               </div>
               {/* Pending Agent */}
               <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                 <div className="flex items-center space-x-3">
                   <img src="https://i.pravatar.cc/150?img=44" className="w-10 h-10 rounded-full" alt="Agent" />
                   <div><p className="font-bold">Agent_Ghost</p><p className="text-xs text-gray-500">Task: Social Recon</p></div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-yellow-500">₹ 15,000</p>
                   <p className="text-xs flex items-center justify-end text-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</p>
                 </div>
               </div>
            </div>
          </div>
        )}

      </main>

      {/* === BOTTOM NAVIGATION BAR (Fixed at bottom) === */}
      {!activeChat && (
        <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around p-3 pb-5 z-50">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-green-500' : 'text-gray-500'}`}>
            <Home className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-semibold">Home</span>
          </button>
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center transition-colors ${activeTab === 'reels' ? 'text-green-500' : 'text-gray-500'}`}>
            <PlaySquare className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-semibold">Reels</span>
          </button>
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center transition-colors ${activeTab === 'chat' ? 'text-green-500' : 'text-gray-500'}`}>
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-semibold">Chat</span>
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center transition-colors ${activeTab === 'wallet' ? 'text-green-500' : 'text-gray-500'}`}>
            <Wallet className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-semibold">Wallet</span>
          </button>
        </nav>
      )}

    </div>
  );
}
