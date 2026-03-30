import React, { useState, useEffect, useRef } from 'react';
import { Mic, Image as ImageIcon, Video, Camera, FileText, Send, Download, ShieldCheck, Globe, Loader2, ArrowLeft, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function AIChatWindow({ currentUser, activeMode = 'Mode C: Super Agentic AI', onBack }) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest AI response
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Point 11: Real Multi-Model AI Chat Logic
  const handleAISend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Real API hitting TriNetra AI Controller (File 54)
      // Background switches between 6 models based on query complexity
      const res = await axios.post('https://trinetra-umys.onrender.com/api/ai/chat', {
        userId: currentUser?.trinetraId,
        message: input,
        mode: activeMode
      });

      if (res.data.success) {
        const aiResponse = { 
          role: 'ai', 
          text: res.data.response, 
          mediaUrl: res.data.mediaUrl || null,
          mediaType: res.data.mediaType || null,
          timestamp: new Date().toISOString() 
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: t("Connection to Master Brain lost. Check credits (₹9999 plan)."), role: 'error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Point 11: Real Input Engine (Camera/PDF/Audio Upload to AI for Analysis)
  const handleAIUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('media', file);
    formData.append('userId', currentUser?.trinetraId);
    formData.append('analysisType', type);

    try {
      const res = await axios.post('https://trinetra-umys.onrender.com/api/ai/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessages(prev => [...prev, { 
          role: 'user', 
          text: `${t("Uploaded")} ${type} ${t("for AI Analysis")}`, 
          mediaUrl: res.data.url, 
          mediaType: type 
        }]);
        // Trigger AI to respond to the file
        setInput(t("Analyze this file and give me professional insights."));
      }
    } catch (err) {
      alert(t("AI Media analysis failed."));
    } finally {
      setIsUploading(false);
    }
  };

  // Point 11: Universal Download for AI Generated Files/Code/Videos
  const downloadAIOutput = (url) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `TriNetra_AI_Output_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-50 overflow-hidden">
      
      {/* 🧠 AI Header with Collaboration Option */}
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
           {/* Point 11: Collaboration ID Link */}
           <button title={t("Connect Collaborator")} className="text-gray-400 hover:text-cyan-400 transition-colors">
              <UserPlus size={20} />
           </button>
           <ShieldCheck size={24} className="text-cyan-500" />
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
            <div className={`p-4 rounded-2xl max-w-[85%] shadow-xl ${m.role === 'user' ? 'bg-cyan-600 text-black rounded-tr-none' : 'bg-[#111827] text-white border border-gray-800 rounded-tl-none'}`}>
              
              {/* Media Display within AI Chat */}
              {m.mediaUrl && (
                <div className="w-full min-w-[200px] bg-black/40 rounded-xl mb-3 overflow-hidden relative border border-white/10">
                  {m.mediaType === 'image' || m.mediaType === 'photo' ? (
                    <img src={m.mediaUrl} className="w-full h-auto object-contain" alt="ai_media" />
                  ) : (
                    <div className="p-6 flex flex-col items-center gap-2">
                       <FileText size={40} className="text-cyan-400" />
                       <span className="text-[10px] font-bold uppercase tracking-tighter">TriNetra_Output_File</span>
                    </div>
                  )}
                  {/* Point 11: Universal Download for AI Outputs */}
                  <button onClick={() => downloadAIOutput(m.mediaUrl)} className="absolute top-2 right-2 bg-black/60 p-2 rounded-lg text-white hover:text-cyan-400 backdrop-blur-md">
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
        
        {/* Multi-Media Input Tray */}
        <div className="flex gap-3 mb-4 text-cyan-400 overflow-x-auto hide-scrollbar pb-2">
            <label className="bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 cursor-pointer flex-shrink-0 transition-all active:scale-90">
              <ImageIcon size={20}/><input type="file" accept="image/*" className="hidden" onChange={(e) => handleAIUpload(e, 'photo')}/>
            </label>
            <label className="bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 cursor-pointer flex-shrink-0 transition-all active:scale-90">
              <Camera size={20}/><input type="file" accept="image/*" capture="camera" className="hidden" onChange={(e) => handleAIUpload(e, 'camera')}/>
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
             <button type="button" className="p-3 text-violet-400 hover:text-white transition-colors active:scale-90"><Mic size={22} /></button>
          ) : (
             <button type="submit" disabled={isLoading} className="p-3 bg-cyan-500 rounded-xl text-black hover:bg-cyan-400 transition-all active:scale-90 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
             </button>
          )}
        </form>
      </div>
    </div>
  );
}
