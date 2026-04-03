import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Box, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render, No MongoDB) 🔥
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

const client = generateClient();

export default function ProfileSetup({ currentUser, onComplete }) {
  const { t } = useTranslation();
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ─── 1. REAL DIRECT AWS S3 UPLOAD (No Backend Middleman) ───────────
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError('');
    
    try {
      // Unique File Name Generation
      const fileName = `${type}_pics/${currentUser?.trinetraId || 'NEW_USER'}_${Date.now()}_${file.name}`;
      
      // 🔥 Direct Upload to AWS S3 Bucket
      await uploadData({
        path: `public/${fileName}`,
        data: file,
        options: {
          contentType: file.type,
          accessLevel: 'guest' // Public readable for profile pics
        }
      }).result;

      // 🔥 Instantly fetch the public CDN URL from AWS
      const urlResult = await getUrl({ path: `public/${fileName}` });
      const s3Url = urlResult.url.toString();

      if (type === 'profile') setProfilePic(s3Url);
      if (type === 'cover') setCoverPic(s3Url);

    } catch (err) {
      console.error("❌ AWS S3 Upload Failed:", err);
      setError(t("Upload failed to secure AWS server."));
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. REAL AWS APPSYNC PROFILE SAVE (DynamoDB) ────────────────────
  const saveProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      // 🔥 AWS GraphQL Mutation to update user record in DynamoDB
      const mutation = `
        mutation UpdateTriNetraProfile($userId: ID!, $bio: String, $profilePic: String, $coverPic: String) {
          updateUserProfile(id: $userId, bio: $bio, profilePicUrl: $profilePic, coverPicUrl: $coverPic) {
            id
            status
          }
        }
      `;
      
      await client.graphql({
        query: mutation,
        variables: { 
          userId: currentUser?.trinetraId || 'UNKNOWN_ID',
          bio: bio,
          profilePic: profilePic,
          coverPic: coverPic
        }
      });

      // Point 3: Entry granted to Home Screen
      onComplete(); 
    } catch (err) {
      console.error("❌ AWS DB Save Error:", err);
      setError(t("Profile save error on AWS Backend."));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-y-auto font-sans animate-fade-in">
      
      {/* 100% Real Cover Photo Area (Direct S3) */}
      <div className="relative h-48 bg-[#111827] border-b border-cyan-500/20 flex items-center justify-center overflow-hidden shadow-inner">
        {coverPic ? (
          <img src={coverPic} alt="Cover" className="w-full h-full object-cover opacity-90 transition-opacity" />
        ) : (
          <div className="flex flex-col items-center text-gray-500 hover:text-cyan-400 transition-colors">
            <ImageIcon size={32} />
            <span className="text-xs mt-2 uppercase font-bold tracking-widest">{t("Add Cover Photo")}</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isLoading} />
        <div className="absolute bottom-2 right-2 bg-black/80 p-2 rounded-full border border-gray-700 z-0 shadow-lg">
          <Camera size={16} className="text-white" />
        </div>
      </div>

      {/* 100% Real Profile Photo & Details */}
      <div className="px-4 relative pb-4 border-b border-gray-800">
        <div className="flex justify-between items-end -mt-12 mb-4">
          
          {/* Profile Picture Circle */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#111827] border-4 border-[#0a1014] overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all group-hover:border-cyan-500">
              {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : <Camera size={30} className="text-cyan-500" />}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isLoading} />
          </div>
          
          {/* Blueprint Point 3: 3D Avatar Option */}
          <button className="bg-[#111827] border border-cyan-500/50 hover:bg-cyan-500 hover:text-black text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg">
            <Box size={16} /> {t("3D Avatar")}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {t("Setup Profile")}
          </h2>
          <p className="text-cyan-400 text-[10px] font-bold tracking-widest mb-4 flex items-center gap-2">
            ID: {currentUser?.trinetraId || 'TRN-NEW-USER'}
          </p>
          
          {error && <p className="text-red-400 bg-red-900/20 p-2 rounded border border-red-900 text-[10px] font-bold mb-3 uppercase tracking-widest text-center">{error}</p>}

          <textarea 
            placeholder={t("Write your bio here... (FB/Insta Style)")}
            className="bg-[#111827] border border-gray-800 w-full p-4 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 resize-none shadow-inner transition-colors"
            rows="3" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Blueprint Point 3: Actions (Save or Skip) */}
      <div className="mt-auto p-6 flex flex-col gap-3">
        <button 
          onClick={saveProfile} 
          disabled={isLoading || (!bio && !profilePic && !coverPic)} 
          className={`w-full font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${(!bio && !profilePic && !coverPic) ? 'bg-gray-800 text-gray-600' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]'}`}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>{t("Save Profile")} <ArrowRight size={20} /></>}
        </button>
        
        <button 
          onClick={onComplete} 
          disabled={isLoading} 
          className="w-full text-gray-500 font-bold uppercase tracking-widest text-[10px] hover:text-white py-3 transition-colors active:scale-95"
        >
          {t("Skip for now")}
        </button>
      </div>
    </div>
  );
}
