// File: src/screens/Settings/WalletAndPayouts.jsx
import React from 'react';

export default function WalletAndPayouts() {
  return (
    <div className="h-full bg-[#0a1014] text-white p-4">
      <h2 className="text-xl font-bold mb-6">Wallet & Payouts</h2>
      
      <div className="bg-gradient-to-r from-green-900 to-gray-900 rounded-2xl p-6 border border-green-500/30 mb-6">
         <p className="text-gray-300 text-sm">Total Balance</p>
         <h1 className="text-4xl font-black text-white mt-1">₹12,450.00</h1>
         <button className="bg-white text-black px-6 py-2 rounded-full font-bold mt-4 hover:bg-gray-200">Withdraw to Bank</button>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 space-y-4">
         <h3 className="font-bold text-gray-400 text-sm">TRANSACTION HISTORY</h3>
         <div className="flex justify-between border-b border-gray-800 pb-2">
             <div><p>Reel Monetization (100%)</p><p className="text-xs text-gray-500">Today</p></div>
             <span className="text-green-500 font-bold">+₹450</span>
         </div>
         <div className="flex justify-between border-b border-gray-800 pb-2">
             <div><p>Free Boost Ad Revenue (30%)</p><p className="text-xs text-gray-500">Yesterday</p></div>
             <span className="text-green-500 font-bold">+₹120</span>
         </div>
      </div>
    </div>
  );
}
