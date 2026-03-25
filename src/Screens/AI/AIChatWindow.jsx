// File: src/screens/AI/AIChatWindow.jsx
import React, { useState } from 'react';
import { ArrowLeft, Mic, Send, Paperclip, Download, BrainCircuit } from 'lucide-react';

export default function AIChatWindow({ onBack }) {
  const [msg, setMsg] = useState('');

  return (
    <div className="h-full bg-[#0a1014] flex flex-col absolute top-0 w-full z-30">
      {/* Header */}
      <div className="p-4 bg-gray-900 flex items-center space-x-3 border-b border-gray-800">
        <ArrowLeft onClick={onBack} className="text-gray-400 cursor-pointer hover:text-white" />
        <BrainCircuit className="text-blue-500" />
        <div>
          <h4 className="font-bold text-white">Master AI Chatbot</h4>
          <p className="text-xs text-green-500">Premium Power Active</p>
        </div>
      </div>

      {/* AI Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
         <div className="bg-gray-800 text-white p-3 rounded-xl max-w-[80%] self-start text-sm border border-gray-700">
           Hello! I am TriNetra Master AI. Upload a PDF, send a voice note, or ask me anything.
         </div>
         {/* Mock Generated File */}
         <div className="bg-gray-800 text-white p-3 rounded-xl max-w-[80%] self-start text-sm border border-green-900/50">
           <p className="mb-2">Here is the image you asked for:</p>
           <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center mb-2">Generated_Image.png</div>
           <button className="flex items-center text-green-500 font-bold text-xs"><Download size={14} className="mr-1"/> Download to Device</button>
         </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-gray-900 flex items-center space-x-2">
        <Paperclip className="text-gray-400 cursor-pointer hover:text-white" />
        <div className="flex-1 bg-gray-800 rounded-full flex items-center px-4 py-2">
           <input type="text" placeholder="Text, PDF, Photo, Voice..." value={msg} onChange={(e)=>setMsg(e.target.value)} className="bg-transparent outline-none text-white w-full text-sm" />
        </div>
        {msg ? <Send className="text-green-500 cursor-pointer" /> : <Mic className="text-green-500 cursor-pointer" />}
      </div>
    </div>
  );
}
