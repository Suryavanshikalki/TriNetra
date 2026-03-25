// File: src/screens/Settings/BoostSubscriptions.jsx
import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function BoostSubscriptions() {
  return (
    <div className="h-full bg-[#0a1014] text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Boost & AI Plans</h2>
      
      {/* Monetization / Boost Plan */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-6">
         <div className="flex items-center space-x-2 mb-4"><TrendingUp className="text-yellow-500"/><h3 className="font-bold">Paid Boost + Monetize</h3></div>
         <p className="text-xs text-gray-400 mb-4">Keep 100% of your Ad Revenue & reach millions.</p>
         <div className="grid grid-cols-2 gap-2 text-sm">
             <button className="bg-gray-800 py-2 rounded font-bold hover:border hover:border-yellow-500">1 Mo: ₹1,999</button>
             <button className="bg-gray-800 py-2 rounded font-bold hover:border hover:border-yellow-500">3 Mo: ₹5,499</button>
             <button className="bg-gray-800 py-2 rounded font-bold hover:border hover:border-yellow-500">6 Mo: ₹9,999</button>
             <button className="bg-gray-800 py-2 rounded font-bold hover:border hover:border-yellow-500">12 Mo: ₹18,999</button>
         </div>
      </div>

      {/* AI Plans */}
      <div className="bg-gray-900 rounded-xl p-5 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
         <div className="flex items-center space-x-2 mb-4"><Sparkles className="text-green-500"/><h3 className="font-bold">Agentic AI (OS Builder)</h3></div>
         <p className="text-xs text-gray-400 mb-4">300 Credits. Full Manus & Emergent Power.</p>
         <div className="grid grid-cols-2 gap-2 text-sm">
             <button className="bg-gray-800 py-2 rounded font-bold hover:bg-green-600 hover:text-black transition">1 Mo: ₹5,999</button>
             <button className="bg-gray-800 py-2 rounded font-bold hover:bg-green-600 hover:text-black transition">6 Mo: ₹31,999</button>
             <button className="col-span-2 bg-gray-800 py-2 rounded font-bold hover:bg-green-600 hover:text-black transition">12 Mo: ₹59,999</button>
         </div>
      </div>
    </div>
  );
}
