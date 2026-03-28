// File: src/screens/AI/MasterAIHub.jsx
import React from 'react';
import { Sparkles, Code, Terminal, BrainCircuit, Cpu, Zap, ShieldAlert, Globe } from 'lucide-react';

export default function MasterAIHub() {
  const handleRecharge = (plan) => {
    alert(`Redirecting to TriNetra Secure Gateway for: ${plan}`);
  };

  return (
    <div className="p-4 h-full bg-[#0a1014] text-white pb-24 overflow-y-auto">
      {/* 👁️🔥 Header: The 6-in-1 Brain */}
      <div className="flex flex-col items-center justify-center pt-10 pb-6 border-b border-gray-800">
        <div className="relative">
            <Sparkles className="w-20 h-20 text-cyan-400 shadow-[0_0_30px_rgba(0,230,255,0.4)] rounded-full p-2 mb-4" />
            <Cpu className="absolute -bottom-1 -right-1 text-white w-8 h-8 bg-cyan-600 rounded-full p-1.5 border-2 border-[#0a1014]" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter">TriNetra Master AI</h2>
        <p className="text-gray-400 text-xs mt-2 text-center uppercase tracking-widest px-6">
          Meta • ChatGPT • Gemini • DeepSeek • Manus • Emergent <br/>
          <span className="text-cyan-500 font-bold">Auto-Switching Intelligence</span>
        </p>
      </div>

      {/* 🚨 Strict Rule: No Discount for AI */}
      <div className="mt-4 bg-red-900/20 border border-red-500/30 p-2 rounded-lg flex items-center justify-center gap-2">
        <ShieldAlert size={14} className="text-red-500" />
        <span className="text-[10px] font-bold text-red-400 uppercase">Note: No discounts applicable on AI Tiers</span>
      </div>

      <div className="mt-8 space-y-6">
        
        {/* 🧠 Mode A: Chatbot (Point 11 - Mode A) */}
        <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center space-x-3">
                <BrainCircuit className="text-blue-400"/>
                <h3 className="text-lg font-bold">Mode A: Chatbot</h3>
             </div>
             <span className="text-[10px] bg-blue-900/50 text-blue-400 px-2 py-1 rounded font-black">UNLIMITED OPTION</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">General knowledge, writing, math, and daily tasks. Meta/GPT/Gemini Level intelligence.</p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-black/40 p-2 rounded-xl border border-gray-800">
                <p className="text-[10px] text-gray-500">Free Premium</p>
                <p className="text-xs font-bold text-white">8 Daily Messages</p>
            </div>
            <div className="bg-black/40 p-2 rounded-xl border border-gray-800">
                <p className="text-[10px] text-gray-500">Free Lifetime</p>
                <p className="text-xs font-bold text-white">Basic Meta AI Level</p>
            </div>
          </div>

          <button 
            onClick={() => handleRecharge('Chatbot Paid')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-black text-sm flex justify-between px-5 items-center transition-all"
          >
            <span>ACTIVATE PAID PLAN</span>
            <span>₹2,000/mo</span>
          </button>
        </div>

        {/* 🚀 Mode B: Agentic AI (Point 11 - Mode B) */}
        <div className="bg-gray-900/50 border border-yellow-500/30 p-5 rounded-3xl relative group hover:border-yellow-500/50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center space-x-3">
                <Terminal className="text-yellow-500"/>
                <h3 className="text-lg font-bold text-yellow-500">Mode B: Agentic AI</h3>
             </div>
             <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                <Zap size={12} className="text-yellow-500"/> 500 CREDITS
             </div>
          </div>
          <p className="text-sm text-gray-400 mb-6">Autonomous agents for complex tasks, app building, and GitHub integration. Manus/Emergent Level.</p>
          
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[10px] bg-gray-800 px-3 py-1 rounded-full text-gray-400 border border-gray-700">20 Free Credits Available (One-time)</span>
          </div>

          <button 
            onClick={() => handleRecharge('Agentic Paid')}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-2xl font-black text-sm flex justify-between px-5 items-center transition-all"
          >
            <span>RECHARGE STANDARD</span>
            <span>₹3,999/mo</span>
          </button>
        </div>

        {/* 🚨 THE ULTIMATE: OS CREATION TIER (Point 11 - Special Tier) */}
        <div className="bg-gradient-to-br from-green-900/20 to-black border-2 border-green-500 p-6 rounded-3xl relative shadow-[0_0_25px_rgba(34,197,94,0.2)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] px-4 py-1 rounded-full font-black uppercase">Most Powerful</div>
          
          <div className="flex items-center justify-between mb-4 mt-2">
             <div className="flex items-center space-x-3">
                <Code className="text-green-500 w-8 h-8"/>
                <div>
                    <h3 className="text-xl font-black text-white">OS CREATION TIER</h3>
                    <p className="text-[10px] text-green-500 font-bold uppercase">2500 Premium Credits Included</p>
                </div>
             </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-6 font-medium">The ultimate tier to build entire Operating Systems (OS) and push production-ready code to servers.</p>
          
          <button 
            onClick={() => handleRecharge('OS Creation Tier')}
            className="w-full bg-green-500 hover:bg-green-400 text-black py-4 rounded-2xl font-black text-lg flex justify-between px-6 items-center shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-95"
          >
            <span>ACTIVATE TIER</span>
            <span>₹69,999/mo</span>
          </button>
        </div>

        {/* 🌐 Global Features (Point 13: Multilanguage/Translate) */}
        <div className="bg-gray-900/30 border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Globe size={18} className="text-cyan-500" />
                <span className="text-xs font-bold text-gray-400 uppercase">Universal Translation Active</span>
            </div>
            <span className="text-[10px] text-cyan-500 font-black">AUTO-ON</span>
        </div>
      </div>

      <p className="text-[9px] text-gray-700 mt-10 text-center uppercase font-bold tracking-widest">
        TriNetra AI Security Hub • All payments encrypted
      </p>
    </div>
  );
}
