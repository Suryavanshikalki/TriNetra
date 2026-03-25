// File: src/screens/Profile/UserProfile.jsx
import React from 'react';
import { Camera, Edit3 } from 'lucide-react';

export default function UserProfile() {
  return (
    <div className="h-full bg-[#0a1014] overflow-y-auto pb-24 text-white">
      {/* Cover Photo */}
      <div className="h-40 bg-gray-800 relative">
        <button className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full"><Camera size={16}/></button>
      </div>
      
      {/* Profile & Avatar Info */}
      <div className="px-4 relative mb-4">
        <div className="w-24 h-24 bg-gray-900 border-4 border-[#0a1014] rounded-full absolute -top-12 flex items-center justify-center">
            {/* Mock Avatar */}
            <span className="text-xs text-gray-500">Avatar</span>
        </div>
        <div className="flex justify-end pt-3">
          <button className="bg-gray-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center"><Edit3 size={14} className="mr-2"/> Edit Profile</button>
        </div>
        <div className="mt-2">
          <h2 className="text-2xl font-black">Suryavanshi Kalki</h2>
          <p className="text-gray-400 text-sm mt-1">TriNetra Super App Creator 👁️🔥 | Coder | Visionary</p>
          <div className="flex space-x-4 mt-3 text-sm">
            <span className="font-bold">120K <span className="text-gray-500 font-normal">Followers</span></span>
            <span className="font-bold">15 <span className="text-gray-500 font-normal">Following</span></span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-gray-800 mt-4">
        <button className="flex-1 py-3 border-b-2 border-green-500 text-green-500 font-bold">Posts</button>
        <button className="flex-1 py-3 text-gray-500 font-bold">Reels</button>
      </div>
      
      {/* Mock Grid */}
      <div className="p-4 grid grid-cols-3 gap-1">
        {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-800 aspect-square"></div>)}
      </div>
    </div>
  );
}
