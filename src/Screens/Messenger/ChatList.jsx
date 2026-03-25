// File: src/screens/Messenger/ChatList.jsx
import React from 'react';
import { Search, Edit } from 'lucide-react';

export default function ChatList({ onSelectChat }) {
  return (
    <div className="h-full bg-gray-950 flex flex-col">
      <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Chats</h2>
        <Edit className="text-green-500 cursor-pointer" />
      </div>
      
      <div className="p-4">
        <div className="bg-gray-800 flex items-center p-2 rounded-xl mb-4">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search mutual friends..." className="bg-transparent text-white outline-none w-full text-sm" />
        </div>
        <p className="text-xs text-gray-500 font-bold mb-4">MUTUAL FOLLOWERS ONLY</p>

        {/* Chat Item */}
        <div onClick={onSelectChat} className="flex items-center space-x-4 cursor-pointer hover:bg-gray-900 p-2 rounded-xl transition">
          <div className="w-12 h-12 bg-gray-700 rounded-full relative">
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white">Aditya Pratap</h4>
            <p className="text-sm text-gray-400 truncate">Bhai, PDF download ho gayi!</p>
          </div>
          <span className="text-xs text-gray-500">10:45 AM</span>
        </div>
      </div>
    </div>
  );
}
