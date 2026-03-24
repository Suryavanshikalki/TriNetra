import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, PlaySquare, MessageCircle, Wallet, Send, Sparkles, Zap, X, Cpu, Heart, 
  MessageSquare, Camera, Image, Paperclip, Mic, Phone, Video, Download, Play, 
  UserPlus, ShieldCheck, Search, Users, Trash2, CheckDone
} from 'https://esm.sh/lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [agentCredits, setAgentCredits] = useState(20);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Friend_X', text: 'Hey, did you see the new AI feature?', type: 'text', time: '10:00 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiMessages, setAiMessages] = useState([{ role: 'ai', text: 'TriNetra Engine Online 👁️🔥' }]);
  const [aiInput, setAiInput] = useState('');

  // === MESSENGER LOGIC (Real Function) ===
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Me',
      text: chatInput,
      type: 'text',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setChatInput('');

    // Backend को मैसेज भेजना (Render Server)
    try {
      await fetch('https://trinetra-umys.onrender.com/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'User_1', message: chatInput })
      });
    } catch (e) { console.error("Sync Error"); }
  };

  // === AI & MULTIMEDIA UPLOAD ===
  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const newMsgs = [...aiMessages, { role: 'user', text: aiInput }];
    setAiMessages(newMsgs);
    setAiInput('');

    const res = await fetch('https://trinetra-umys.onrender.com/api/trinetra-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: aiInput, credits: agentCredits })
    }).then(t => t.json());

    setAiMessages([...newMsgs, { role: 'ai', text: res.reply, fileUrl: res.fileUrl }]);
    setAgentCredits(prev => prev - 1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 z-10">
        <h1 className="text-xl font-black text-green-500 tracking-tighter uppercase">{activeTab}</h1>
        <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
          <Zap className="w-3 h-3 text-yellow-500 mr-2" />
          <span className="text-[10px] font-bold">{agentCredits} CR</span>
        </div>
      </header>

      {/* MAIN VIEW */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        
        {/* MESSENGER TAB (The New Feature) */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full bg-black">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${m.sender === 'Me' ? 'bg-green-600 rounded-tr-none' : 'bg-gray-800 rounded-tl-none'}`}>
                    {m.text}
                    <div className="text-[8px] mt-1 opacity-50">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Messenger Input */}
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center space-x-2">
              <Paperclip className="w-5 h-5 text-gray-500 cursor-pointer" />
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 bg-gray-800 px-4 py-2 rounded-xl outline-none text-sm" placeholder="Message follower..." />
              <button onClick={sendMessage} className="p-2 bg-green-600 rounded-xl"><Send className="w-5 h-5"/></button>
            </div>
          </div>
        )}

        {/* AI MASTER TAB */}
        {activeTab === 'ai' && (
          <div className="flex flex-col h-full bg-gray-950">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiMessages.map((m, i) => (
                <div key={i} className={`p-4 rounded-3xl max-w-[90%] text-sm ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-900 border border-gray-800'}`}>
                  {m.text}
                  {m.fileUrl && (
                    <div className="mt-2 p-2 bg-black/50 rounded-lg flex items-center justify-between border border-white/10">
                      <span className="text-[10px]">AI_Generated_File</span>
                      <a href={`https://trinetra-umys.onrender.com${m.fileUrl}`} download className="p-1 bg-green-500 rounded"><Download className="w-4 h-4"/></a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-900 flex flex-col space-y-2">
              <div className="flex space-x-4 px-2 mb-1">
                <Camera className="w-5 h-5 text-gray-400"/><Image className="w-5 h-5 text-gray-400"/><Mic className="w-5 h-5 text-gray-400"/>
              </div>
              <div className="flex bg-gray-800 p-2 rounded-2xl">
                <input type="text" value={aiInput} onChange={(e)=>setAiInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&handleAiSend()} className="flex-1 bg-transparent px-4 py-2 outline-none text-sm" placeholder="Ask AI (PDF/Media)..." />
                <button onClick={handleAiSend} className="p-2 bg-green-600 rounded-xl"><Send className="w-5 h-5"/></button>
              </div>
            </div>
          </div>
        )}

        {/* HOME & REELS (Safe and Sound) */}
        {activeTab === 'home' && <div className="p-10 text-center text-gray-700 italic">Home Feed Online 👁️🔥</div>}
        {activeTab === 'reels' && <div className="h-full bg-black flex items-center justify-center italic text-gray-500">Reels Player Active</div>}

      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around py-3 pb-6 z-50">
        <button onClick={()=>setActiveTab('home')} className={activeTab==='home'?'text-green-500':'text-gray-500'}><Home/></button>
        <button onClick={()=>setActiveTab('reels')} className={activeTab==='reels'?'text-green-500':'text-gray-500'}><PlaySquare/></button>
        <button onClick={()=>setActiveTab('ai')} className={activeTab==='ai'?'text-green-500 drop-shadow-[0_0_8px_green]':'text-gray-500'}><Sparkles/></button>
        <button onClick={()=>setActiveTab('chat')} className={activeTab==='chat'?'text-green-500':'text-gray-500'}><MessageCircle/></button>
        <button onClick={()=>setActiveTab('wallet')} className={activeTab==='wallet'?'text-green-500':'text-gray-500'}><Wallet/></button>
      </nav>

    </div>
  );
}
