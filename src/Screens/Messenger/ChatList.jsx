import React, { useState, useEffect } from 'react';
import { Search, Phone, Video, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function ChatList({ currentUser, onSelectChat }) {
  const { t } = useTranslation();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 100% Real Fetch: Only Mutual Connections from TriNetra DB
  useEffect(() => {
    const fetchMutualConnections = async () => {
      try {
        const res = await axios.get(`https://trinetra-umys.onrender.com/api/chat/mutual-friends?userId=${currentUser?.trinetraId}`);
        if (res.data.success) {
          setFriends(res.data.friends);
        }
      } catch (err) {
        setError(t("Failed to load secure connections. Backend offline."));
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.trinetraId) fetchMutualConnections();
  }, [currentUser, t]);

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    friend.trinetraId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans">
      <div className="p-4 bg-[#111827] border-b border-gray-800">
        <h2 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white mb-4">
          {t("TriNetra Messenger")}
        </h2>
        <div className="flex items-center gap-3 bg-[#0a1014] border border-gray-800 p-3 rounded-xl focus-within:border-cyan-500 transition-all">
          <Search size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder={t("Search Mutual Friends...")} 
            className="bg-transparent w-full text-sm focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="p-4 text-center text-xs text-red-400 font-bold bg-red-500/10 m-4 rounded-xl">{error}</div>}
      
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center"><Loader2 size={30} className="text-cyan-500 animate-spin" /></div>
      ) : (
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredFriends.length === 0 && !error && (
            <div className="p-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
              {t("No mutual connections found. Follow back to chat.")}
            </div>
          )}

          {filteredFriends.map(friend => (
            <div 
              key={friend.trinetraId} 
              onClick={() => onSelectChat(friend)}
              className="flex items-center justify-between p-4 border-b border-gray-900 hover:bg-[#111827] active:bg-black transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center">
                   {friend.profilePic ? <img src={friend.profilePic} className="w-full h-full object-cover" alt="avatar" /> : <span className="text-cyan-500 font-bold">{friend.name?.charAt(0)}</span>}
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">{friend.name}</h4>
                  <p className="text-xs text-gray-500 truncate w-40">{friend.lastMessage || t("Tap to chat")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
