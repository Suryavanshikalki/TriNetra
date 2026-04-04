import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Share2, Download, ShieldAlert, 
  Search, Plus, MoreHorizontal, Globe, Loader2, Send, FileText 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render) 🔥
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { TriNetraLogo } from '../../App';
import CreatePost from './CreatePost'; 
import CommentSection from './CommentSection'; 

const client = generateClient();

export default function HomeFeed({ currentUser }) {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedComments, setExpandedComments] = useState({});

  // ─── 1. REAL AWS APPSYNC FETCH (Facebook Style) ─────────────────
  useEffect(() => {
    fetchFeed();

    // 🔥 Real-time Subscription: Feed Auto-Refresh
    const sub = client.graphql({
      query: `subscription OnNewPost { onNewTriNetraPost { id userId text mediaUrl mediaType escalationLevel timestamp } }`
    }).subscribe({
      next: ({ data }) => {
        setPosts(prev => [data.onNewTriNetraPost, ...prev]);
      }
    });

    return () => sub.unsubscribe();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await client.graphql({
        query: `query ListPosts { listTriNetraPosts(limit: 50) { items { id userId text mediaUrl mediaType escalationLevel timestamp likes comments } } }`
      });
      const sortedPosts = res.data.listTriNetraPosts.items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPosts(sortedPosts);
    } catch (err) {
      console.error("❌ AWS Feed Offline:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. REAL UNIVERSAL DOWNLOAD (Original S3 Quality) ────────────
  const downloadOriginalMedia = async (url, type) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const ext = type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : type === 'audio' ? 'mp3' : 'pdf';
      link.download = `TriNetra_Post_${Date.now()}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Direct Download Failed:", err);
    }
  };

  // ─── 3. THE 30,000/MONTH ESCALATION ENGINE (AWS Lambda) ──────────
  const handleEscalate = async (postId) => {
    const confirm = window.confirm(t("Escalate this issue to the Chain of Command (Local -> MLA -> CM -> Supreme Court)?"));
    if (confirm) {
      try {
        await client.graphql({
          query: `mutation TriggerEscalation($postId: ID!, $userId: ID!) {
            triggerTriNetraEscalation(postId: $postId, userId: $userId) { status level }
          }`,
          variables: { postId, userId: currentUser?.trinetraId }
        });
        alert(t("Escalation Active. Case tracked by TriNetra Justice Engine."));
      } catch (err) {
        alert(t("Escalation server connection failed."));
      }
    }
  };

  // ─── 4. REAL AI TRANSLATION (Point 12 via Gemini/AWS) ────────────
  const handleTranslate = async (postId, text) => {
    try {
      const res = await client.graphql({
        query: `mutation Translate($text: String!, $targetLang: String!) {
          translateText(text: $text, targetLang: $targetLang) { translatedText }
        }`,
        variables: { text, targetLang: i18n.language }
      });
      setPosts(posts.map(p => p.id === postId ? { ...p, translatedContent: res.data.translateText.translatedText } : p));
    } catch (err) {
      console.error("❌ Translation Failed:", err);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans overflow-y-auto pb-24">
      
      {/* 🚀 Top Header & Search */}
      <header className="p-4 bg-[#111827] sticky top-0 z-50 border-b border-gray-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <TriNetraLogo size={32} pulse={true} />
          <h1 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
            TriNetra
          </h1>
        </div>
        <div className="flex-1 mx-4 relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          <input 
            type="text" 
            placeholder={t("Search Marketplace, Posts...")}
            className="w-full bg-[#0a1014] border border-gray-800 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Plus className="text-cyan-400 cursor-pointer active:scale-90 hover:text-white transition-transform" />
      </header>

      {/* 📝 Create Post Input */}
      <div className="max-w-2xl mx-auto w-full pt-4 px-4">
        <CreatePost currentUser={currentUser} onPostCreated={fetchFeed} />
      </div>

      {/* 📱 Real Feed Stream */}
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center mt-10"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>
      ) : (
        <div className="max-w-2xl mx-auto w-full p-4 space-y-6">
          {posts.filter(p => p.text?.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery).map((post) => (
            <article key={post.id} className="bg-[#111827] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl animate-fade-in-up">
              
              {/* User Header */}
              <div className="p-4 flex justify-between items-center border-b border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-500 overflow-hidden flex items-center justify-center font-bold">
                     {post.userId?.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide">{post.userId}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(post.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <MoreHorizontal size={20} className="text-gray-500 cursor-pointer hover:text-white" />
              </div>

              {/* 🚨 Auto-Escalation Alert UI */}
              {post.escalationLevel && post.escalationLevel !== 'NONE' && (
                <div className="bg-red-900/30 border-y border-red-900 p-2 flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest shadow-inner">
                  <ShieldAlert size={14} className="animate-pulse" />
                  {t("Escalated to:")} {post.escalationLevel} 
                  <span className="bg-red-500 text-black px-2 py-0.5 rounded ml-2">URGENT</span>
                </div>
              )}

              {/* Post Content */}
              <div className="px-4 pb-2 pt-3">
                <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
                  {post.translatedContent || post.text}
                </p>
                {post.text && !post.translatedContent && (
                  <button 
                    onClick={() => handleTranslate(post.id, post.text)}
                    className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mt-2 hover:text-white transition-colors"
                  >
                    {t("See Translation")}
                  </button>
                )}
              </div>

              {/* 🖼️ Media Rendering with Download Button */}
              {post.mediaUrl && (
                <div className="relative group bg-black flex justify-center border-y border-gray-800 w-full">
                  {post.mediaType === 'image' && <img src={post.mediaUrl} className="w-full max-h-[500px] object-contain" alt="post_media" />}
                  {post.mediaType === 'video' && <video src={post.mediaUrl} controls className="w-full max-h-[500px]" />}
                  {post.mediaType === 'audio' && <audio src={post.mediaUrl} controls className="w-full p-4" />}
                  
                  {/* 🔥 FIXED: PDF UI Display Added Here */}
                  {post.mediaType === 'pdf' && (
                    <div className="w-full p-10 flex flex-col items-center justify-center bg-gray-900 text-red-400 gap-3">
                      <FileText size={48} className="drop-shadow-lg" />
                      <span className="text-xs font-black uppercase tracking-widest text-white">TriNetra Document (PDF)</span>
                    </div>
                  )}
                  
                  {/* Universal Download Button (Point 4) */}
                  <button 
                    onClick={() => downloadOriginalMedia(post.mediaUrl, post.mediaType)}
                    className="absolute top-4 right-4 bg-black/80 p-2 rounded-xl border border-gray-700 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:text-cyan-400 hover:border-cyan-500 shadow-xl active:scale-90"
                    title={t("Download Original")}
                  >
                    <Download size={20} />
                  </button>
                </div>
              )}

              {/* 🎛️ Action Bar */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex gap-6 items-center">
                  <div className="flex items-center gap-1 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors active:scale-90">
                    <Heart size={22} /> <span className="text-xs font-bold">{post.likes || 0}</span>
                  </div>
                  <div 
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1 cursor-pointer transition-colors active:scale-90 ${expandedComments[post.id] ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}`}
                  >
                    <MessageCircle size={22} /> <span className="text-xs font-bold">{post.comments || 0}</span>
                  </div>
                  <div className="text-gray-400 hover:text-green-500 cursor-pointer transition-colors active:scale-90">
                    <Share2 size={22} />
                  </div>
                </div>

                {/* Point 4: Escalation Button */}
                <button 
                  onClick={() => handleEscalate(post.id)}
                  className="bg-red-900/30 hover:bg-red-600 hover:text-white text-red-500 p-2.5 rounded-xl border border-red-500/50 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                  title={t("Escalate for Justice")}
                >
                  <ShieldAlert size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t("Escalate")}</span>
                </button>
              </div>

              {/* 💬 Comments Section Link */}
              {expandedComments[post.id] && (
                <CommentSection postId={post.id} currentUser={currentUser} />
              )}

            </article>
          ))}
        </div>
      )}
    </div>
  );
}
