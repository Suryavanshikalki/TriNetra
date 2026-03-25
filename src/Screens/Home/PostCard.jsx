// File: src/screens/Home/PostCard.jsx
import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, TrendingUp, Download, AlertTriangle, Globe } from 'lucide-react';

export default function PostCard({ userName, timeAgo, content, category, isDevelopmentIssue }) {
  const [translatedText, setTranslatedText] = useState(null);

  const handleTranslate = () => {
    // In real app, this calls translateRoutes.js API
    setTranslatedText("अनुवादित टेक्स्ट: " + content);
  };

  const handleEscalate = () => {
    alert(`Complaint Escalated in Category: ${category}. Moving to next authority level!`);
  };

  return (
    <div className="bg-gray-900 rounded-xl mb-4 overflow-hidden border border-gray-800">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div>
            <h4 className="font-bold text-white text-sm">{userName}</h4>
            <p className="text-xs text-gray-500">{timeAgo} • {category}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white">•••</button>
      </div>

      <div className="px-4 pb-3 text-sm text-gray-200">
        <p>{translatedText || content}</p>
        
        {/* Translate Button (नया जोड़ा गया) */}
        <button onClick={handleTranslate} className="text-xs text-blue-400 mt-2 flex items-center hover:text-blue-300 font-bold">
           <Globe size={12} className="mr-1"/> A/क Translate
        </button>

        <div className="mt-3 bg-gray-800 p-3 rounded-lg flex justify-between items-center border border-gray-700">
            <span className="text-xs text-gray-400">Attached_Media_File.pdf</span>
            <button className="text-green-500 flex items-center text-xs font-bold"><Download size={14} className="mr-1"/> Download</button>
        </div>
      </div>

      {isDevelopmentIssue && (
        <div className="px-4 pb-3">
          <button onClick={handleEscalate} className="w-full bg-red-900/30 text-red-500 border border-red-900/50 p-2 rounded-lg text-xs font-bold flex justify-center items-center">
            <AlertTriangle size={14} className="mr-2"/> Escalate Issue (Local ➡️ MLA ➡️ CM)
          </button>
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-800 flex justify-between text-gray-400 text-sm">
        <button className="flex items-center"><Heart size={18} className="mr-2"/> Like</button>
        <button className="flex items-center"><MessageSquare size={18} className="mr-2"/> Comment</button>
        <button className="flex items-center"><Share2 size={18} className="mr-2"/> Share</button>
        <button className="flex items-center text-yellow-600 font-bold"><TrendingUp size={18} className="mr-2"/> Boost</button>
      </div>
    </div>
  );
}
