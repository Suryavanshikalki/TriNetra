// File: src/screens/Home/StoryViewer.jsx
import React from 'react';
import { Plus } from 'lucide-react';

export default function StoryViewer() {
  return (
    <div className="flex space-x-4 p-4 overflow-x-auto bg-gray-900 border-b border-gray-800 scrollbar-hide">
      {/* Create Story Button */}
      <div className="flex flex-col items-center cursor-pointer">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-500 relative">
          <Plus className="text-gray-400" />
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 text-black">
            <Plus size={12} className="font-bold"/>
          </div>
        </div>
        <span className="text-xs text-gray-400 mt-2">Your Story</span>
      </div>

      {/* Mock Stories */}
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex flex-col items-center cursor-pointer">
          <div className="w-16 h-16 bg-gray-700 rounded-full border-2 border-green-500 p-0.5">
            <div className="w-full h-full bg-gray-600 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-300 mt-2">User {item}</span>
        </div>
      ))}
    </div>
  );
}
