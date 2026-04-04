import React, { useState, useEffect } from 'react';
import { Search, Loader2, Phone, Video, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy Code) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function ChatList({ currentUser, onSelectChat }) {
  const { t } = useTranslation();
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ─── 1. 100% REAL AWS FETCH: ONLY MUTUAL CONNECTIONS (Point 5) ───
  useEffect(() => {
    const fetchMutualConnections = async () => {
      if (!currentUser?.trinetraId) return;
      try {
        // 🔥 Asli AWS GraphQL Query: Fetching from DynamoDB securely
        const res = await client.graphql({
          query: `query GetMutualConnections($userId: ID!) {
            getTriNetraMutualFriends(userId: $userId) {
              items {
                trinetraId
                name
                profilePic
                lastMessage
                lastMessageTime
                isOnline
              }
            }
          }`,
          variables: { userId: currentUser.trinetraId }
        });
        
        setFriends(res.data.getTriNetraMutualFriends.items);
      } catch (err) {
        console.error("❌ AWS DB Error:", err);
        setError(t("Failed to load secure connections. AWS backend error."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMutualConnections();

    // ─── 2. REAL-TIME LAST MESSAGE SYNC (WhatsApp Style) ──────────
    // जैसे ही कोई नया मैसेज आएगा, लिस्ट में 'Last Message' अपने-आप अपडेट होगा
    const sub = client.graphql({
      query: `subscription OnChatUpdate($userId: ID!) {
        onTriNetraChatUpdate(userId: $userId) {
          trinetraId lastMessage lastMessageTime
        }
      }`,
      variables: { userId: currentUser?.trinetraId }
    }).subscribe({
      next: ({ data }) => {
        const update = data.onTriNetraChatUpdate;
        setFriends(prev => prev.map(f => f.trinetraId === update.trinetraId ? { ...f, ...update } : f));
      }
    });

    return () => sub.unsubscribe();
  }, [currentUser, t]);

  const filteredFriends = friends.filter(friend => 
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    friend.trinetraId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans border-r border-gray-800">
      
      {/* 🚀 Header & Search Area */}
      <div className="p-4 bg-[#111827] border-b border-gray-800 shadow-lg z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
            {t("TriNetra Messenger")}
          </h2>
          <ShieldCheck size={18} className="text-green-500" title={t("E2E Encrypted")} />
        </div>
        
        <div className="flex items-center gap-3 bg-[#0a1014] border border-gray-800 p-3 rounded-xl focus-within:border-cyan-500 transition-all shadow-inner">
          <Search size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder={t("Search Mutual Friends...")} 
            className="bg-transparent w-full text-sm focus:outline-none placeholder-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 text-center text-[10px] uppercase tracking-widest text-red-400 font-bold bg-red-900/20 border border-red-500/30 m-4 rounded-xl">
          {error}
        </div>
      )}
      
      {/* 📱 Real Chat List Area */}
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center"><Loader2 size={30} className="text-cyan-500 animate-spin" /></div>
      ) : (
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          
          {filteredFriends.length === 0 && !error && (
            <div className="p-8 text-center flex flex-col items-center justify-center opacity-50">
              <ShieldCheck size={40} className="text-cyan-500 mb-3"/>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                {t("No mutual connections found.")}
              </p>
              <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest mt-1">
                {t("Follow back to chat securely.")}
              </p>
            </div>
          )}

          {filteredFriends.map(friend => (
            <div 
              key={friend.trinetraId} 
              onClick={() => onSelectChat(friend)}
              className="flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#111827] active:bg-black transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 w-full">
                
                {/* Profile Pic with Online Status */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#0a1014] border-2 border-cyan-500/50 overflow-hidden flex items-center justify-center shadow-lg">
                     {friend.profilePic ? (
                       <img src={friend.profilePic} className="w-full h-full object-cover" alt="avatar" />
                     ) : (
                       <span className="text-cyan-400 font-black text-lg">{friend.name?.charAt(0)}</span>
                     )}
                  </div>
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#111827] rounded-full"></div>
                  )}
                </div>
                
                {/* Name & Last Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-sm tracking-wide text-gray-200 truncate">{friend.name}</h4>
                    {friend.lastMessageTime && (
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                        {new Date(friend.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate font-medium">
                    {friend.lastMessage || <span className="italic opacity-60">{t("Tap to start secure chat")}</span>}
                  </p>
                </div>

                {/* Quick Action Icons (Visible on Hover) */}
                <div className="hidden group-hover:flex items-center gap-3 text-cyan-500 opacity-80 pl-2">
                   <Phone size={16} className="hover:text-white transition-colors" />
                   <Video size={18} className="hover:text-white transition-colors" />
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
