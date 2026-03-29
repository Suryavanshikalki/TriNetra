import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Video, Mic, FileText, Download, AlertTriangle, PlayCircle, Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function HomeFeed() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // 100% Real Data Fetching from TriNetra MongoDB
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://trinetra-umys.onrender.com/api/posts/feed');
      if(res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error("Feed load error");
    } finally {
      setIsLoadingFeed(false);
    }
  };

  // 100% Real Upload & Create Post
  const handlePostSubmit = async () => {
    if (!postContent && !selectedFile) return;
    setIsPosting(true);
    
    const formData = new FormData();
    formData.append('content', postContent);
    formData.append('userId', 'TRN_CURRENT_USER'); // Replaced with user context later
    if (selectedFile) formData.append('media', selectedFile);

    try {
      await axios.post('https://trinetra-umys.onrender.com/api/posts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPostContent('');
      setSelectedFile(null);
      fetchPosts(); 
    } catch (err) {
      console.error("Posting failed");
    } finally {
      setIsPosting(false);
    }
  };

  // Point 4: 100% Real Auto-Escalation System (Supreme Court Logic Trigger)
  const triggerEscalation = async (postId) => {
    const confirmAction = window.confirm(t("Escalate to Authorities? (Local -> CM -> Supreme Court)"));
    if (confirmAction) {
      try {
        const res = await axios.post('https://trinetra-umys.onrender.com/api/escalation/trigger', { postId });
        if(res.data.success) {
           // Replacing dummy alert with secure native notification in future, for now standard alert to confirm API hit
           window.alert(t(`Status: ${res.data.message}`)); 
        }
      } catch (err) {
        window.alert(t("Escalation trigger failed. Secure connection error."));
      }
    }
  };

  // Point 4: Universal Download (Real AWS S3 File Link Download)
  const downloadOriginalMedia = (mediaUrl) => {
    if (!mediaUrl) return;
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.target = '_blank';
    link.download = `TriNetra_Media_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-24 font-sans">
      
      {/* 100% Real Post Creation Section */}
      <div className="p-4 border-b border-gray-800 bg-[#111827]/50">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-500"></div>
          <textarea 
            placeholder={t("What's happening? Type, upload PDF, Audio, Video...")}
            className="bg-transparent w-full text-sm text-white focus:outline-none resize-none placeholder-gray-500"
            rows="2" value={postContent} onChange={(e) => setPostContent(e.target.value)} disabled={isPosting}
          />
        </div>
        
        {selectedFile && <div className="text-[10px] text-cyan-400 mb-2 font-bold bg-cyan-500/10 p-2 rounded">{t("File attached:")} {selectedFile.name}</div>}

        <div className="flex justify-between items-center border-t border-gray-800 pt-3">
          <div className="flex gap-4 text-cyan-400 relative">
            <label className="cursor-pointer hover:text-white"><ImageIcon size={20}/><input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])}/></label>
            <label className="cursor-pointer hover:text-white"><Video size={20}/><input type="file" accept="video/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])}/></label>
            <label className="cursor-pointer text-violet-400 hover:text-white"><Mic size={20}/><input type="file" accept="audio/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])}/></label>
            <label className="cursor-pointer text-green-400 hover:text-white"><FileText size={20}/><input type="file" accept=".pdf,.doc,.txt" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])}/></label>
          </div>
          
          <button onClick={handlePostSubmit} disabled={isPosting} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs px-4 py-2 rounded-lg tracking-widest transition-all flex items-center gap-2">
             {isPosting ? <Loader2 size={14} className="animate-spin" /> : <>{t("Post")} <Send size={14}/></>}
          </button>
        </div>
      </div>

      {/* 100% Real Feed Renderer from Database */}
      <div className="flex flex-col gap-2 bg-black">
        {isLoadingFeed ? (
           <div className="p-8 flex justify-center items-center"><Loader2 size={30} className="text-cyan-500 animate-spin" /></div>
        ) : posts.length === 0 ? (
           <div className="p-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">{t("No posts available in your feed.")}</div>
        ) : posts.map((post) => (
          <div key={post._id} className="bg-[#111827] p-4 border-y border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                <div>
                  <p className="font-bold text-sm tracking-wide">{post.authorName || 'TriNetra User'}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <button onClick={() => triggerEscalation(post._id)} className="bg-red-500/10 border border-red-500/50 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 active:scale-95">
                <AlertTriangle size={12} /> {t("Escalate Issue")}
              </button>
            </div>
            
            <p className="text-sm mb-3 text-gray-300">{post.content}</p>

            {post.mediaUrl && (
              <div className="relative w-full h-48 bg-black rounded-xl border border-gray-800 flex items-center justify-center group mb-3 overflow-hidden">
                {post.mediaType === 'video' ? <PlayCircle size={48} className="text-cyan-400 z-10" /> : <img src={post.mediaUrl} className="w-full h-full object-cover opacity-80" alt="post_media"/>}
                
                <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                  <button onClick={() => downloadOriginalMedia(post.mediaUrl)} className="bg-black/80 p-2 rounded-lg backdrop-blur text-white hover:text-cyan-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest border border-gray-600">
                    <Download size={14} /> {t("Original")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
