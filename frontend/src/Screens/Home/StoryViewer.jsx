import React, { useState, useEffect, useRef } from 'react';
import { Plus, Camera, Image as ImageIcon, Loader2, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Mock Data) 🔥
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function StoryViewer({ currentUser }) {
  const { t } = useTranslation();
  const [stories, setStories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingStory, setViewingStory] = useState(null); // Full-screen view state
  const fileInputRef = useRef(null);

  // ─── 1. REAL-TIME AWS STORY FETCH (Last 24 Hours Only) ──────────
  useEffect(() => {
    fetchActiveStories();
    
    // AWS AppSync Subscription: नई स्टोरी आते ही फीड अपडेट होगी
    const sub = client.graphql({
      query: `subscription OnNewStory { onNewTriNetraStory { id userId mediaUrl mediaType timestamp } }`
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
        query: `query ListActiveStories { listActiveStories { items { id userId mediaUrl mediaType timestamp } } }`
      });
      setStories(res.data.listActiveStories.items);
    } catch (err) {
      console.error("❌ AWS Story Fetch Error:", err);
    }
  };

  // ─── 2. REAL DIRECT AWS S3 UPLOAD (Point 4) ──────────────────────
  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `stories/${currentUser?.trinetraId}/${Date.now()}_story.${fileExt}`;
      const mediaType = file.type.startsWith('image') ? 'image' : 'video';

      // Upload directly to S3
      await uploadData({
        path: `public/${fileName}`,
        data: file,
        options: { contentType: file.type, accessLevel: 'guest' }
      }).result;

      const urlResult = await getUrl({ path: `public/${fileName}` });

      // Save to AWS DynamoDB (Will auto-expire in 24h via TTL)
      await client.graphql({
        query: `mutation CreateStory($userId: ID!, $mediaUrl: String!, $mediaType: String!) {
          createTriNetraStory(userId: $userId, mediaUrl: $mediaUrl, mediaType: $mediaType) { id }
        }`,
        variables: {
          userId: currentUser?.trinetraId,
          mediaUrl: urlResult.url.toString(),
          mediaType: mediaType
        }
      });

      alert(t("Story uploaded successfully!"));
      fetchActiveStories();
    } catch (err) {
      alert(t("Failed to upload story."));
    } finally {
      setIsUploading(false);
    }
  };

  // ─── 3. UNIVERSAL DOWNLOAD (Point 4) ───────────────────────────
  const downloadStory = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `TriNetra_Story_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto bg-[#0a1014] border-b border-gray-800 scrollbar-hide font-sans">
      
      {/* ➕ Create Story Button */}
      <div className="flex flex-col items-center cursor-pointer group" onClick={() => fileInputRef.current.click()}>
        <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 relative group-hover:border-cyan-500 transition-colors">
          {isUploading ? (
            <Loader2 className="text-cyan-500 animate-spin" size={24} />
          ) : (
            <Camera className="text-gray-500 group-hover:text-cyan-500" size={24} />
          )}
          <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1 text-black shadow-lg">
            <Plus size={12} className="font-black"/>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">{t("Your Story")}</span>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleStoryUpload} />
      </div>

      {/* 📱 Real Stories List from AWS */}
      {stories.map((story) => (
        <div 
          key={story.id} 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setViewingStory(story)}
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-full p-0.5 shadow-lg active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#0a1014] rounded-full p-0.5">
              <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden border border-gray-900">
                {story.mediaType === 'image' ? (
                  <img src={story.mediaUrl} className="w-full h-full object-cover" alt="story" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-violet-900/20">
                    <Loader2 size={16} className="text-violet-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-300 mt-2 truncate w-16 text-center tracking-tighter">
            {story.userId}
          </span>
        </div>
      ))}

      {/* 📺 Full-Screen Story Viewer Overlay */}
      {viewingStory && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="absolute top-6 left-6 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black text-xs">
                {viewingStory.userId.substring(0,2).toUpperCase()}
             </div>
             <span className="font-bold text-sm text-white">{viewingStory.userId}</span>
          </div>

          <div className="absolute top-6 right-6 flex gap-4">
             <Download 
               className="text-white cursor-pointer hover:text-cyan-400" 
               onClick={() => downloadStory(viewingStory.mediaUrl)} 
             />
             <X className="text-white cursor-pointer hover:text-red-500" onClick={() => setViewingStory(null)} />
          </div>

          <div className="w-full max-w-lg h-[80vh] flex items-center justify-center p-4">
            {viewingStory.mediaType === 'image' ? (
              <img src={viewingStory.mediaUrl} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="view" />
            ) : (
              <video src={viewingStory.mediaUrl} controls autoPlay className="max-w-full max-h-full rounded-2xl shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
