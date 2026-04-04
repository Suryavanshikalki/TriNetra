// ==========================================
// TRINETRA SUPER APP - GROUP CHAT SETUP (File 17)
// Exact Path: src/screens/Messenger/GroupChatSetup.jsx
// ==========================================
import React, { useState, useRef } from 'react';
import { Users, X, Camera, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render) 🔥
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function GroupChatSetup({ friends = [], currentUser, onClose }) {
  const { t } = useTranslation();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // 🔥 New: Group Image States
  const [groupImage, setGroupImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  const toggleFriend = (id) => {
    setSelectedFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // ─── 1. REAL GROUP IMAGE PREVIEW LOGIC ────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ─── 2. REAL AWS GROUP CREATION (S3 + DynamoDB) ───────────────────
  const handleCreate = async () => {
    if (!groupName.trim() || selectedFriends.length === 0) {
      return alert(t("Group name and at least 1 member required."));
    }
    
    setIsCreating(true);
    let finalImageUrl = null;

    try {
      // Step A: Upload Group Picture to AWS S3 (If selected)
      if (groupImage) {
        const fileExt = groupImage.name.split('.').pop();
        const fileName = `group_pics/${currentUser?.trinetraId}_${Date.now()}.${fileExt}`;
        
        await uploadData({
          path: `public/${fileName}`,
          data: groupImage,
          options: { contentType: groupImage.type, accessLevel: 'guest' }
        }).result;

        const urlResult = await getUrl({ path: `public/${fileName}` });
        finalImageUrl = urlResult.url.toString();
      }

      // Step B: Create Group in AWS DynamoDB
      const mutation = `
        mutation CreateGroupChat($name: String!, $adminId: ID!, $members: [ID!]!, $groupPicUrl: String) {
          createTriNetraGroup(name: $name, adminId: $adminId, members: $members, groupPicUrl: $groupPicUrl) {
            id
            name
          }
        }
      `;

      await client.graphql({
        query: mutation,
        variables: {
          name: groupName,
          adminId: currentUser.trinetraId,
          members: [...selectedFriends, currentUser.trinetraId], // Include admin in members list
          groupPicUrl: finalImageUrl
        }
      });

      alert(t("TriNetra Group Created Successfully!"));
      onClose(); // Close modal on success

    } catch (err) {
      console.error("❌ AWS Group Creation Failed:", err);
      alert(t("Failed to create secure group on AWS."));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl p-4 flex items-center justify-center font-sans animate-fade-in">
      <div className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-gray-800 p-8 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
            <Users size={20} /> {t("New Group")}
          </h2>
          <button onClick={onClose} disabled={isCreating} className="text-gray-500 hover:text-red-500 active:scale-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        {/* 📸 REAL GROUP IMAGE UPLOADER */}
        <div className="flex flex-col items-center mb-8">
           <div 
             onClick={() => imageInputRef.current.click()}
             className="w-24 h-24 bg-[#0a1014] rounded-full border-2 border-dashed border-cyan-500/50 flex items-center justify-center mb-4 cursor-pointer hover:border-cyan-400 transition-colors overflow-hidden group relative shadow-lg"
             title={t("Upload Group Photo")}
           >
             {imagePreview ? (
               <>
                 <img src={imagePreview} alt="Group Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                 </div>
               </>
             ) : (
               <Camera className="text-cyan-500 group-hover:scale-110 transition-transform" size={32} />
             )}
           </div>
           
           {/* Hidden File Input */}
           <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={handleImageChange} />
           
           <input 
             type="text" 
             placeholder={t("Enter Group Name...")} 
             className="bg-transparent border-b border-gray-800 w-full text-center p-3 text-lg font-bold focus:border-cyan-500 outline-none text-white transition-colors" 
             value={groupName} 
             onChange={(e) => setGroupName(e.target.value)} 
             disabled={isCreating}
           />
        </div>

        {/* Friend Selection List */}
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex justify-between">
          <span>{t("Select Members")}</span>
          <span className="text-cyan-500">{selectedFriends.length} {t("Selected")}</span>
        </h3>
        
        <div className="max-h-64 overflow-y-auto space-y-2 mb-8 pr-2 hide-scrollbar">
          {friends.map(f => (
            <div 
              key={f.trinetraId} 
              onClick={() => !isCreating && toggleFriend(f.trinetraId)} 
              className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition-all active:scale-95 ${selectedFriends.includes(f.trinetraId) ? 'bg-cyan-500/10 border-cyan-500/50 shadow-inner' : 'bg-[#0a1014] border-gray-800 hover:border-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#111827] border border-gray-800 overflow-hidden flex items-center justify-center font-bold text-gray-400">
                    {f.profilePic ? <img src={f.profilePic} className="w-full h-full object-cover" alt="pfp"/> : f.name?.charAt(0)}
                 </div>
                 <span className="text-sm font-bold text-gray-200">{f.name}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedFriends.includes(f.trinetraId) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-700'}`}>
                {selectedFriends.includes(f.trinetraId) && <Check size={14} className="text-black font-black" />}
              </div>
            </div>
          ))}
          {friends.length === 0 && (
            <div className="text-center p-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold border border-dashed border-gray-800 rounded-2xl">
              {t("No mutual friends to add")}
            </div>
          )}
        </div>

        {/* Launch Button */}
        <button 
          onClick={handleCreate} 
          disabled={isCreating || !groupName.trim() || selectedFriends.length === 0} 
          className="w-full bg-cyan-500 hover:bg-cyan-400 py-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
        >
          {isCreating ? <Loader2 className="animate-spin mx-auto" /> : t("Launch Group")}
        </button>
      </div>
    </div>
  );
}
