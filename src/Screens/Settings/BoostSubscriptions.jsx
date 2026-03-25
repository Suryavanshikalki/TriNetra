// File: src/screens/Settings/BoostSubscriptions.jsx
import React from 'react';
import { Sparkles, TrendingUp, CreditCard, Globe } from 'lucide-react';

export default function BoostSubscriptions() {
  const handlePayment = (method, amount) => {
    if(method === 'Stripe') return alert("Stripe is on Standby. Coming soon!");
    alert(`Processing ₹${amount} via ${method}...`);
  };

  return (
    <div className="h-full bg-[#0a1014] text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Boost & AI Plans</h2>
      
      {/* Monetization / Boost Plan */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 mb-6">
         <div className="flex items-center space-x-2 mb-4"><TrendingUp className="text-yellow-500"/><h3 className="font-bold">Paid Boost + Monetize</h3></div>
         <p className="text-xs text-gray-400 mb-4">Keep 100% of your Ad Revenue & reach millions.</p>
         
         {/* Updated Buttons with Payment Options */}
         <div className="space-y-4 text-sm">
             <div className="bg-gray-800 p-3 rounded-lg">
                <p className="font-bold mb-2">1 Month: ₹1,999</p>
                <div className="flex space-x-2">
                    <button onClick={() => handlePayment('Razorpay', 1999)} className="flex-1 bg-blue-600 text-white py-2 rounded text-xs font-bold flex justify-center items-center"><CreditCard size={14} className="mr-1"/> Razorpay (UPI)</button>
                    <button onClick={() => handlePayment('PayPal', 1999)} className="flex-1 bg-yellow-500 text-black py-2 rounded text-xs font-bold flex justify-center items-center"><Globe size={14} className="mr-1"/> PayPal (Global)</button>
                    <button onClick={() => handlePayment('Stripe', 1999)} className="flex-1 bg-purple-600 text-white py-2 rounded text-xs font-bold flex justify-center items-center opacity-50">Stripe</button>
                </div>
             </div>
         </div>
      </div>

      {/* AI Plans */}
      <div className="bg-gray-900 rounded-xl p-5 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
         <div className="flex items-center space-x-2 mb-4"><Sparkles className="text-green-500"/><h3 className="font-bold">Agentic AI (OS Builder)</h3></div>
         <p className="text-xs text-gray-400 mb-4">300 Credits. Full Manus & Emergent Power.</p>
         <div className="bg-gray-800 p-3 rounded-lg text-sm">
             <p className="font-bold mb-2">1 Month: ₹5,999</p>
             <div className="flex space-x-2">
                 <button onClick={() => handlePayment('Razorpay', 5999)} className="flex-1 bg-green-600 text-black py-2 rounded text-xs font-bold">Razorpay</button>
                 <button onClick={() => handlePayment('PayPal', 5999)} className="flex-1 bg-yellow-500 text-black py-2 rounded text-xs font-bold">PayPal</button>
             </div>
         </div>
      </div>
    </div>
  );
}
