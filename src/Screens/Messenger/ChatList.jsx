// ==========================================
// TRINETRA MESSENGER - CHAT LIST (File 13)
// Rule: Only Mutual Followers (Point 5)
// ==========================================
import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Phone, Video } from 'lucide-react';

const t = (text) => text; // Multilanguage Placeholder

export default function ChatList({ onSelectChat }) {
  const [friends, setFriends] = useState([]);

  // Mock Data: Sirf wahi jo mutual followers hain
  useEffect(() => {
    setFriends([
      { id: 'TRN_789', name: 'Nishant', status: 'Online', lastMsg: 'Project update?', time: '12:45 PM', avatar: '' },
      { id: 'TRN_456', name: 'TriNetra Dev', status: 'Offline', lastMsg: 'S3 keys uploaded.', time: 'Yesterday', avatar: '' }
    ]);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans">
      {/* Search Bar */}
      <div className="p-4 bg-[#111827]">
        <div className="flex items-center gap-3 bg-[#0a1014] border border-gray-800 p-3 rounded-xl focus-within:border-cyan-500 transition-all">
          <Search size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder={t("Search Mutual Friends...")} 
            className="bg-transparent w-full text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {friends.map(friend => (
          <div 
            key={friend.id} 
            onClick={() => onSelectChat(friend)}
            className="flex items-center justify-between p-4 border-b border-gray-900 hover:bg-[#111827] active:bg-[#0a1014] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-cyan-500/20 group-hover:border-cyan-400 overflow-hidden">
                   <img src={`https://ui-avatars.com/api/?name=${friend.name}&background=random`} alt="avatar" />
                </div>
                {friend.status === 'Online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a1014] rounded-full"></div>}
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">{friend.name}</h4>
                <p className="text-xs text-gray-500 truncate w-32">{friend.lastMsg}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-600 font-bold uppercase">{friend.time}</p>
              <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Phone size={14} className="text-gray-500" />
                <Video size={14} className="text-gray-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
