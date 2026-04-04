import React, { useState, useEffect, useRef } from 'react';
import { Mic, Image as ImageIcon, Video, Camera, FileText, Send, Download, ShieldCheck, Globe, Loader2, ArrowLeft, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render) 🔥
import { post } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

export default function AIChatWindow({ currentUser, activeMode = 'Mode C: Super Agentic AI', onBack }) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null); // 🔥 Real Mic Input Reference

  // Auto-scroll to latest AI response
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── 1. REAL AWS AI CHAT LOGIC (Point 11: 6-in-1 Brain) ───────────
  const handleAISend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 🔥 Asli AWS API Gateway Call
      const restOperation = post({
        apiName: 'TriNetraAPI', 
        path: '/ai/chat',
        options: {
          body: {
            userId: currentUser?.trinetraId,
            message: input,
            mode: activeMode 
          }
        }
      });
      
      const response = await restOperation.response;
      const data = await response.body.json();

      if (data.success) {
        const aiResponse = { 
          role: 'ai', 
          text: data.response, 
          mediaUrl: data.mediaUrl || null,
          mediaType: data.mediaType || null,
          timestamp: new Date().toISOString() 
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (err) {
      console.error("AWS AI Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: t("Connection to Master Brain lost. AWS Network Error."), isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. REAL DIRECT AWS S3 UPLOAD (For All Media + MIC) ───────────
  const handleAIUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop() || (type === 'audio' ? 'mp3' : 'file');
      const fileName = `ai_inputs/${currentUser?.trinetraId}_${Date.now()}_input.${fileExt}`;
      
      // 🔥 Direct Upload to AWS S3
      await uploadData({
        path: `public/${fileName}`,
        data: file,
        options: { contentType: file.type || 'application/octet-stream', accessLevel: 'guest' }
      }).result;

      // 🔥 Get S3 CDN URL
      const urlResult = await getUrl({ path: `public/${fileName}` });
      const s3Url = urlResult.url.toString();

      setMessages(prev => [...prev, { 
        role: 'user', 
        text: type === 'audio' ? t("🎤 Sent Voice Note for AI Analysis") : `${t("Uploaded")} ${type} ${t("for AI Analysis")}`, 
        mediaUrl: s3Url, 
        mediaType: type 
      }]);

      // Automatically trigger AI to analyze the uploaded file
      setInput(t(`Analyze this ${type} and give me professional insights based on your Super Agentic Brain.`));
      
      // Give UI a tiny delay before sending the auto-prompt
      setTimeout(() => handleAISend(), 500);
      
    } catch (err) {
      console.error("AWS S3 Upload Failed:", err);
      alert(t("AI Media upload to AWS failed."));
    } finally {
      setIsUploading(false);
    }
  };

  // ─── 3. UNIVERSAL DOWNLOAD (Point 11 & 4) ─────────────────────────
  const downloadAIOutput = async (url) => {
    if (!url) return;
    try {
      // 🔥 Force Download using Blob (Like we did in HomeFeed)
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `TriNetra_AI_Output_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download fallback");
      window.open(url, '_blank'); // Fallback if CORS prevents blob fetch
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-50 overflow-hidden">
      
      {/* 🧠 AI Header */}
      <header className="p-4 bg-[#111827] border-b border-gray-800 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-90" />
          <div>
            <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
              {t(activeMode)} <Globe size={16} className="text-green-500 animate-spin-slow" />
            </h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
              {t("Human-Brain Level Nervous System Active")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {/* Point 11: Collaboration */}
           <button title={t("Connect Collaborator Email")} className="text-gray-400 hover:text-cyan-400 transition-colors">
              <UserPlus size={20} />
           </button>
           <ShieldCheck size={24} className="text-cyan-500" title="100% Emotion Control Active" />
        </div>
      </header>

      {/* 💬 AI Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        {/* Welcome Message */}
        <div className="flex flex-col items-start w-full animate-fade-in">
          <div className="bg-[#111827] p-4 rounded-2xl border border-cyan-500/20 max-w-[85%] shadow-lg">
            <p className="text-sm leading-relaxed text-gray-300">
              {t("I am the TriNetra Master Brain. I am currently using 6 integrated models to process your requests. How can I help you invent or research today?")}
            </p>
          </div>
        </div>

        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} w-full animate-fade-in-up`}>
            <div className={`p-4 rounded-2xl max-w-[85%] shadow-xl ${m.role === 'user' ? 'bg-cyan-600 text-black rounded-tr-none' : m.isError ? 'bg-red-900/30 border border-red-500 text-red-100 rounded-tl-none' : 'bg-[#111827] text-white border border-gray-800 rounded-tl-none'}`}>
              
              {/* Media Display within AI Chat */}
              {m.mediaUrl && (
                <div className="w-full min-w-[200px] bg-black/40 rounded-xl mb-3 overflow-hidden relative border border-white/10 group">
                  {m.mediaType === 'image' || m.mediaType === 'photo' || m.mediaType === 'camera' ? (
                    <img src={m.mediaUrl} className="w-full h-auto object-contain" alt="ai_media" />
                  ) : m.mediaType === 'video' ? (
                    <video src={m.mediaUrl} controls className="w-full h-auto" />
                  ) : m.mediaType === 'audio' ? (
                    <audio src={m.mediaUrl} controls className="w-full p-2" />
                  ) : (
                    <div className="p-6 flex flex-col items-center gap-2">
                       <FileText size={40} className="text-cyan-400" />
                       <span className="text-[10px] font-bold uppercase tracking-tighter">TriNetra_Output_File</span>
                    </div>
                  )}
                  {/* Point 11: Universal Download for AI Outputs */}
                  <button onClick={() => downloadAIOutput(m.mediaUrl)} className="absolute top-2 right-2 bg-black/80 p-2 rounded-lg text-white hover:text-cyan-400 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download size={18} />
                  </button>
                </div>
              )}

              <p className="text-sm font-medium whitespace-pre-wrap">{m.text}</p>
              <span className={`text-[8px] mt-2 block opacity-50 ${m.role === 'user' ? 'text-right' : ''}`}>
                {new Date(m.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">
            <Loader2 size={14} className="animate-spin" /> {t("TriNetra Brain is Thinking...")}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ⌨️ Master Input Engine (Point 11: 8 Inputs) */}
      <div className="p-4 bg-[#111827] border-t border-gray-800 pb-10">
        
        {/* Hidden Audio Input for Mic */}
        <input type="file" accept="audio/*" capture="microphone" className="hidden" ref={audioRef} onChange={(e) => handleAIUpload(e, 'audio')} />

        {/* Multi-Media Input Tray */}
        <div className="flex gap-3 mb-4 text-cyan-400 overflow-x-auto hide-scrollbar pb-2">
            <label className="bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 cursor-pointer flex-shrink-0 transition-all active:scale-90">
              <ImageIcon size={20}/><input type="file" accept="image/*" className="hidden" onChange={(e) => handleAIUpload(e, 'photo')}/>
            </label>
            <label className="bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 cursor-pointer flex-shrink-0 transition-all active:scale-90">
              <Camera size={20}/><input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleAIUpload(e, 'camera')}/>
            </label>
            <label className="bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 cursor-pointer flex-shrink-0 transition-all active:scale-90">
              <Video size={20}/><input type="file" accept="video/*" className="hidden" onChange={(e) => handleAIUpload(e, 'video')}/>
            </label>
            <label className="bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 cursor-pointer flex-shrink-0 transition-all active:scale-90">
              <FileText size={20}/><input type="file" accept=".pdf,.doc,.txt,.js,.py,.cpp" className="hidden" onChange={(e) => handleAIUpload(e, 'document')}/>
            </label>
        </div>
        
        {/* Text & Voice Engine */}
        <form onSubmit={handleAISend} className="flex items-center gap-3 bg-[#0a1014] border border-gray-800 rounded-2xl p-1.5 focus-within:border-cyan-500 transition-all shadow-inner">
          <input 
            type="text" 
            className="w-full bg-transparent p-3 text-sm focus:outline-none placeholder-gray-600" 
            placeholder={t("Command the Master Brain (Mode C)...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isUploading}
          />
          {input.length === 0 ? (
             <button 
                type="button" 
                onClick={() => audioRef.current.click()} 
                disabled={isLoading || isUploading}
                title="Send Voice Note to AI"
                className="p-3 text-violet-400 hover:text-white transition-colors active:scale-90"
             >
                <Mic size={22} />
             </button>
          ) : (
             <button type="submit" disabled={isLoading || isUploading} className="p-3 bg-cyan-500 rounded-xl text-black hover:bg-cyan-400 transition-all active:scale-90 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                {isLoading || isUploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
             </button>
          )}
        </form>
      </div>
    </div>
  );
}
