// ==========================================
// TRINETRA SUPER APP - HOME SCREEN V6.0
// Blueprint Point 4: Feed, Universal Media, Auto-Escalation, In-built Player
// ==========================================
import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Video, Mic, FileText, Download, AlertTriangle, ThumbsUp, MessageSquare, Share2, PlayCircle } from 'lucide-react';
import axios from 'axios';

const t = (text) => text;

export default function HomeFeed() {
  const [postContent, setPostContent] = useState('');

  // 🚨 AUTO-ESCALATION LOGIC (Point 4: Justice System)
  const handleEscalation = async (postId) => {
    const confirmAction = window.confirm(t("Escalate this issue to Authorities? System will track debate and forward to Local Authority ➡️ MLA ➡️ CM ➡️ Supreme Court."));
    if(confirmAction) {
        try {
            // Hitting the V6.1 backend escalation route
            const res = await axios.post('https://trinetra-umys.onrender.com/api/complaint/escalate', { postId, category: 'General' });
            alert(t(res.data.message));
        } catch (err) {
            console.error(err);
        }
    }
  };

  // 💾 UNIVERSAL DOWNLOAD (Point 4: S3 Link generator mock)
  const handleUniversalDownload = (mediaUrl, type) => {
    console.log(`Downloading ${type} in original format from AWS S3: ${mediaUrl}`);
    alert(t("Downloading original format media to your device..."));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-24 font-sans multilanguage-container">
      
      {/* 📱 STORY & REELS SECTION */}
      <div className="flex gap-4 p-4 overflow-x-auto hide-scrollbar border-b border-gray-800">
        <div className="flex-shrink-0 w-20 h-32 rounded-xl border border-cyan-500/50 relative overflow-hidden flex flex-col items-center justify-center bg-[#111827] active:scale-95 cursor-pointer">
            <div className="bg-cyan-500 p-2 rounded-full mb-1"><Camera size={18} className="text-black" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t("Add Story")}</span>
        </div>
        {/* Mock Stories */}
        {[1, 2, 3].map(i => (
            <div key={i} className="flex-shrink-0 w-20 h-32 rounded-xl bg-gray-800 relative overflow-hidden border border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img src={`https://via.placeholder.com/100x150?text=Story+${i}`} className="w-full h-full object-cover" alt="Story"/>
            </div>
        ))}
      </div>

      {/* ✍️ CREATE POST SECTION (Universal Media Uploads) */}
      <div className="p-4 border-b border-gray-800 bg-[#111827]/50">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-500 flex-shrink-0"></div>
          <textarea 
            placeholder={t("What's happening? Type, upload PDF, Audio, Video...")}
            className="bg-transparent w-full text-sm text-white focus:outline-none resize-none placeholder-gray-500"
            rows="2"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center border-t border-gray-800 pt-3">
            <div className="flex gap-3 text-cyan-400">
                <ImageIcon size={20} className="cursor-pointer hover:text-white transition-colors"/>
                <Video size={20} className="cursor-pointer hover:text-white transition-colors"/>
                <Mic size={20} className="cursor-pointer text-violet-400 hover:text-white transition-colors"/>
                <FileText size={20} className="cursor-pointer text-green-400 hover:text-white transition-colors"/>
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs px-4 py-2 rounded-lg tracking-widest transition-all">
                {t("Post")}
            </button>
        </div>
      </div>

      {/* 📰 FEED AREA (Post Card with In-built players & Auto-Escalation) */}
      <div className="flex flex-col gap-2 bg-black">
        {/* MOCK POST 1: Video with Universal Download */}
        <div className="bg-[#111827] p-4">
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                    <div>
                        <p className="font-bold text-sm tracking-wide">TriNetra Official</p>
                        <p className="text-[10px] text-gray-500 uppercase">2 {t("hours ago")} • 🌍</p>
                    </div>
                </div>
                {/* 🚨 AUTO-ESCALATION BUTTON */}
                <button onClick={() => handleEscalation('POST_123')} className="bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                    <AlertTriangle size={12} /> {t("Escalate Issue")}
                </button>
            </div>
            
            <p className="text-sm mb-3 text-gray-300">
                {t("This is a highly debated social issue. If not resolved in comments, it will trigger the Supreme Court escalation chain automatically.")}
            </p>

            {/* In-built Video Player */}
            <div className="relative w-full h-48 bg-black rounded-xl border border-gray-800 flex items-center justify-center group mb-3">
                <PlayCircle size={48} className="text-white/50 group-hover:text-cyan-400 transition-colors cursor-pointer z-10" />
                <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                    <button onClick={() => handleUniversalDownload('video.mp4', 'Video')} className="bg-black/60 p-2 rounded-lg backdrop-blur text-white hover:text-cyan-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                        <Download size={14} /> {t("Original")}
                    </button>
                </div>
            </div>

            {/* Engagement & Comment Power */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-800 text-gray-400">
                <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors"><ThumbsUp size={18}/> <span className="text-xs">12.4K</span></button>
                <button className="flex items-center gap-2 hover:text-violet-400 transition-colors"><MessageSquare size={18}/> <span className="text-xs">4.2K</span></button>
                <button className="flex items-center gap-2 hover:text-green-400 transition-colors"><Share2 size={18}/> <span className="text-xs">Share</span></button>
            </div>
        </div>
      </div>
    </div>
  );
}
