// ==========================================
// TRINETRA MESSENGER - CHAT WINDOW (File 14)
// Point 5: WhatsApp 2.0 Style + Universal Download
// ==========================================
import React, { useState } from 'react';
import { Phone, Video, MoreVertical, Plus, Send, Mic, Download, ArrowLeft, Image, FileText, MapPin, User as UserIcon } from 'lucide-react';

const t = (text) => text;

export default function ChatWindow({ friend, onBack }) {
  const [msg, setMsg] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // Universal Download Handler (Point 4 & 5)
  const downloadMedia = (fileUrl) => {
    alert(t("Downloading original format from TriNetra Cloud..."));
    // Real logic: window.open(fileUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white fixed inset-0 z-[60] font-sans">
      
      {/* 📱 CHAT HEADER (Calling Buttons) */}
      <header className="p-4 bg-[#111827] flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer" />
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-cyan-500/30">
             <img src={`https://ui-avatars.com/api/?name=${friend.name}`} className="rounded-full" alt="pfp" />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide">{friend.name}</h4>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t("Online")}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-cyan-400">
          <Phone size={20} className="active:scale-90 transition-transform cursor-pointer" />
          <Video size={20} className="active:scale-90 transition-transform cursor-pointer" />
          <MoreVertical size={20} className="text-gray-500" />
        </div>
      </header>

      {/* 💬 MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        {/* Received Msg with Media */}
        <div className="flex flex-col items-start max-w-[80%]">
          <div className="bg-[#111827] p-3 rounded-2xl rounded-tl-none border border-gray-800 relative group">
            <div className="w-48 h-32 bg-gray-800 rounded-lg mb-2 overflow-hidden relative">
              <img src="https://via.placeholder.com/200x150" className="w-full h-full object-cover" alt="media" />
              <button 
                onClick={() => downloadMedia('xyz.jpg')}
                className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-lg border border-white/20 text-white hover:text-cyan-400"
              >
                <Download size={16} />
              </button>
            </div>
            <p className="text-sm">Check out this design!</p>
            <span className="text-[9px] text-gray-500 mt-1 block">12:46 PM</span>
          </div>
        </div>

        {/* Sent Msg */}
        <div className="flex flex-col items-end w-full">
          <div className="bg-cyan-600 p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg">
            <p className="text-sm text-black font-medium">This looks amazing! TriNetra power. 🔥</p>
            <span className="text-[9px] text-black/60 mt-1 block text-right">12:47 PM</span>
          </div>
        </div>
      </div>

      {/* 🛠️ INPUT AREA (+ Icon for all media) */}
      <div className="p-4 bg-[#111827] border-t border-gray-800">
        <div className="flex items-center gap-3 relative">
          
          {/* Plus Icon Options (Point 5 List) */}
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className={`p-2 rounded-full transition-all ${showOptions ? 'bg-cyan-500 text-black rotate-45' : 'bg-gray-800 text-cyan-400'}`}
            >
              <Plus size={24} />
            </button>
            
            {showOptions && (
              <div className="absolute bottom-14 left-0 bg-[#111827] border border-gray-800 p-3 rounded-2xl grid grid-cols-3 gap-4 shadow-2xl animate-fade-in-up">
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="bg-blue-500 p-3 rounded-xl"><Image size={20}/></div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">{t("Gallery")}</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="bg-orange-500 p-3 rounded-xl"><FileText size={20}/></div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">{t("Document")}</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="bg-green-500 p-3 rounded-xl"><MapPin size={20}/></div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">{t("Location")}</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                  <div className="bg-purple-500 p-3 rounded-xl"><UserIcon size={20}/></div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">{t("Contact")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 bg-[#0a1014] border border-gray-800 rounded-2xl flex items-center px-4 py-1 focus-within:border-cyan-500 transition-all">
            <input 
              type="text" 
              placeholder={t("Type message...")}
              className="bg-transparent w-full py-2 text-sm focus:outline-none"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            {msg.length === 0 ? <Mic size={20} className="text-gray-500 hover:text-cyan-400 cursor-pointer" /> : <Send size={20} className="text-cyan-400 cursor-pointer" />}
          </div>
        </div>
      </div>
    </div>
  );
}
