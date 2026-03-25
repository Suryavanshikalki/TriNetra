// File: src/screens/Home/CommentSection.jsx
import React, { useState } from 'react';
import { Mic, Paperclip, Send, Smile, Download, FileText, Globe } from 'lucide-react';

export default function CommentSection({ comments }) {
  const [commentText, setCommentText] = useState('');
  const [translatedText, setTranslatedText] = useState({}); // To store translations for specific comments

  const handleTranslate = (idx, originalText) => {
    // API call goes here in real app
    setTranslatedText(prev => ({ ...prev, [idx]: "अनुवादित: " + originalText }));
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4">
      {/* Existing Comments List */}
      <div className="space-y-4 mb-4 max-h-40 overflow-y-auto">
        {(comments || []).map((cmd, idx) => (
          <div key={idx} className="flex space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex-shrink-0"></div>
            <div className="bg-gray-800 p-3 rounded-xl flex-1 text-sm text-white border border-gray-700">
              <span className="font-bold block mb-1">User {idx+1}</span>
              <p>{translatedText[idx] || cmd.text || "This is a comment."}</p>
              
              {/* Translate Button for Comments (नया जोड़ा गया) */}
              <button 
                onClick={() => handleTranslate(idx, cmd.text || "This is a comment.")} 
                className="text-xs text-blue-400 mt-2 flex items-center hover:text-blue-300 font-bold"
              >
                 <Globe size={12} className="mr-1"/> A/क Translate
              </button>

              {cmd.mediaType === 'PDF' && (
                <div className="mt-2 bg-gray-900 p-2 rounded flex items-center justify-between border border-gray-700">
                  <span className="flex items-center text-red-500"><FileText size={16} className="mr-1"/> Doc.pdf</span>
                  <Download size={16} className="text-green-500 cursor-pointer"/>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Comment Box */}
      <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 space-x-3">
        <Smile className="text-gray-400 cursor-pointer hover:text-yellow-500" />
        <Paperclip className="text-gray-400 cursor-pointer hover:text-white" />
        <input 
          type="text" 
          placeholder="Write a comment, attach media, GIF, or use Mic..." 
          className="flex-1 bg-transparent text-white outline-none text-sm"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        {commentText ? (
          <Send className="text-green-500 cursor-pointer" />
        ) : (
          <Mic className="text-green-500 cursor-pointer" />
        )}
      </div>
    </div>
  );
}
