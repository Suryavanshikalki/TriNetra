// File: src/screens/Reels/ReelsPlayer.jsx
import React from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, TrendingUp } from 'lucide-react';

export default function ReelsPlayer() {
  return (
    <div className="relative h-full w-full bg-black snap-y snap-mandatory overflow-y-scroll pb-20">
      {/* Reel Container (Mocking full screen swipe) */}
      <div className="relative h-full w-full snap-start bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500">Video Player Component (Full Screen)</span>
        
        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
          <button className="flex flex-col items-center"><Heart size={28} className="text-white hover:text-red-500"/><span className="text-xs mt-1">12K</span></button>
          <button className="flex flex-col items-center"><MessageCircle size={28} className="text-white"/><span className="text-xs mt-1">450</span></button>
          <button className="flex flex-col items-center"><Share2 size={28} className="text-white"/><span className="text-xs mt-1">Share</span></button>
          <button className="flex flex-col items-center text-yellow-500"><TrendingUp size={28}/><span className="text-xs mt-1 text-yellow-500 font-bold">Boost</span></button>
          <button><MoreVertical size={24} className="text-white"/></button>
        </div>

        {/* Bottom User Info */}
        <div className="absolute left-4 bottom-24">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-gray-700 rounded-full border border-green-500"></div>
            <span className="font-bold text-white text-sm">TriNetra Creator</span>
            <button className="border border-white px-3 py-1 rounded-lg text-xs font-bold text-white ml-2">Follow</button>
          </div>
          <p className="text-sm text-gray-200 w-3/4 line-clamp-2">Testing the new Reel Boost feature! #TriNetra #ProApp</p>
        </div>
      </div>
    </div>
  );
}
