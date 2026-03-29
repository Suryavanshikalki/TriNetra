import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Box, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function ProfileSetup({ user, onComplete }) {
  const { t } = useTranslation();
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 100% Real File Upload to backend -> AWS S3
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);
    formData.append('userId', user?.trinetraId);
    formData.append('uploadType', type);

    setIsLoading(true);
    try {
      // Real API hitting your TriNetra Backend (File 56 S3 Uploader)
      const res = await axios.post('https://trinetra-umys.onrender.com/api/user/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'profile') setProfilePic(res.data.url);
      if (type === 'cover') setCoverPic(res.data.url);
    } catch (err) {
      console.error(t("Upload failed to secure server."));
    } finally {
      setIsLoading(false);
    }
  };

  // Real Save Profile Logic
  const saveProfile = async () => {
    setIsLoading(true);
    try {
      await axios.post('https://trinetra-umys.onrender.com/api/user/update-profile', {
        userId: user?.trinetraId,
        bio: bio,
        profilePicUrl: profilePic,
        coverPicUrl: coverPic
      });
      onComplete(); // Takes user to Home Screen
    } catch (err) {
      console.error(t("Profile save error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-y-auto font-sans">
      {/* Cover Photo Area */}
      <div className="relative h-48 bg-gray-800 border-b border-cyan-500/20 flex items-center justify-center overflow-hidden">
        {coverPic ? (
          <img src={coverPic} alt="Cover" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <ImageIcon size={32} />
            <span className="text-xs mt-2 uppercase font-bold">{t("Add Cover Photo")}</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isLoading} />
        <div className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full border border-white/10 z-0">
          <Camera size={16} className="text-white" />
        </div>
      </div>

      {/* Profile Photo & Info */}
      <div className="px-4 relative pb-4 border-b border-gray-800">
        <div className="flex justify-between items-end -mt-12 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#111827] border-4 border-[#0a1014] overflow-hidden flex items-center justify-center">
              {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : <Camera size={30} className="text-cyan-500" />}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isLoading} />
          </div>
          
          <button className="bg-[#111827] border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
            <Box size={16} /> {t("3D Avatar")}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-black uppercase tracking-wide">{t("Setup Profile")}</h2>
          <p className="text-cyan-400 text-[10px] font-bold tracking-widest mb-3">ID: {user?.trinetraId || 'TRN-NEW'}</p>
          
          <textarea 
            placeholder={t("Write your bio here... (FB/Insta Style)")}
            className="bg-[#111827] border border-gray-800 w-full p-3 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-cyan-500 resize-none"
            rows="3" value={bio} onChange={(e) => setBio(e.target.value)} disabled={isLoading}
          />
        </div>
      </div>

      {/* Point 3: Skip Option and Complete */}
      <div className="mt-auto p-6 flex flex-col gap-4">
        <button onClick={saveProfile} disabled={isLoading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
          {isLoading ? t("Saving...") : <>{t("Save Profile")} <ArrowRight size={20} /></>}
        </button>
        <button onClick={onComplete} disabled={isLoading} className="w-full text-gray-500 font-bold uppercase text-xs hover:text-white py-2">
          {t("Skip for now")}
        </button>
      </div>
    </div>
  );
}
