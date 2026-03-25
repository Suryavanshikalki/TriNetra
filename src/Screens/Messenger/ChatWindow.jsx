// File: src/screens/Messenger/ChatWindow.jsx
import React, { useState } from 'react';
import { ArrowLeft, Phone, Video, Plus, Mic, Send, Paperclip } from 'lucide-react';

export default function ChatWindow({ onBack, onCall }) {
  const [msg, setMsg] = useState('');

  return (
    <div className="h-full bg-[#0a1014] flex flex-col absolute top-0 w-full z-20">
      {/* Header */}
      <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <ArrowLeft onClick={onBack} className="text-gray-400 cursor-pointer" />
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div>
            <h4 className="font-bold text-white">Aditya Pratap</h4>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <Phone onClick={() => onCall('audio')} className="text-green-500 cursor-pointer" />
          <Video onClick={() => onCall('video')} className="text-green-500 cursor-pointer" />
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
         <div className="bg-gray-800 text-white p-3 rounded-xl max-w-[75%] self-start text-sm">Pdf bhejo bhai</div>
         <div className="bg-green-700 text-white p-3 rounded-xl max-w-[75%] self-end text-sm">Haan, ye lo.</div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-gray-900 flex items-center space-x-2">
        <Plus className="text-gray-400 cursor-pointer" />
        <Paperclip className="text-gray-400 cursor-pointer" />
        <div className="flex-1 bg-gray-800 rounded-full flex items-center px-4 py-2">
           <input type="text" placeholder="Message..." value={msg} onChange={(e)=>setMsg(e.target.value)} className="bg-transparent outline-none text-white w-full text-sm" />
        </div>
        {msg ? <Send className="text-green-500 cursor-pointer" /> : <Mic className="text-green-500 cursor-pointer" />}
      </div>
    </div>
  );
}
