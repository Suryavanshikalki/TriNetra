// File: src/screens/AI/OSBuilderWorkspace.jsx
import React from 'react';
import { Terminal, Github, Play, ArrowLeft } from 'lucide-react';

export default function OSBuilderWorkspace({ onBack }) {
  return (
    <div className="h-full bg-black flex flex-col absolute top-0 w-full z-30 font-mono">
      <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-3">
            <ArrowLeft onClick={onBack} className="text-gray-400 cursor-pointer" />
            <Terminal className="text-yellow-500" />
            <h4 className="font-bold text-yellow-500">Agentic OS Workspace</h4>
        </div>
        <button className="flex items-center text-xs bg-gray-800 px-3 py-1 rounded text-white"><Github size={14} className="mr-2"/> Connected</button>
      </div>

      <div className="flex-1 p-4 bg-[#0d1117] text-green-400 overflow-y-auto text-sm space-y-2">
        <p>{">"} TriNetra Agentic AI Initialized...</p>
        <p>{">"} Waiting for prompt or code file to start building...</p>
      </div>

      <div className="p-3 bg-gray-900 flex items-center space-x-2">
        <input type="text" placeholder="Prompt: Build a custom OS kernel..." className="flex-1 bg-gray-800 rounded border border-gray-700 px-4 py-3 outline-none text-white text-sm" />
        <button className="bg-yellow-600 hover:bg-yellow-500 text-black p-3 rounded font-bold flex items-center"><Play size={16} className="mr-2"/> Execute</button>
      </div>
    </div>
  );
}
