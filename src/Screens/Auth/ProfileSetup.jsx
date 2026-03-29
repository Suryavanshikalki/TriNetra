// ==========================================
// TRINETRA SUPER APP - PROFILE & PRIVACY V6.0
// Blueprint Point 3: Facebook Style, 3D Avatar, Mutual Connection, Skip Option
// ==========================================
import React, { useState } from 'react';
import { Camera, Image as ImageIcon, User, Edit3, UserCheck, UserPlus, Box, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';

// 🌐 Multi-language Function (i18next placeholder)
const t = (text) => text;

export default function ProfileScreen({ trinetraId = "TRN-DEMO-123", isSetupMode = false, onCompleteSetup }) {
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('none'); // 'none', 'following', 'mutual'

  // 📸 Media Handlers (Gallery/Camera logic placeholder for AWS)
  const handleImageUpload = (type) => {
    // Real app will open device camera/gallery using native bridges
    console.log(`Opening gallery/camera for ${type}`);
    const mockImage = `https://via.placeholder.com/${type === 'cover' ? '800x300' : '150'}`;
    type === 'cover' ? setCoverPic(mockImage) : setProfilePic(mockImage);
  };

  // 🤝 Connection Rule (Point 3: Mutual Connection logic)
  const handleFollow = () => {
    // API Call to backend: /api/users/follow
    // Notification goes to friend list. Only Mutual can text/call.
    setConnectionStatus(prev => prev === 'none' ? 'following' : 'none');
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto font-sans multilanguage-container">
      
      {/* 🖼️ COVER PHOTO AREA */}
      <div className="relative h-48 bg-gray-800 border-b border-cyan-500/20 group cursor-pointer" onClick={() => handleImageUpload('cover')}>
        {coverPic ? (
          <img src={coverPic} alt="Cover" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-cyan-400 transition-colors">
            <ImageIcon size={32} />
            <span className="text-xs mt-2 uppercase tracking-widest font-bold">{t("Add Cover Photo")}</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/10">
            <Camera size={16} className="text-white" />
        </div>
      </div>

      {/* 👤 PROFILE PHOTO & INFO AREA */}
      <div className="px-4 relative pb-4 border-b border-gray-800">
        <div className="flex justify-between items-end -mt-12 mb-4">
          
          {/* Avatar / Profile Pic */}
          <div className="relative group cursor-pointer" onClick={() => handleImageUpload('profile')}>
            <div className="w-24 h-24 rounded-full bg-[#111827] border-4 border-[#0a1014] overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-cyan-500" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-cyan-500 p-1.5 rounded-full border-2 border-[#0a1014]">
              <Camera size={14} className="text-black" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="bg-[#111827] border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
              <Box size={16} /> {t("3D Avatar")}
            </button>
            
            {!isSetupMode && (
              <button onClick={handleFollow} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${connectionStatus === 'following' ? 'bg-gray-800 text-white border border-gray-600' : 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}>
                {connectionStatus === 'following' ? <><UserCheck size={16}/> {t("Following")}</> : <><UserPlus size={16}/> {t("Follow")}</>}
              </button>
            )}
          </div>
        </div>

        {/* User Details */}
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wide flex items-center gap-2">
            Super User <ShieldCheck size={18} className="text-green-500" />
          </h2>
          <p className="text-cyan-400 text-sm font-bold tracking-widest mb-3">ID: {trinetraId}</p>
          
          {/* Bio Input / Display */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-3 flex gap-2 focus-within:border-cyan-500 transition-colors">
            <Edit3 size={16} className="text-gray-500 mt-1" />
            <textarea 
              placeholder={t("Write your bio here...")}
              className="bg-transparent w-full text-sm text-gray-300 focus:outline-none resize-none"
              rows="2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 🚀 SETUP MODE (Skip Option - Point 3) */}
      {isSetupMode && (
        <div className="mt-auto p-6 flex flex-col gap-4">
            <button onClick={onCompleteSetup} className="w-full bg-cyan-500 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                {t("Save Profile")} <ArrowRight size={20} />
            </button>
            <button onClick={onCompleteSetup} className="w-full text-gray-500 font-bold uppercase text-xs hover:text-white tracking-widest py-2">
                {t("Skip for now")}
            </button>
        </div>
      )}
    </div>
  );
}
