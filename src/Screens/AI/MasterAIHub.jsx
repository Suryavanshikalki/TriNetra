// File: src/screens/AI/MasterAIHub.jsx
import React from 'react';
import { Sparkles, Code, Terminal, BrainCircuit } from 'lucide-react';

export default function MasterAIHub() {
  return (
    <div className="p-4 h-full bg-[#0a1014] text-white pb-24 overflow-y-auto">
      <div className="flex flex-col items-center justify-center pt-10 pb-6 border-b border-gray-800">
        <Sparkles className="w-20 h-20 text-green-500 shadow-[0_0_20px_green] rounded-full p-2 mb-4" />
        <h2 className="text-3xl font-black">TriNetra Master AI</h2>
        <p className="text-gray-400 text-sm mt-2 text-center">Powered by 6 core brains.<br/>No manual switching needed.</p>
      </div>

      <div className="mt-8 space-y-4">
        {/* Mode A: Chatbot */}
        <div className="bg-gray-900 border border-gray-700 p-5 rounded-2xl cursor-pointer hover:border-green-500 transition">
          <div className="flex items-center space-x-3 mb-2">
             <BrainCircuit className="text-blue-400"/>
             <h3 className="text-lg font-bold">Chatbot Mode</h3>
          </div>
          <p className="text-sm text-gray-500">General knowledge, writing, math, and daily tasks (Meta/GPT/Gemini Level).</p>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400 mt-3 inline-block">8 Free Daily Messages Left</span>
        </div>

        {/* Mode B: Agentic OS Builder */}
        <div className="bg-gray-900 border border-yellow-500/50 p-5 rounded-2xl cursor-pointer hover:border-yellow-500 transition shadow-[0_0_15px_rgba(234,179,8,0.1)]">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center space-x-3">
                <Terminal className="text-yellow-500"/>
                <h3 className="text-lg font-bold text-yellow-500">Agentic AI & OS Builder</h3>
             </div>
             <span className="text-xs bg-yellow-900/50 text-yellow-500 px-2 py-1 rounded font-bold">PRO</span>
          </div>
          <p className="text-sm text-gray-400">Write code, build apps, push to GitHub, or build a complete Operating System (Manus/Emergent Level).</p>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400 mt-3 inline-block">20 Free Credits Available</span>
        </div>
      </div>
    </div>
  );
}
