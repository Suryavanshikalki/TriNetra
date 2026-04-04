import React, { useState, useEffect, useRef } from 'react';
import { Plus, Camera, Image as ImageIcon, Loader2, Download, X, PlayCircle, Mic, FileText, Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Mock Data) 🔥
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function StoryViewer({ currentUser }) {
  const { t } = useTranslation();
  const [stories, setStories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingStory, setViewingStory] = useState(null);
  
  // 🔥 New: Story Creation Options State
  const [showOptions, setShowOptions] = useState(false);
  const [textStoryContent, setTextStoryContent] = useState('');
  const [showTextModal, setShowTextModal] = useState(false);

  // Hidden Inputs for All Blueprint Media Types
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const micRef = useRef(null);
  const pdfRef = useRef(null);

  // ─── 1. REAL-TIME AWS STORY FETCH (Last 24 Hours) ─────────────────
  useEffect(() => {
    fetchActiveStories();
    
    const sub = client.graphql({
      query: `subscription OnNewStory { onNewTriNetraStory { id userId text mediaUrl mediaType timestamp } }`
    }).subscribe({
      next: ({ data }) => {
        setStories(prev => [data.onNewTriNetraStory, ...prev]);
      }
    });

    return () => sub.unsubscribe();
  }, []);

  const fetchActiveStories = async () => {
    try {
      const res = await client.graphql({
        query: `query ListActiveStories { listActiveStories { items { id userId text mediaUrl mediaType timestamp } } }`
      });
      // Sort oldest to newest for viewing progression
      setStories(res.data.listActiveStories.items.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)));
    } catch (err) {
      console.error("❌ AWS Story Fetch Error:", err);
    }
  };

  // ─── 2. ALL MEDIA UPLOAD LOGIC (Photo, Video, Audio, Mic, PDF) ────
  const handleStoryMedia = async (e, forceType = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setShowOptions(false);

    try {
      const fileExt = file.name.split('.').pop() || (forceType === 'audio' ? 'mp3' : 'file');
      const mediaType = forceType || (file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : file.type.includes('pdf') ? 'pdf' : 'audio');
      const fileName = `stories/${currentUser?.trinetraId}/${Date.now()}_story.${fileExt}`;

      // Secure S3 Upload
      await uploadData({
        path: `public/${fileName}`,
        data: file,
        options: { contentType: file.type || 'application/octet-stream', accessLevel: 'guest' }
      }).result;

      const urlResult = await getUrl({ path: `public/${fileName}` });
      await postStoryToAWS(null, urlResult.url.toString(), mediaType);
    } catch (err) {
      alert(t("Failed to upload story securely."));
    } finally {
      setIsUploading(false);
    }
  };

  // ─── 3. TEXT STORY LOGIC ──────────────────────────────────────────
  const handleTextStory = async () => {
    if (!textStoryContent.trim()) return;
    setIsUploading(true);
    setShowTextModal(false);

    try {
      await postStoryToAWS(textStoryContent, null, 'text');
    } catch (err) {
      alert(t("Text Story Failed."));
    } finally {
      setIsUploading(false);
      setTextStoryContent('');
    }
  };

  // ─── AWS DYNAMODB SAVER ───────────────────────────────────────────
  const postStoryToAWS = async (text, mediaUrl, mediaType) => {
    await client.graphql({
      query: `mutation CreateStory($userId: ID!, $text: String, $mediaUrl: String, $mediaType: String!) {
        createTriNetraStory(userId: $userId, text: $text, mediaUrl: $mediaUrl, mediaType: $mediaType) { id }
      }`,
      variables: { userId: currentUser?.trinetraId, text, mediaUrl, mediaType }
    });
    fetchActiveStories();
  };

  // ─── 4. TRUE UNIVERSAL DOWNLOAD (Point 4) ─────────────────────────
  const downloadStory = async (url, mediaType) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const ext = mediaType === 'video' ? 'mp4' : mediaType === 'audio' ? 'mp3' : mediaType === 'pdf' ? 'pdf' : 'jpg';
      link.download = `TriNetra_Story_${Date.now()}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto bg-[#0a1014] border-b border-gray-800 scrollbar-hide font-sans relative z-40">
      
      {/* ➕ Create Story Button with Blueprint Options */}
      <div className="flex flex-col items-center cursor-pointer group relative">
        <div 
          onClick={() => setShowOptions(!showOptions)}
          className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center border-2 border-dashed border-cyan-700 relative group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.1)]"
        >
          {isUploading ? (
            <Loader2 className="text-cyan-500 animate-spin" size={24} />
          ) : (
            <Plus className="text-cyan-500 group-hover:scale-110 transition-transform" size={28} />
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mt-2">{t("Your Story")}</span>
        
        {/* 🔥 A to Z Blueprint Upload Options Drawer */}
        {showOptions && !isUploading && (
          <div className="absolute top-20 left-0 bg-[#111827] border border-cyan-500/30 rounded-2xl p-3 flex gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 animate-fade-in-up">
             <button onClick={() => galleryRef.current.click()} title="Gallery" className="p-2 bg-gray-800 rounded-full text-blue-400 hover:bg-blue-900 active:scale-90"><ImageIcon size={18}/></button>
             <button onClick={() => cameraRef.current.click()} title="Camera" className="p-2 bg-gray-800 rounded-full text-pink-400 hover:bg-pink-900 active:scale-90"><Camera size={18}/></button>
             <button onClick={() => micRef.current.click()} title="Voice/Mic" className="p-2 bg-gray-800 rounded-full text-violet-400 hover:bg-violet-900 active:scale-90"><Mic size={18}/></button>
             <button onClick={() => pdfRef.current.click()} title="PDF Document" className="p-2 bg-gray-800 rounded-full text-red-400 hover:bg-red-900 active:scale-90"><FileText size={18}/></button>
             <button onClick={() => {setShowOptions(false); setShowTextModal(true);}} title="Text Story" className="p-2 bg-gray-800 rounded-full text-green-400 hover:bg-green-900 active:scale-90"><Type size={18}/></button>
          </div>
        )}

        {/* Hidden Inputs */}
        <input type="file" ref={galleryRef} className="hidden" accept="image/*,video/*" onChange={handleStoryMedia} />
        <input type="file" ref={cameraRef} className="hidden" accept="image/*,video/*" capture="environment" onChange={(e) => handleStoryMedia(e, 'camera')} />
        <input type="file" ref={micRef} className="hidden" accept="audio/*" capture="microphone" onChange={(e) => handleStoryMedia(e, 'audio')} />
        <input type="file" ref={pdfRef} className="hidden" accept=".pdf" onChange={(e) => handleStoryMedia(e, 'pdf')} />
      </div>

      {/* 📱 Real Stories List (AWS DynamoDB) */}
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center cursor-pointer relative" onClick={() => setViewingStory(story)}>
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-full p-0.5 shadow-lg active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#0a1014] rounded-full p-0.5">
              <div className="w-full h-full bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative flex items-center justify-center">
                {/* Visual Thumbnails based on Blueprint Types */}
                {story.mediaType === 'image' && <img src={story.mediaUrl} className="w-full h-full object-cover" alt="story" />}
                {story.mediaType === 'video' && <><video src={story.mediaUrl} className="w-full h-full object-cover opacity-40"/><PlayCircle size={18} className="absolute text-white" /></>}
                {story.mediaType === 'audio' && <Mic size={20} className="text-violet-400" />}
                {story.mediaType === 'pdf' && <FileText size={20} className="text-red-400" />}
                {story.mediaType === 'text' && <span className="text-[8px] font-black uppercase text-green-400 p-1 text-center truncate">{story.text}</span>}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-300 mt-2 truncate w-16 text-center tracking-tighter">
            {story.userId?.substring(0,8)}
          </span>
        </div>
      ))}

      {/* 📺 Full-Screen Multi-Media Story Viewer Overlay */}
      {viewingStory && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center animate-fade-in font-sans">
          
          <div className="absolute top-6 left-6 flex items-center gap-3 w-full z-10 bg-gradient-to-b from-black/80 to-transparent p-4 -mt-6 -ml-6">
             <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                {viewingStory.userId.substring(0,2).toUpperCase()}
             </div>
             <div>
               <span className="font-bold text-sm text-white tracking-wide">{viewingStory.userId}</span>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(viewingStory.timestamp).toLocaleTimeString()}</p>
             </div>
          </div>

          <div className="absolute top-6 right-6 flex gap-4 z-20">
             {viewingStory.mediaUrl && (
               <button onClick={() => downloadStory(viewingStory.mediaUrl, viewingStory.mediaType)} className="bg-black/50 p-2 rounded-full text-white hover:text-cyan-400 active:scale-90 border border-gray-700">
                 <Download size={20} />
               </button>
             )}
             <button onClick={() => setViewingStory(null)} className="bg-black/50 p-2 rounded-full text-white hover:text-red-500 active:scale-90 border border-gray-700">
               <X size={20} />
             </button>
          </div>

          {/* 🖼️ Player for ALL Media Types */}
          <div className="w-full max-w-lg h-[85vh] flex items-center justify-center p-2 relative">
            {viewingStory.mediaType === 'image' && <img src={viewingStory.mediaUrl} className="max-w-full max-h-full rounded-3xl object-contain" alt="view" />}
            {viewingStory.mediaType === 'video' && <video src={viewingStory.mediaUrl} controls autoPlay playsInline className="max-w-full max-h-full rounded-3xl object-contain" />}
            {viewingStory.mediaType === 'audio' && (
              <div className="flex flex-col items-center bg-gray-900 p-10 rounded-3xl border border-violet-500/30 w-3/4 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
                 <Mic size={60} className="text-violet-500 mb-6 animate-pulse" />
                 <audio src={viewingStory.mediaUrl} controls autoPlay className="w-full" />
              </div>
            )}
            {viewingStory.mediaType === 'pdf' && (
              <div className="flex flex-col items-center bg-gray-900 p-10 rounded-3xl border border-red-500/30 w-3/4">
                 <FileText size={60} className="text-red-500 mb-4" />
                 <span className="text-white font-bold uppercase tracking-widest text-sm mb-6">TriNetra Document</span>
                 <button onClick={() => downloadStory(viewingStory.mediaUrl, 'pdf')} className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest flex gap-2 active:scale-95">
                    <Download size={20}/> Download PDF
                 </button>
              </div>
            )}
            {viewingStory.mediaType === 'text' && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900 to-violet-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
                 <p className="text-3xl font-black text-white text-center leading-tight tracking-tight drop-shadow-xl whitespace-pre-wrap">{viewingStory.text}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✍️ Text Story Input Modal */}
      {showTextModal && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] w-full max-w-md p-6 rounded-3xl border border-gray-700 shadow-2xl relative">
            <button onClick={() => setShowTextModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><X size={24}/></button>
            <h3 className="text-cyan-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Type size={18}/> Create Text Story</h3>
            <textarea 
              autoFocus
              className="w-full bg-[#0a1014] border border-gray-800 text-white rounded-xl p-4 h-32 focus:border-cyan-500 outline-none text-lg resize-none"
              placeholder={t("Type your status here...")}
              value={textStoryContent}
              onChange={(e) => setTextStoryContent(e.target.value)}
            />
            <button 
              onClick={handleTextStory}
              disabled={!textStoryContent.trim() || isUploading}
              className="w-full mt-4 bg-cyan-500 text-black py-4 rounded-xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
               {isUploading ? <Loader2 className="animate-spin mx-auto" size={20}/> : t("Post Text Story")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
