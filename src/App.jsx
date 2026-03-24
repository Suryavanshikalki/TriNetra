import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Wallet, Send, X, Zap, Cpu, CreditCard } from 'https://esm.sh/lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([{ role: 'ai', text: 'TriNetra Engine Online 👁️🔥 Ready for AI & Real Payments.' }]);
  const [showProModal, setShowProModal] = useState(false);

  // --- RAZORPAY PAYMENT LOGIC (Real) ---
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount) => {
    const res = await loadRazorpay();
    if (!res) { alert('Razorpay SDK failed to load. Check internet.'); return; }

    // बैकएंड से ऑर्डर आईडी मांगना
    const data = await fetch('https://trinetra-umys.onrender.com/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    }).then((t) => t.json());

    const options = {
      key: "rzp_test_your_id", // यहाँ आपकी Razorpay Key ID आएगी
      amount: data.amount,
      currency: data.currency,
      name: "TriNetra Pro",
      description: "Unlock Master AI Power",
      order_id: data.id,
      handler: function (response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
        setShowProModal(false);
      },
      theme: { color: "#22c55e" }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // --- AI LOGIC ---
  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const newMsgs = [...aiMessages, { role: 'user', text: aiInput }];
    setAiMessages(newMsgs);
    setAiInput('');

    try {
      const response = await fetch('https://trinetra-umys.onrender.com/api/trinetra-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'chatbot', message: aiInput })
      });
      const data = await response.json();
      setAiMessages([...newMsgs, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setAiMessages([...newMsgs, { role: 'ai', text: '⚠️ Connection Error: Server is waking up...' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
        <h1 className="text-2xl font-bold text-green-500">TriNetra</h1>
        <button onClick={() => setShowProModal(true)} className="bg-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg shadow-green-900/20"><Zap className="w-3 h-3 mr-1"/> Upgrade</button>
      </header>

      {showProModal && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-green-500/50 rounded-2xl w-full max-w-md p-6 relative">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowProModal(false)} />
            <h2 className="text-xl font-bold mb-4 flex items-center"><Sparkles className="mr-2 text-green-400"/> TriNetra Pro Subscription</h2>
            <div className="space-y-3 mb-6">
              <div onClick={() => handlePayment(499)} className="flex justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 cursor-pointer hover:border-green-500">
                <span>1 Month Pro (AI + Payments)</span>
                <span className="font-bold text-green-400">₹499</span>
              </div>
              <p className="text-[10px] text-gray-500 text-center">PayPal & Stripe Support Coming Soon in V2.0</p>
            </div>
            <button className="w-full text-xs text-gray-500 italic">SECURE PAYMENTS BY RAZORPAY & PAYPAL</button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-20 p-4">
        {activeTab === 'ai' ? (
          <div className="flex flex-col h-full space-y-4">
            <div className="flex-1 overflow-y-auto space-y-4">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-gray-800' : 'bg-gray-900 border border-gray-800'}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center bg-gray-900 p-2 rounded-2xl border border-gray-800">
              <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAiSend()} className="flex-1 bg-transparent px-4 py-2 outline-none text-sm" placeholder="Ask AI..." />
              <button onClick={handleAiSend} className="p-2 bg-green-600 rounded-xl"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <Cpu className="w-16 h-16 mb-2 opacity-20" />
            <p className="italic">TriNetra Home Screen Live</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around py-3">
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-green-500' : 'text-gray-500'}><Home /></button>
        <button onClick={() => setActiveTab('ai')} className={activeTab === 'ai' ? 'text-green-500' : 'text-gray-500'}><Sparkles /></button>
        <button onClick={() => setActiveTab('wallet')} className={activeTab === 'wallet' ? 'text-green-500' : 'text-gray-500'}><Wallet /></button>
      </nav>
    </div>
  );
}
