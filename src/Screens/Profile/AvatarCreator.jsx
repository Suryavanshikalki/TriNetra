// File: src/screens/Profile/AvatarCreator.jsx
import React from 'react';
import { User, Check } from 'lucide-react';

export default function AvatarCreator() {
  return (
    <div className="h-full bg-gray-950 text-white p-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-6">Create Your 3D Avatar</h2>
      <div className="w-48 h-64 bg-gray-800 border border-green-500 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
         <User size={64} className="text-gray-500"/>
      </div>
      <div className="w-full max-w-xs space-y-4">
          <button className="w-full bg-gray-800 p-3 rounded-xl">Skin Tone</button>
          <button className="w-full bg-gray-800 p-3 rounded-xl">Hair Style</button>
          <button className="w-full bg-gray-800 p-3 rounded-xl">Clothing</button>
      </div>
      <button className="w-full max-w-xs bg-green-600 text-black p-4 rounded-xl font-bold mt-8 flex justify-center items-center">
         <Check className="mr-2"/> Save Avatar
      </button>
    </div>
  );
}
