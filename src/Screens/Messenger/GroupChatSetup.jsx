// File: src/screens/Messenger/GroupChatSetup.jsx
import React, { useState } from 'react';
import { ArrowLeft, Check, Search } from 'lucide-react';

export default function GroupChatSetup({ onBack }) {
  const [groupName, setGroupName] = useState('');

  return (
    <div className="h-full bg-[#0a1014] text-white flex flex-col absolute top-0 w-full z-30">
      <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <ArrowLeft onClick={onBack} className="text-gray-400 cursor-pointer" />
          <h2 className="font-bold text-lg">New Group</h2>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center border border-dashed border-gray-500 cursor-pointer">
            <span className="text-xs text-gray-400 text-center">Group<br/>Icon</span>
          </div>
          <input 
            type="text" 
            placeholder="Type group subject..." 
            className="flex-1 bg-transparent border-b border-green-500 outline-none text-white py-2"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <p className="text-xs font-bold text-gray-500 mb-3">ADD MUTUAL FOLLOWERS</p>
        <div className="bg-gray-800 flex items-center p-2 rounded-xl mb-4">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search friends..." className="bg-transparent outline-none w-full text-sm" />
        </div>

        {/* Friend List */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center justify-between p-2 hover:bg-gray-900 rounded-xl cursor-pointer">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
               <span className="font-bold text-sm">Mutual Friend {item}</span>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-green-500" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6">
        <button className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-500">
          <Check size={24} className="text-black font-bold"/>
        </button>
      </div>
    </div>
  );
}
