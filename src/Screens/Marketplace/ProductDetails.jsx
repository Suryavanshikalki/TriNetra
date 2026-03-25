// File: src/screens/Marketplace/ProductDetails.jsx
import React from 'react';
import { MapPin, MessageCircle, Share2, ArrowLeft } from 'lucide-react';

export default function ProductDetails({ onBack }) {
  return (
    <div className="h-full bg-[#0a1014] text-white flex flex-col absolute top-0 w-full z-30 overflow-y-auto">
      <div className="p-4 bg-gray-900 flex justify-between items-center fixed w-full top-0 z-40">
        <ArrowLeft onClick={onBack} className="text-gray-400 cursor-pointer" />
        <Share2 className="text-gray-400 cursor-pointer" />
      </div>

      <div className="mt-14 h-72 bg-gray-800 w-full flex items-center justify-center">
        <span className="text-gray-500">Product Image (Full Width)</span>
      </div>

      <div className="p-5">
        <h1 className="text-3xl font-black text-green-500">₹15,000</h1>
        <h2 className="text-xl font-bold mt-2">iPhone 13 - Like New</h2>
        <div className="flex items-center text-gray-400 text-sm mt-3 border-b border-gray-800 pb-4">
          <MapPin size={16} className="mr-1"/> Patna, Bihar • Listed 2 days ago
        </div>

        <div className="mt-4">
          <h3 className="font-bold mb-2">Seller Information</h3>
          <div className="flex items-center space-x-3 bg-gray-900 p-3 rounded-xl">
             <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
             <div>
               <p className="font-bold">Rahul Kumar</p>
               <p className="text-xs text-gray-500">Joined 2024</p>
             </div>
          </div>
        </div>

        <button className="w-full bg-green-600 text-black p-4 rounded-xl font-bold mt-6 flex items-center justify-center hover:bg-green-500 transition">
          <MessageCircle className="mr-2"/> Message Seller
        </button>
      </div>
    </div>
  );
}
