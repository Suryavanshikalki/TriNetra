// File: src/screens/Settings/AudienceVisibility.jsx
import React from 'react';

export default function AudienceVisibility() {
  return (
    <div className="h-full bg-[#0a1014] text-white p-4">
      <h2 className="text-xl font-bold mb-6">Audience and Visibility</h2>
      <div className="bg-gray-900 rounded-xl p-4 space-y-4 text-sm">
         <div className="flex justify-between border-b border-gray-800 pb-3"><span>Who can see your future posts?</span> <span className="text-gray-400">Public</span></div>
         <div className="flex justify-between border-b border-gray-800 pb-3"><span>Who can see your stories?</span> <span className="text-gray-400">Followers</span></div>
         <div className="flex justify-between border-b border-gray-800 pb-3"><span>Who can see your Reels?</span> <span className="text-gray-400">Public</span></div>
         <div className="flex justify-between"><span>Who can send you friend requests?</span> <span className="text-gray-400">Everyone</span></div>
      </div>
    </div>
  );
}
