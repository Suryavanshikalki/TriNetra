// ==========================================
// TRINETRA SUPER APP - MASTER AI CHAT & INPUT
// Exact File Path: src/screens/AI/AIChatbot.jsx
// Blueprint Point 11: 6-in-1 Brain, Camera/PDF/Mic Input, Multi-language
// ==========================================
import React, { useState } from 'react';
import { Mic, Image as ImageIcon, Video, Camera, FileText, Send, Download, ShieldCheck, Globe } from 'lucide-react';

const t = (text) => text;

export default function AIChatbot({ activeMode = 'Mode C: Super Agentic AI' }) {
  const [input, setInput] = useState('');

  const handleAIDownload = (filename) => {
    alert(t(`Downloading ${filename} directly from TriNetra AI Server to device.`));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-50">
      
      {/* 🧠 AI Header */}
      <header className="p-4 bg-[#111827] border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
            {t(activeMode)} <Globe size={16} className="text-green-500" />
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {t("100% Controlled Human-Level Brain | Multi-Language")}
          </p>
        </div>
        <ShieldCheck size={24} className="text-cyan-500" />
      </header>

      {/* 💬 AI Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* AI Message with Generated Media (Point 11 output download) */}
        <div className="flex flex-col items-start w-full">
          <div className="bg-[#111827] p-4 rounded-2xl border border-cyan-500/30 max-w-[85%]">
            <p className="text-sm leading-relaxed mb-3">
              {t("I have analyzed the medical research PDF you uploaded. Based on the 6 background models (Meta, GPT, DeepSeek, etc.), here is the new formula blueprint. I have translated it to your preferred language.")}
            </p>
            
            {/* Downloadable Output */}
            <div className="bg-[#0a1014] border border-gray-800 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <FileText size={20} className="text-cyan-400" />
                 <span className="text-xs font-bold text-gray-300">formula_v2.pdf</span>
              </div>
              <button onClick={() => handleAIDownload('formula_v2.pdf')} className="bg-cyan-500/20 text-cyan-400 p-2 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ⌨️ AI Input Engine (Point 11: Text, Photo, Video, Audio, Gallery, Camera, PDF, Mic) */}
      <div className="p-4 bg-[#111827] border-t border-gray-800 pb-8">
        <div className="flex gap-3 mb-3 text-cyan-400 overflow-x-auto hide-scrollbar">
            <button className="bg-[#0a1014] p-2 rounded-lg border border-gray-800 hover:border-cyan-500 flex-shrink-0"><ImageIcon size={18} /></button>
            <button className="bg-[#0a1014] p-2 rounded-lg border border-gray-800 hover:border-cyan-500 flex-shrink-0"><Camera size={18} /></button>
            <button className="bg-[#0a1014] p-2 rounded-lg border border-gray-800 hover:border-cyan-500 flex-shrink-0"><Video size={18} /></button>
            <button className="bg-[#0a1014] p-2 rounded-lg border border-gray-800 hover:border-cyan-500 flex-shrink-0"><FileText size={18} /></button>
        </div>
        
        <div className="flex items-center gap-2 bg-[#0a1014] border border-gray-800 rounded-xl p-1 pr-2 focus-within:border-cyan-500 transition-all">
          <input 
            type="text" 
            className="w-full bg-transparent p-3 text-sm focus:outline-none" 
            placeholder={t("Instruct the Master Brain...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input.length === 0 ? (
             <button className="p-2 text-violet-400 hover:text-white transition-colors"><Mic size={20} /></button>
          ) : (
             <button className="p-2 bg-cyan-500 rounded-lg text-black hover:bg-cyan-400 transition-colors"><Send size={18} /></button>
          )}
        </div>
      </div>
    </div>
  );
}
