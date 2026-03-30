import React, { useState, useEffect } from 'react';
import { Settings, Grid, PlaySquare, Bookmark, UserPlus, MessageCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import api from '../../services/api';

export default function UserProfile({ profileId }) {
  const { user: currentUser } = useUser();
  const [profileData, setProfileData] = useState(null);
  const isOwnProfile = currentUser?.trinetraId === profileId;

  useEffect(() => {
    const getProfile = async () => {
      const res = await api.get(`/user/profile/${profileId}`);
      setProfileData(res.data.profile);
    };
    getProfile();
  }, [profileId]);

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-20">
      {/* 100% Asli Cover & Avatar */}
      <div className="h-40 bg-gray-800 relative">
        {profileData?.coverPic && <img src={profileData.coverPic} className="w-full h-full object-cover" />}
        <div className="absolute -bottom-10 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-[#0a1014] bg-gray-900 overflow-hidden">
             {profileData?.profilePic ? <img src={profileData.profilePic} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-2xl">T</div>}
          </div>
        </div>
      </div>

      <div className="mt-12 px-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black">{profileData?.name}</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">ID: {profileData?.trinetraId}</p>
          </div>
          {isOwnProfile ? (
            <button className="bg-[#111827] border border-gray-800 p-2 rounded-xl"><Settings size={20}/></button>
          ) : (
            <div className="flex gap-2">
              <button className="bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"><UserPlus size={16}/> {t("Follow")}</button>
              <button className="bg-[#111827] border border-gray-800 p-2 rounded-xl"><MessageCircle size={20}/></button>
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-gray-300 leading-relaxed">{profileData?.bio || "TriNetra User"}</p>
        
        {/* Connection Stats (Point 3) */}
        <div className="flex gap-8 mt-6 border-y border-gray-900 py-4 justify-around">
          <div className="text-center"><p className="font-black">{profileData?.postsCount || 0}</p><p className="text-[10px] text-gray-500 uppercase">{t("Posts")}</p></div>
          <div className="text-center"><p className="font-black">{profileData?.followersCount || 0}</p><p className="text-[10px] text-gray-500 uppercase">{t("Followers")}</p></div>
          <div className="text-center"><p className="font-black">{profileData?.followingCount || 0}</p><p className="text-[10px] text-gray-500 uppercase">{t("Following")}</p></div>
        </div>
      </div>
    </div>
  );
}
