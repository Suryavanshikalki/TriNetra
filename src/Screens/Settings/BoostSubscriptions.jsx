// File: src/screens/Settings/BoostSubscriptions.jsx
import React, { useState } from 'react';
import { Sparkles, TrendingUp, CreditCard, Globe, Gavel, Rocket, Brain, ShieldCheck } from 'lucide-react';

export default function BoostSubscriptions() {
  const [selectedMonths, setSelectedMonths] = useState(1);

  // 👁️🔥 TriNetra Official Price List
  const prices = {
    escalation: 20000,
    freeBoost: 0,
    paidBoost: 5000,
    paidMonetize: 7500,
    proAutoBoost: 15000,
    aiChatbot: 2000,
    aiAgentic: 3999,
    osCreation: 69999
  };

  const calculateTotal = (basePrice, isAi = false) => {
    let total = basePrice * selectedMonths;
    // Rule: 20% Discount on 6 & 12 months (NOT for AI)
    if (!isAi && (selectedMonths === 6 || selectedMonths === 12)) {
      total = total * 0.8; 
    }
    return total.toLocaleString('en-IN');
  };

  const handlePayment = (planName, method, amount) => {
    if(method === 'Stripe') return alert("Stripe is on Standby. Coming soon!");
    alert(`TriNetra Secure Payment: Processing ₹${amount} for ${planName} (${selectedMonths} Month) via ${method}`);
  };

  const MonthSelector = () => (
    <div className="flex justify-between bg-gray-800 p-2 rounded-lg mb-6 border border-gray-700">
      {[1, 3, 6, 9, 12].map((m) => (
        <button 
          key={m}
          onClick={() => setSelectedMonths(m)}
          className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${selectedMonths === m ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-gray-400'}`}
        >
          {m}M { (m === 6 || m === 12) && <span className="text-[8px] block text-red-400">-20%</span> }
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-[#0a1014] text-white p-4 overflow-y-auto pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-cyan-400" /> TriNetra Premium Hub
        </h2>
      </div>
      <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest">Select duration & upgrade your experience</p>

      {/* 📅 Duration Selector */}
      <label className="text-xs text-gray-400 mb-2 block font-semibold">Subscription Duration:</label>
      <MonthSelector />

      {/* 🚨 1. AUTO-ESCALATION (Justice System) */}
      <div className="bg-gray-900 rounded-xl p-5 border border-red-500/30 mb-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 bg-red-500 text-[10px] px-3 py-1 font-bold">VIP JUSTICE</div>
         <div className="flex items-center space-x-2 mb-2"><Gavel size={20} className="text-red-500"/><h3 className="font-bold text-lg">Auto-Escalation</h3></div>
         <p className="text-xs text-gray-400 mb-4">Direct chain of command to PM & Supreme Court. Solve any issue automatically.</p>
         <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] text-gray-500 line-through">₹{(prices.escalation * selectedMonths).toLocaleString()}</p>
                <p className="text-2xl font-black text-white">₹{calculateTotal(prices.escalation)}</p>
            </div>
            <div className="flex space-x-2">
                <button onClick={() => handlePayment('Auto-Escalation', 'Razorpay', calculateTotal(prices.escalation))} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs">PayU / UPI</button>
            </div>
         </div>
      </div>

      {/* 🚀 2. BOOST & MONETIZATION (Section 7, 8, 9, 10) */}
      <h4 className="text-sm font-bold text-yellow-500 mb-4 uppercase tracking-wider">Growth & Revenue Models</h4>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {/* Pro Auto-Boost */}
        <div className="bg-gray-900 rounded-xl p-4 border border-yellow-500/30">
            <div className="flex justify-between mb-3">
                <div className="flex items-center gap-2"><Rocket size={16} className="text-yellow-500"/> <span className="font-bold text-sm">Pro Auto-Boost</span></div>
                <span className="text-[10px] font-bold text-yellow-500">70/30 SPLIT</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Automated follower search for Politics/Marketing.</p>
            <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₹{calculateTotal(prices.proAutoBoost)}</span>
                <button onClick={() => handlePayment('Pro Auto-Boost', 'Razorpay', calculateTotal(prices.proAutoBoost))} className="bg-yellow-500 text-black px-4 py-1.5 rounded text-xs font-bold">Subscribe</button>
            </div>
        </div>

        {/* Paid Boost + Monetize */}
        <div className="bg-gray-900 rounded-xl p-4 border border-blue-500/30">
            <div className="flex justify-between mb-3">
                <div className="flex items-center gap-2"><TrendingUp size={16} className="text-blue-500"/> <span className="font-bold text-sm">Boost + Monetize</span></div>
                <span className="text-[10px] font-bold text-blue-500">100% EARNINGS</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Paid Reach + Ad Revenue. All yours.</p>
            <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₹{calculateTotal(prices.paidMonetize)}</span>
                <button onClick={() => handlePayment('Paid+Monetize', 'PayPal', calculateTotal(prices.paidMonetize))} className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold">PayPal</button>
            </div>
        </div>

        {/* Paid Boost (No Monetization) */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between mb-3">
                <span className="font-bold text-sm text-gray-300">Paid Boost</span>
                <span className="text-[10px] font-bold text-gray-400">25/75 SPLIT</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-300">₹{calculateTotal(prices.paidBoost)}</span>
                <button onClick={() => handlePayment('Paid Boost', 'Razorpay', calculateTotal(prices.paidBoost))} className="border border-gray-600 px-4 py-1.5 rounded text-xs font-bold">Pay Now</button>
            </div>
        </div>
      </div>

      {/* 🧠 3. MASTER AI (Section 11) */}
      <h4 className="text-sm font-bold text-green-500 mb-4 uppercase tracking-wider">Master AI Tiers (No Discount)</h4>
      
      <div className="space-y-4">
          {/* OS Creation Tier */}
          <div className="bg-black rounded-xl p-5 border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2"><Brain className="text-green-500"/><h3 className="font-black text-green-500">OS CREATION TIER</h3></div>
                <span className="bg-green-500 text-black text-[9px] px-2 py-0.5 rounded font-bold">2500 CREDITS</span>
             </div>
             <p className="text-xs text-gray-400 mb-4">Ultimate power to build your own Operating System & Custom AI Models.</p>
             <div className="flex justify-between items-center">
                <p className="text-2xl font-black">₹{calculateTotal(prices.osCreation, true)}</p>
                <div className="flex gap-2">
                    <button onClick={() => handlePayment('OS Tier', 'Razorpay', calculateTotal(prices.osCreation, true))} className="bg-green-600 text-black px-4 py-2 rounded-lg font-bold text-xs">Buy Now</button>
                </div>
             </div>
          </div>

          {/* Agentic AI */}
          <div className="bg-gray-900 rounded-xl p-4 border border-green-900">
             <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm text-green-400">Agentic AI (Standard)</span>
                <span className="text-[10px] font-bold text-gray-400">500 CREDITS</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">₹{calculateTotal(prices.aiAgentic, true)}</span>
                <button onClick={() => handlePayment('Agentic AI', 'PayPal', calculateTotal(prices.aiAgentic, true))} className="bg-gray-800 text-green-500 border border-green-900 px-4 py-1.5 rounded text-xs font-bold">Recharge</button>
             </div>
          </div>

          {/* Chatbot AI */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
             <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm text-gray-300">Chatbot AI (Paid)</span>
                <span className="text-[10px] font-bold text-gray-400">UNLIMITED</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">₹{calculateTotal(prices.aiChatbot, true)}</span>
                <button onClick={() => handlePayment('Chatbot AI', 'Razorpay', calculateTotal(prices.aiChatbot, true))} className="bg-gray-800 text-white border border-gray-700 px-4 py-1.5 rounded text-xs font-bold">Activate</button>
             </div>
          </div>
      </div>
      
      <p className="text-[9px] text-gray-600 mt-10 text-center italic">All payments are secured by TriNetra 19-Key Master Encryption.</p>
    </div>
  );
}
