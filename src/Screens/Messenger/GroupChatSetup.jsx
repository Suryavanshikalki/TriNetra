// ==========================================
// TRINETRA SUPER APP - GROUP CHAT SETUP (File 17)
// Exact Path: src/screens/Messenger/GroupChatSetup.jsx
// ==========================================
import React, { useState } from 'react';
import { Users, X, Camera, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function GroupChatSetup({ friends = [], currentUser, onClose }) {
  const { t } = useTranslation();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const toggleFriend = (id) => {
    setSelectedFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleCreate = async () => {
    if (!groupName || selectedFriends.length === 0) return alert(t("Group name and members required"));
    setIsCreating(true);
    try {
      const res = await axios.post('https://trinetra-umys.onrender.com/api/chat/create-group', {
        name: groupName, members: [...selectedFriends, currentUser.trinetraId], admin: currentUser.trinetraId
      });
      if(res.data.success) { alert(t("Group Created!")); onClose(); }
    } catch (err) { alert(t("Failed to create group")); }
    finally { setIsCreating(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl p-4 flex items-center justify-center font-sans">
      <div className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-gray-800 p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-cyan-400">{t("New Group")}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
        </div>

        <div className="flex flex-col items-center mb-8">
           <div className="w-24 h-24 bg-gray-900 rounded-full border-2 border-dashed border-cyan-500/50 flex items-center justify-center mb-4">
             <Camera className="text-cyan-500" size={32} />
           </div>
           <input type="text" placeholder={t("Enter Group Name...")} className="bg-transparent border-b border-gray-800 w-full text-center p-3 text-lg font-bold focus:border-cyan-500 outline-none" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        </div>

        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{t("Select Members")}</h3>
        <div className="max-h-64 overflow-y-auto space-y-2 mb-8 pr-2">
          {friends.map(f => (
            <div key={f.trinetraId} onClick={() => toggleFriend(f.trinetraId)} className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer ${selectedFriends.includes(f.trinetraId) ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-[#0a1014] border-gray-800'}`}>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700"></div>
                 <span className="text-sm font-bold">{f.name}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedFriends.includes(f.trinetraId) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-700'}`}>
                {selectedFriends.includes(f.trinetraId) && <Check size={14} className="text-black font-black" />}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleCreate} disabled={isCreating} className="w-full bg-cyan-500 py-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] shadow-lg disabled:opacity-50">
          {isCreating ? <Loader2 className="animate-spin mx-auto" /> : t("Launch Group")}
        </button>
      </div>
    </div>
  );
}
