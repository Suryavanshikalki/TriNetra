import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, MessageCircle, Wallet, Send, Sparkles, Zap, X, Cpu, Heart, MessageSquare, Smartphone, Monitor } from 'https://esm.sh/lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [aiMainMode, setAiMainMode] = useState('chatbot'); 
  const [aiSubMode, setAiSubMode] = useState('master'); 
  const [agentCredits, setAgentCredits] = useState(20); // 20 Free Credits
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([{ role: 'ai', text: 'TriNetra Engine Online 👁️🔥\nAgent Credits: 20 Free Available.' }]);
  const [showProModal, setShowProModal] = useState(false);

  // --- REAL RAZORPAY PAYMENT ---
  const handlePayment = async (amount, newCredits) => {
    const res = await fetch('https://trinetra-umys.onrender.com/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    }).then(t => t.json());

    const options = {
      key: "rzp_test_your_id", // Render Env से आपकी Key आएगी
      amount: res.amount,
      currency: res.currency,
      name: "TriNetra Pro Recharge",
      order_id: res.id,
      handler: function (response) {
        setAgentCredits(prev => prev + newCredits);
        setShowProModal(false);
        alert(`सफल! ${newCredits} क्रेडिट्स आपके खाते में जोड़ दिए गए हैं।`);
      },
      theme: { color: "#22c55e" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // --- AI SEND LOGIC ---
  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    if (aiMainMode === 'agent' && agentCredits <= 0) { setShowProModal(true); return; }

    const newMsgs = [...aiMessages, { role: 'user', text: aiInput }];
    setAiMessages(newMsgs);
    setAiInput('');

    try {
      const response = await fetch('https://trinetra-umys.onrender.com/api/trinetra-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: aiMainMode, subMode: aiSubMode, message: aiInput, credits: agentCredits })
      });
      const data = await response.json();
      setAiMessages([...newMsgs, { role: 'ai', text: data.reply }]);
      if (aiMainMode === 'agent') setAgentCredits(prev => prev - 1);
    } catch (error) {
      setAiMessages([...newMsgs, { role: 'ai', text: '⚠️ सर्वर से जुड़ने में दिक्कत हो रही है...' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 z-10">
        <h1 className="text-2xl font-bold text-green-500 tracking-wider">
          {activeTab === 'home' && 'TriNetra'}
          {activeTab === 'reels' && 'TriNetra Reels'}
          {activeTab === 'chat' && 'Secure Chat'}
          {activeTab === 'ai' && 'Master AI'}
        </h1>
        <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
          <Zap className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-xs font-bold">{agentCredits} Credits</span>
        </div>
      </header>

      {/* RECHARGE MODAL */}
      {showProModal && (
        <div className="absolute inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-gray-900 border border-green-500/50 rounded-2xl w-full max-w-md p-6 relative">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowProModal(false)} />
            <h2 className="text-xl font-bold mb-2">एजेंट क्रेडिट्स रिचार्ज</h2>
            <p className="text-xs text-gray-400 mb-6">कोटा समाप्त हो गया है। 200 क्रेडिट्स के लिए रिचार्ज करें।</p>
            <div onClick={() => handlePayment(499, 200)} className="flex justify-between p-4 bg-green-900/10 border border-green-500 rounded-xl cursor-pointer">
              <div><h3 className="font-bold text-lg">200 Credits</h3><p className="text-[10px] text-gray-400">उपयोग आधारित (Usage Based)</p></div>
              <p className="text-xl font-bold">₹499</p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        {activeTab === 'home' && (
          <div className="p-4 space-y-4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center mb-2"><div className="w-10 h-10 rounded-full bg-green-600 mr-2" /> <span className="font-bold">Admin</span></div>
              <p className="text-sm text-gray-400">TriNetra Super App Deployment Successful. 🚀</p>
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="h-full bg-black flex items-center justify-center relative">
            <div className="text-center"><PlaySquare className="w-16 h-16 text-gray-800 mb-2 mx-auto" /><p className="text-gray-500 italic text-sm">Reels Player Active</p></div>
            <div className="absolute right-4 bottom-20 flex flex-col space-y-6"><Heart /><MessageSquare /><Send /></div>
          </div>
        )}

        {activeTab === 'chat' && <div className="p-10 text-center text-gray-600 italic mt-20">Secure Chat Tunnel Online. Start messaging...</div>}

        {activeTab === 'ai' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-center p-2 bg-gray-900 space-x-2">
              <button onClick={() => {setAiMainMode('chatbot'); setAiSubMode('master');}} className={`px-4 py-1 rounded-full text-xs ${aiMainMode === 'chatbot' ? 'bg-green-600' : 'bg-gray-800'}`}>Chatbot</button>
              <button onClick={() => {setAiMainMode('agent'); setAiSubMode('general');}} className={`px-4 py-1 rounded-full text-xs ${aiMainMode === 'agent' ? 'bg-purple-600' : 'bg-gray-800'}`}>Autonomous Agent</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-gray-800' : 'bg-gray-900 border border-gray-800'}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center space-x-2">
              <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAiSend()} className="flex-1 bg-transparent px-4 py-2 outline-none text-sm" placeholder="AI को कमांड दें..." />
              <button onClick={handleAiSend} className="p-2 bg-green-600 rounded-xl"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around py-3 pb-5 z-50">
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-green-500' : 'text-gray-500'}><Home className="w-6 h-6" /></button>
        <button onClick={() => setActiveTab('reels')} className={activeTab === 'reels' ? 'text-green-500' : 'text-gray-500'}><PlaySquare className="w-6 h-6" /></button>
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'text-green-500' : 'text-gray-500'}><MessageCircle className="w-6 h-6" /></button>
        <button onClick={() => setActiveTab('ai')} className={activeTab === 'ai' ? 'text-green-500 shadow-green-500' : 'text-gray-500'}><Sparkles className="w-6 h-6" /></button>
        <button onClick={() => setActiveTab('wallet')} className={activeTab === 'wallet' ? 'text-green-500' : 'text-gray-500'}><Wallet className="w-6 h-6" /></button>
      </nav>

    </div>
  );
}
