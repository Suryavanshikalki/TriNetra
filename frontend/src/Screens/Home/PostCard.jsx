import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Download, ShieldAlert, Zap, Gavel, MoreVertical, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Render, No Axios) 🔥
import { generateClient } from 'aws-amplify/api';
import CommentSection from './CommentSection'; // आपकी बनाई हुई असली कमेंट फाइल

const client = generateClient();

export default function PostCard({ post, currentUser }) {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(post.escalationLevel || null);

  // ─── 1. REAL UNIVERSAL DOWNLOAD (Point 4 - Save to Gallery) ────────
  const handleUniversalDownload = async () => {
    if (!post.mediaUrl) return;
    setIsDownloading(true);
    try {
      // Fetching as blob to force browser download instead of opening tab
      const response = await fetch(post.mediaUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      // Naming format: TriNetra_User_Timestamp
      const ext = post.mediaType === 'video' ? 'mp4' : post.mediaType === 'audio' ? 'mp3' : post.mediaType === 'pdf' ? 'pdf' : 'jpg';
      link.download = `TriNetra_${post.userId}_${Date.now()}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── 2. REAL AUTO-ESCALATION TRIGGER (Point 4 - 30k/month Tier) ─────
  const handleEscalate = async () => {
    const confirm = window.confirm(t("Escalate this issue to the Chain of Command (MLA -> CM -> PM -> Supreme Court)?"));
    if (!confirm) return;

    setIsEscalating(true);
    try {
      // 🔥 AWS AppSync Mutation: Triggering the Justice Engine
      const mutation = `
        mutation TriggerEscalation($postId: ID!, $userId: ID!) {
          triggerTriNetraEscalation(postId: $postId, userId: $userId) {
            status
            newLevel
          }
        }
      `;
      const res = await client.graphql({
        query: mutation,
        variables: { postId: post.id || post._id, userId: currentUser?.trinetraId }
      });

      if (res.data.triggerTriNetraEscalation.status === 'SUCCESS') {
        setCurrentLevel(res.data.triggerTriNetraEscalation.newLevel);
        alert(t("Escalation Active. Case tracked by TriNetra Justice Engine."));
      }
    } catch (err) {
      alert(t("Escalation Failed. Check your connectivity to AWS."));
    } finally {
      setIsEscalating(false);
    }
  };

  return (
    <article className="bg-[#111827] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl mb-6 animate-fade-in-up">
      
      {/* Post Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-500 flex items-center justify-center font-bold text-white">
            {post.userId?.substring(0,2).toUpperCase() || 'TR'}
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide text-white">{post.userName || post.userId}</h4>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                {new Date(post.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Boost Button (Point 6, 7-10) */}
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                <Zap size={12}/> {t("Boost")}
            </button>
            <MoreVertical size={18} className="text-gray-500 cursor-pointer" />
        </div>
      </div>

      {/* Post Text */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content || post.text}</p>
      </div>

      {/* 🖼️ Real Media Area with UNIVERSAL DOWNLOAD BUTTON */}
      {post.mediaUrl && (
        <div className="relative group bg-black border-y border-gray-800 flex justify-center overflow-hidden">
          {post.mediaType === 'video' ? (
              <video src={post.mediaUrl} controls className="w-full max-h-[500px]" />
          ) : post.mediaType === 'pdf' ? (
              <div className="p-10 flex flex-col items-center text-red-500"><Gavel size={40}/> <span className="text-xs font-bold mt-2">TriNetra_Case_Document.pdf</span></div>
          ) : (
              <img src={post.mediaUrl} className="w-full max-h-[500px] object-contain" alt="media" />
          )}

          {/* 🔥 UNIVERSAL DOWNLOAD BUTTON (Point 4) 🔥 */}
          <button 
            onClick={handleUniversalDownload}
            disabled={isDownloading}
            className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-gray-700 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:text-cyan-400 shadow-2xl active:scale-90"
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={20} />}
          </button>
        </div>
      )}

      {/* Point 4: Escalation Tracker View (MLA -> CM -> PM) */}
      {currentLevel && (
        <div className="mx-4 mt-4 p-3 bg-red-500/10 rounded-2xl border border-red-500/30 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
                <Gavel size={16} className="text-red-500 animate-bounce-slow" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    {t("Justice Chain:")} <span className="text-white ml-1">{currentLevel}</span>
                </span>
            </div>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">{t("Auto-Escalation Active")}</span>
        </div>
      )}

      {/* Interaction Bar */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <Heart size={22} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors active:scale-125" />
          <MessageCircle 
            size={22} 
            className={`cursor-pointer transition-colors ${showComments ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}`} 
            onClick={() => setShowComments(!showComments)}
          />
          <Share2 size={22} className="text-gray-400 hover:text-green-500 cursor-pointer transition-colors" />
        </div>
        
        {/* Escalation Shield Button */}
        <button 
            onClick={handleEscalate} 
            disabled={isEscalating}
            className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl border border-red-500/30 transition-all shadow-lg active:scale-95"
        >
          {isEscalating ? <Loader2 size={20} className="animate-spin" /> : <ShieldAlert size={20} />}
        </button>
      </div>

      {/* 💬 Real Comment Section Integration */}
      {showComments && (
        <CommentSection postId={post.id || post._id} currentUser={currentUser} />
      )}
    </article>
  );
}
