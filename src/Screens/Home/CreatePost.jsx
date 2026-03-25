// File: src/screens/Home/CreatePost.jsx
import React, { useState } from 'react';
import { Image, FileText, Mic, Video, MapPin, Send } from 'lucide-react';

export default function CreatePost() {
  const [postText, setPostText] = useState('');

  const handlePost = () => {
    alert("Post Logic will run here!");
    setPostText('');
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-sm mb-4">
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
        <textarea 
          placeholder="What's on your mind? Upload Text, Photo, PDF..." 
          className="w-full bg-transparent text-white outline-none resize-none h-16 mt-2"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
      </div>
      
      <div className="flex justify-between items-center border-t border-gray-800 pt-3">
        <div className="flex space-x-4 text-gray-400">
          <button className="hover:text-green-500 transition"><Image size={20}/></button>
          <button className="hover:text-green-500 transition"><Video size={20}/></button>
          <button className="hover:text-green-500 transition"><Mic size={20}/></button>
          <button className="hover:text-green-500 transition"><FileText size={20}/></button>
          <button className="hover:text-green-500 transition"><MapPin size={20}/></button>
        </div>
        <button 
          onClick={handlePost} 
          className="bg-green-600 hover:bg-green-500 text-black px-5 py-2 rounded-full font-bold flex items-center transition"
        >
          Post <Send size={14} className="ml-2"/>
        </button>
      </div>
    </div>
  );
}
