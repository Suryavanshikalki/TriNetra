import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, PlaySquare, MessageCircle, Wallet, Send, Sparkles, Zap, X, Cpu, Heart, 
  MessageSquare, LogIn, Github, Mail, Smartphone, Camera, Image, Paperclip, 
  Mic, Phone, Video, UserPlus, ShieldAlert, Search, Users, Flag, Download, 
  Play, Pause, Headphones, FileText, LifeBuoy, Settings 
} from 'https://esm.sh/lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [agentCredits, setAgentCredits] = useState(20);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([{ role: 'ai', text: 'TriNetra Universal AI Online 👁️🔥\nAll 15 Keys Active. Upload any file (PDF/Image/Audio) to begin.' }]);
  const [showProModal, setShowProModal] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // --- FILE UPLOAD & AI LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAiMessages([...aiMessages, { role: 'user', text: `Uploading: ${file.name}...` }]);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', "Analyze this file");
    formData.append('credits', agentCredits);

    try {
      const res = await fetch('https://trinetra-umys.onrender.com/api/trinetra-ai', {
        method: 'POST',
        body: formData
      }).then(t => t.json());
      
      setAiMessages(prev => [...prev, { role: 'ai', text: res.reply, fileUrl: res.fileUrl }]);
      setAgentCredits(prev => prev - 1);
    } catch (err) { alert("Server Error"); }
  };

  // --- REAL RAZORPAY PAYMENT ---
  const handlePayment = async (amount, newCredits) => {
    const res = await fetch('https://trinetra-umys.onrender.com/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    }).then(t => t.json());

    const options = {
      key: "rzp_test_your_id", 
      amount: res.amount,
      order_id: res.id,
      name: "TriNetra Super App",
      handler: (resp) => { setAgentCredits(prev => prev + newCredits); setShowProModal(false); },
      theme: { color: "#22c55e" }
    };
    new window.Razorpay(options).open();
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="relative mb-8"><Cpu className="w-20 h-20 text-green-500 animate-pulse"/><div className="absolute -top-2 -right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-[10px]">V2</div></div>
        <h1 className="text-4xl font-bold mb-2 tracking-tighter text-green-500">TriNetra</h1>
        <p className="text-gray-500 mb-10 text-sm italic">Universal Social AI Ecosystem</p>
        <div className="w-full max-w-sm space-y-3">
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-white text-black p-4 rounded-2xl font-bold flex items-center justify-center transition hover:bg-gray-200"><Mail className="mr-2"/> Google / Apple / Microsoft</button>
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-blue-600 p-4 rounded-2xl font-bold flex items-center justify-center"><Github className="mr-2"/> GitHub Developer Login</button>
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-green-600 p-4 rounded-2xl font-bold flex items-center justify-center"><Smartphone className="mr-2"/> Phone OTP Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 z-10 shadow-lg">
        <div className="flex items-center space-x-2">
          <Cpu className="text-green-500 w-6 h-6"/>
          <h1 className="text-xl font-black text-green-500 uppercase tracking-widest">{activeTab}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <Zap className="w-3 h-3 text-yellow-500 mr-2" />
            <span className="text-[10px] font-bold">{agentCredits} CR</span>
          </div>
          <button onClick={() => setShowSupport(true)} className="text-gray-400 hover:text-green-500"><LifeBuoy className="w-5 h-5"/></button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-24 relative bg-black">
        
        {activeTab === 'home' && (
          <div className="p-4 space-y-6">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {[1,2,3,4].map(i => <div key={i} className="min-w-[70px] h-[70px] rounded-full border-2 border-green-500 p-1"><div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-[10px]">Story {i}</div></div>)}
            </div>
            {[1,2].map(post => (
              <div key={post} className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2"><div className="w-8 h-8 rounded-full bg-green-900" /><span className="text-xs font-bold">TriNetra User_{post}</span></div>
                  <button className="text-[10px] bg-green-600 px-2 py-1 rounded-lg">Follow</button>
                </div>
                <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-500">Post Media Content</div>
                <div className="p-4 flex space-x-4"><Heart className="w-5 h-5"/><MessageSquare className="w-5 h-5"/><Send className="w-5 h-5"/></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="h-full bg-black flex flex-col items-center justify-center relative">
            <div className="w-full h-full flex flex-col justify-center items-center">
               <Play className="w-20 h-20 text-white/20" />
               <p className="text-xs text-gray-600">Reels Engine Active. Swipe Up.</p>
            </div>
            <div className="absolute right-4 bottom-28 flex flex-col space-y-6 items-center">
              <div className="flex flex-col items-center"><Heart className="w-8 h-8 text-white"/><span className="text-[10px]">1.2M</span></div>
              <div className="flex flex-col items-center"><MessageSquare className="w-8 h-8 text-white"/><span className="text-[10px]">45K</span></div>
              <Send className="w-8 h-8 text-white"/>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="h-full flex flex-col bg-gray-950">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-3xl max-w-[90%] text-sm ${m.role === 'user' ? 'bg-green-600 rounded-tr-sm' : 'bg-gray-900 border border-gray-800 rounded-tl-sm shadow-xl'}`}>
                    {m.text}
                    {m.fileUrl && (
                      <div className="mt-3 p-2 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                         <span className="text-[10px] truncate w-24">Media_File</span>
                         <a href={`https://trinetra-umys.onrender.com${m.fileUrl}`} download className="p-1 bg-green-500 rounded"><Download className="w-3 h-3"/></a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex flex-col space-y-2">
              <div className="flex space-x-4 px-2">
                <label className="cursor-pointer text-gray-400 hover:text-green-500"><Camera className="w-5 h-5"/><input type="file" className="hidden" onChange={handleFileUpload}/></label>
                <label className="cursor-pointer text-gray-400 hover:text-green-500"><Image className="w-5 h-5"/><input type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/></label>
                <label className="cursor-pointer text-gray-400 hover:text-green-500"><Paperclip className="w-5 h-5"/><input type="file" className="hidden" onChange={handleFileUpload}/></label>
                <Mic className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer"/>
              </div>
              <div className="flex bg-gray-800 p-2 rounded-2xl border border-gray-700">
                <input type="text" value={aiInput} onChange={(e)=>setAiInput(e.target.value)} className="flex-1 bg-transparent px-4 py-2 outline-none text-sm" placeholder="AI, analyze or create..." />
                <button onClick={() => {}} className="p-2 bg-green-600 rounded-xl"><Send className="w-5 h-5"/></button>
              </div>
            </div>
          </div>
        )}

        {/* HELPLINE / SUPPORT MODAL */}
        {showSupport && (
          <div className="absolute inset-0 bg-black/95 z-[200] flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between">
              <span className="font-bold">Payment & Tech Help</span>
              <X className="cursor-pointer" onClick={()=>setShowSupport(false)}/>
            </div>
            <div className="flex-1 p-6 text-center">
              <LifeBuoy className="w-20 h-20 text-green-500 mx-auto mb-4"/>
              <p className="text-sm text-gray-400 mb-6">पेमेंट फेल होने या किसी भी तकनीकी दिक्कत के लिए यहाँ मैसेज करें।</p>
              <textarea className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm outline-none" placeholder="Describe your issue..."></textarea>
              <button className="w-full mt-4 bg-green-600 py-3 rounded-xl font-bold">Start Live Chat</button>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 flex justify-around py-3 pb-6 z-50">
        <button onClick={()=>setActiveTab('home')} className={activeTab==='home'?'text-green-500':'text-gray-500'}><Home className="w-6 h-6"/></button>
        <button onClick={()=>setActiveTab('reels')} className={activeTab==='reels'?'text-green-500':'text-gray-500'}><PlaySquare className="w-6 h-6"/></button>
        <button onClick={()=>setActiveTab('ai')} className={activeTab==='ai'?'text-green-500 drop-shadow-[0_0_8px_green]':'text-gray-500'}><Sparkles className="w-6 h-6"/></button>
        <button onClick={()=>setActiveTab('chat')} className={activeTab==='chat'?'text-green-500':'text-gray-500'}><MessageCircle className="w-6 h-6"/></button>
        <button onClick={()=>setActiveTab('wallet')} className={activeTab==='wallet'?'text-green-500':'text-gray-500'}><Wallet className="w-6 h-6"/></button>
      </nav>

    </div>
  );
}
