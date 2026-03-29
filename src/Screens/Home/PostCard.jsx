// ==========================================
// TRINETRA SUPER APP - POST CARD (File 7)
// Exact Path: src/screens/Home/PostCard.jsx
// ==========================================
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Download, ShieldAlert, Zap, Gavel } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function PostCard({ post, currentUser }) {
  const { t } = useTranslation();
  const [escalationLevel, setEscalationLevel] = useState(post.escalationStatus || null);

  const handleEscalate = async () => {
    const confirm = window.confirm(t("Escalate to TriNetra Justice Engine (Local -> MLA -> CM -> Supreme Court)?"));
    if (confirm) {
      try {
        await axios.post('https://trinetra-umys.onrender.com/api/escalation/trigger', { postId: post._id, userId: currentUser?.trinetraId });
        setEscalationLevel("Local Authority");
        alert(t("Escalation Active. Case tracked."));
      } catch (err) { alert(t("Server error.")); }
    }
  };

  return (
    <article className="bg-[#111827] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl mb-6">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800"><img src={post.userAvatar} className="w-full h-full object-cover rounded-full" alt="pfp" /></div>
          <div><h4 className="font-bold text-sm">{post.userName}</h4><p className="text-[10px] text-gray-500 uppercase">{post.timestamp}</p></div>
        </div>
        {currentUser?.trinetraId === post.userId && (
          <button className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest"><Zap size={14}/> {t("Boost")}</button>
        )}
      </div>

      <div className="px-4 pb-2"><p className="text-sm text-gray-200">{post.content}</p></div>
      {post.mediaUrl && <img src={post.mediaUrl} className="w-full max-h-[500px] object-cover" alt="media" />}

      {/* Point 4: Escalation Tracker View */}
      {escalationLevel && (
        <div className="mx-4 mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Gavel size={16} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{t("Current Level:")} {escalationLevel}</span>
            </div>
            <span className="text-[8px] text-gray-400 uppercase">{t("Auto-Tracking Active")}</span>
        </div>
      )}

      <div className="p-4 border-t border-gray-900 flex justify-between items-center mt-2">
        <div className="flex gap-6 items-center">
          <Heart size={22} className="text-gray-400 hover:text-red-500 cursor-pointer" />
          <MessageCircle size={22} className="text-gray-400 hover:text-cyan-400 cursor-pointer" />
          <Share2 size={22} className="text-gray-400 hover:text-green-500 cursor-pointer" />
        </div>
        <button onClick={handleEscalate} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-xl border border-red-500/30 transition-all">
          <ShieldAlert size={20} />
        </button>
      </div>
    </article>
  );
}
