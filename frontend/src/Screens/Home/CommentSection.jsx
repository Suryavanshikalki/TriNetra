import React, { useState, useEffect, useRef } from 'react';
import { Mic, Paperclip, Send, Smile, Download, FileText, Globe, Image as ImageIcon, Video, Camera, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Fake States) 🔥
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function CommentSection({ postId, currentUser }) {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [translatedText, setTranslatedText] = useState({});
  const [isTranslating, setIsTranslating] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null); // 🔥 Asli Mic Input Reference

  // ─── 1. REAL AWS REAL-TIME FETCH ──────────────────────────────────
  useEffect(() => {
    if (!postId) return;
    fetchComments();
    
    const subscription = client.graphql({
      query: `subscription OnNewComment($postId: ID!) {
        onNewTriNetraComment(postId: $postId) { id text mediaUrl mediaType userId timestamp }
      }`,
      variables: { postId }
    }).subscribe({
      next: ({ data }) => {
        setCommentsList(prev => [...prev, data.onNewTriNetraComment]);
      }
    });

    return () => subscription.unsubscribe();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await client.graphql({
        query: `query GetComments($postId: ID!) {
          getTriNetraComments(postId: $postId) { items { id text mediaUrl mediaType userId timestamp } }
        }`,
        variables: { postId }
      });
      setCommentsList(res.data.getTriNetraComments.items);
    } catch (err) {
      console.error("❌ Failed to load comments:", err);
    }
  };

  // ─── 2. REAL DIRECT AWS S3 MEDIA & VOICE UPLOAD ───────────────────
  const handleMediaUpload = async (e, forceType = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || (forceType === 'audio' ? 'mp3' : 'file');
      const mediaType = forceType || (file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : file.type.includes('pdf') ? 'pdf' : 'audio');
      const fileName = `comments/${postId}/${currentUser?.trinetraId}_${Date.now()}.${fileExt}`;
      
      await uploadData({
        path: `public/${fileName}`,
        data: file,
        options: { contentType: file.type || 'application/octet-stream', accessLevel: 'guest' }
      }).result;

      const urlResult = await getUrl({ path: `public/${fileName}` });
      
      // Auto-post comment with media or voice note
      await postComment(forceType === 'audio' ? t("🎤 Voice Comment") : null, urlResult.url.toString(), mediaType);
    } catch (err) {
      alert(t("Media upload failed securely."));
    } finally {
      setIsUploading(false);
    }
  };

  // ─── 3. REAL AWS COMMENT POSTING ──────────────────────────────────
  const postComment = async (textToPost = commentText, mediaUrl = null, mediaType = null) => {
    if (!textToPost.trim() && !mediaUrl) return;
    setIsSending(true);
    try {
      await client.graphql({
        query: `mutation CreateComment($postId: ID!, $userId: ID!, $text: String, $mediaUrl: String, $mediaType: String) {
          createTriNetraComment(postId: $postId, userId: $userId, text: $text, mediaUrl: $mediaUrl, mediaType: $mediaType) { id }
        }`,
        variables: { postId, userId: currentUser?.trinetraId, text: textToPost, mediaUrl, mediaType }
      });
      setCommentText('');
    } catch (err) {
      console.error("❌ Comment posting failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  // ─── 4. REAL AI MULTI-LANGUAGE TRANSLATOR ─────────────────────────
  const handleTranslate = async (commentId, originalText) => {
    if (!originalText) return;
    setIsTranslating(prev => ({ ...prev, [commentId]: true }));
    
    try {
      const res = await client.graphql({
        query: `mutation Translate($text: String!, $targetLang: String!) {
          translateText(text: $text, targetLang: "hi") { translatedText }
        }`,
        variables: { text: originalText, targetLang: 'hi' }
      });
      setTranslatedText(prev => ({ ...prev, [commentId]: res.data.translateText.translatedText }));
    } catch (err) {
      console.error("❌ Translation failed:", err);
    } finally {
      setIsTranslating(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // ─── 5. TRUE UNIVERSAL DOWNLOAD (Blob Forced) ─────────────────────
  const downloadMedia = async (url, type) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const ext = type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : type === 'audio' ? 'mp3' : 'pdf';
      link.download = `TriNetra_Comment_${Date.now()}.${ext}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download Error", err);
      window.open(url, '_blank'); // Fallback
    }
  };

  return (
    <div className="bg-[#0a1014] border-t border-gray-800 p-4 font-sans text-white">
      
      {/* 💬 Real-Time Comments List */}
      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto hide-scrollbar">
        {commentsList.map((cmd) => (
          <div key={cmd.id} className="flex space-x-3 animate-fade-in">
            <div className="w-8 h-8 bg-cyan-900 border border-cyan-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs">
              {cmd.userId?.substring(0,2).toUpperCase()}
            </div>
            
            <div className="bg-[#111827] p-3 rounded-2xl flex-1 text-sm text-gray-200 border border-gray-800 shadow-sm">
              <span className="font-black text-cyan-400 block mb-1 text-xs">{cmd.userId}</span>
              
              {/* Comment Text */}
              {cmd.text && <p className="whitespace-pre-wrap leading-relaxed">{translatedText[cmd.id] || cmd.text}</p>}
              
              {/* Media Attachments */}
              {cmd.mediaUrl && (
                <div className="mt-3 relative group overflow-hidden rounded-xl border border-gray-700 bg-black max-w-xs">
                  {cmd.mediaType === 'image' && <img src={cmd.mediaUrl} alt="attachment" className="w-full h-auto object-cover max-h-48" />}
                  {cmd.mediaType === 'video' && <video src={cmd.mediaUrl} controls className="w-full max-h-48" />}
                  {cmd.mediaType === 'audio' && <audio src={cmd.mediaUrl} controls className="w-full p-2" />}
                  {cmd.mediaType === 'pdf' && (
                    <div className="p-4 flex items-center gap-2 text-red-400 font-bold bg-gray-900">
                      <FileText size={24} /> <span className="text-[10px] uppercase tracking-widest">TriNetra_Doc.pdf</span>
                    </div>
                  )}
                  
                  {/* True Universal Download Button */}
                  <button 
                    onClick={() => downloadMedia(cmd.mediaUrl, cmd.mediaType)} 
                    className="absolute top-2 right-2 bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-cyan-400 active:scale-90 shadow-lg"
                    title={t("Download to Device")}
                  >
                    <Download size={16} />
                  </button>
                </div>
              )}
              
              {/* Real Translate Button */}
              {cmd.text && !translatedText[cmd.id] && (
                <button 
                  onClick={() => handleTranslate(cmd.id, cmd.text)} 
                  disabled={isTranslating[cmd.id]}
                  className="text-[10px] uppercase font-black tracking-widest text-gray-500 mt-2 flex items-center hover:text-cyan-400 transition-colors"
                >
                  {isTranslating[cmd.id] ? <Loader2 size={12} className="mr-1 animate-spin"/> : <Globe size={12} className="mr-1"/>} 
                  {isTranslating[cmd.id] ? t('Translating...') : t('Translate')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ⌨️ Real Multi-Input Comment Box */}
      <div className="flex items-center bg-[#111827] border border-gray-800 rounded-2xl px-3 py-2 space-x-2 focus-within:border-cyan-500 transition-colors shadow-inner">
        
        {/* Hidden File Inputs */}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*,.pdf" onChange={(e) => handleMediaUpload(e)} />
        <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" capture="microphone" onChange={(e) => handleMediaUpload(e, 'audio')} />
        
        <Smile className="text-gray-500 cursor-pointer hover:text-yellow-500 transition-colors active:scale-90" size={20} />
        
        {/* Real Attachment Button */}
        {isUploading ? (
          <Loader2 className="text-cyan-500 animate-spin" size={20} />
        ) : (
          <Paperclip onClick={() => fileInputRef.current.click()} className="text-gray-500 cursor-pointer hover:text-cyan-400 transition-colors active:scale-90" size={20} />
        )}

        <input 
          type="text" 
          placeholder={t("Write a comment, attach media...")}
          className="flex-1 bg-transparent text-white outline-none text-sm px-2 placeholder-gray-600"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter') postComment(); }}
          disabled={isSending || isUploading}
        />

        {commentText ? (
          <button onClick={() => postComment()} disabled={isSending} className="text-cyan-500 hover:text-cyan-400 active:scale-90 transition-transform">
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        ) : (
          /* 🔥 Asli Mic Integration */
          <button 
            onClick={() => audioInputRef.current.click()} 
            disabled={isUploading}
            title={t("Voice Comment")} 
            className="text-violet-500 hover:text-violet-400 active:scale-90 transition-transform"
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
