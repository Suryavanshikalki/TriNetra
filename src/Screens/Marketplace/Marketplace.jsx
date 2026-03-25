// File: src/screens/Marketplace/Marketplace.jsx
import React from 'react';
import { Search, MapPin, Tag } from 'lucide-react';

export default function Marketplace() {
  return (
    <div className="p-4 bg-[#0a1014] h-full pb-24 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Marketplace</h2>
        <button className="bg-gray-800 p-2 rounded-full"><Search size={20} className="text-white"/></button>
      </div>

      <div className="flex space-x-2 mb-6">
        <button className="flex-1 bg-gray-800 py-2 rounded-xl text-sm font-bold text-white flex justify-center items-center"><Tag size={16} className="mr-2"/> Sell</button>
        <button className="flex-1 bg-gray-800 py-2 rounded-xl text-sm font-bold text-white flex justify-center items-center"><MapPin size={16} className="mr-2"/> Local</button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer">
            <div className="h-40 bg-gray-800"></div> {/* Image Placeholder */}
            <div className="p-3">
              <p className="font-bold text-white">₹15,000</p>
              <p className="text-sm text-gray-400 truncate">iPhone 13 - Used</p>
              <p className="text-xs text-gray-500 mt-1">Patna, Bihar</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
