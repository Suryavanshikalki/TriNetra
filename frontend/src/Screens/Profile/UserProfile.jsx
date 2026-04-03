import React, { useState, useEffect } from 'react';
import { Settings, Grid, PlaySquare, Bookmark, UserPlus, MessageCircle, UserCheck, Clock, ShieldAlert, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/UserContext';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function UserProfile({ profileId, onNavigateToChat }) {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  
  const [profileData, setProfileData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('NONE'); // NONE, PENDING, CONNECTED
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const isOwnProfile = currentUser?.trinetraId === profileId;

  // ─── 1. REAL AWS FETCH: PROFILE & CONNECTION STATUS ───────────────
  useEffect(() => {
    if (!profileId) return;
    
    const fetchProfileData = async () => {
      try {
        // Fetch Profile Details
        const resProfile = await client.graphql({
          query: `query GetUserProfile($id: ID!) { getUserProfile(id: $id) { id name bio profilePic coverPic followersCount followingCount postsCount } }`,
          variables: { id: profileId }
        });
        setProfileData(resProfile.data.getUserProfile);

        // Fetch Mutual Connection Status if it's not own profile
        if (!isOwnProfile && currentUser?.trinetraId) {
          const resConnection = await client.graphql({
            query: `query CheckConnection($requesterId: ID!, $receiverId: ID!) { checkTriNetraConnection(requesterId: $requesterId, receiverId: $receiverId) { status } }`,
            variables: { requesterId: currentUser.trinetraId, receiverId: profileId }
          });
          if (resConnection.data.checkTriNetraConnection) {
            setConnectionStatus(resConnection.data.checkTriNetraConnection.status);
          }
        }
      } catch (err) {
        console.error("❌ AWS Profile Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId, isOwnProfile, currentUser]);

  // ─── 2. REAL FOLLOW REQUEST LOGIC (Point 3: Mutual Rule) ──────────
  const handleFollowAction = async () => {
    setIsActionLoading(true);
    try {
      if (connectionStatus === 'NONE') {
        // Send Follow Request (Triggers AWS Notification to receiver)
        await client.graphql({
          query: `mutation SendFollowRequest($requesterId: ID!, $receiverId: ID!) { sendConnectionRequest(requesterId: $requesterId, receiverId: $receiverId) { status } }`,
          variables: { requesterId: currentUser?.trinetraId, receiverId: profileId }
        });
        setConnectionStatus('PENDING');
      } else if (connectionStatus === 'CONNECTED' || connectionStatus === 'PENDING') {
        // Unfollow / Cancel Request
        const confirmMsg = connectionStatus === 'CONNECTED' ? t("Unfollow this user? You will lose messaging access.") : t("Cancel follow request?");
        if (window.confirm(confirmMsg)) {
          await client.graphql({
            query: `mutation RemoveConnection($requesterId: ID!, $receiverId: ID!) { removeConnection(requesterId: $requesterId, receiverId: $receiverId) { status } }`,
            variables: { requesterId: currentUser?.trinetraId, receiverId: profileId }
          });
          setConnectionStatus('NONE');
        }
      }
    } catch (err) {
      alert(t("Action failed securely. Check connection."));
    } finally {
      setIsActionLoading(false);
    }
  };

  // ─── 3. STRICT MESSAGING GATEKEEPER (Point 5) ──────────────────────
  const handleMessageClick = () => {
    if (connectionStatus === 'CONNECTED') {
      onNavigateToChat(profileId);
    } else {
      alert(t("TriNetra Privacy: You can only message mutual connections. Please wait for them to accept your follow request."));
    }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center bg-[#0a1014]"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-20 font-sans animate-fade-in">
      
      {/* 100% Asli Cover & Avatar from AWS S3 */}
      <div className="h-48 bg-[#111827] relative border-b border-gray-800 shadow-inner">
        {profileData?.coverPic ? (
          <img src={profileData.coverPic} className="w-full h-full object-cover opacity-80" alt="cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black"></div>
        )}
        
        <div className="absolute -bottom-12 left-6">
          <div className="w-28 h-28 rounded-full border-4 border-[#0a1014] bg-[#111827] overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)]">
             {profileData?.profilePic ? (
               <img src={profileData.profilePic} className="w-full h-full object-cover" alt="avatar" />
             ) : (
               <div className="w-full h-full flex items-center justify-center font-black text-4xl text-cyan-500">
                 {profileData?.name?.charAt(0).toUpperCase() || 'T'}
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="mt-14 px-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{profileData?.name || "Unknown User"}</h1>
            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-1">ID: {profileId}</p>
          </div>
          
          {/* Action Buttons */}
          {isOwnProfile ? (
            <button className="bg-[#111827] border border-gray-800 hover:border-cyan-500 p-2.5 rounded-xl transition-all active:scale-90 shadow-lg text-gray-400 hover:text-cyan-400">
              <Settings size={20}/>
            </button>
          ) : (
            <div className="flex gap-2">
              
              {/* Mutual Connection Follow Button */}
              <button 
                onClick={handleFollowAction}
                disabled={isActionLoading}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg
                  ${connectionStatus === 'CONNECTED' ? 'bg-[#111827] border border-gray-700 text-white' : 
                    connectionStatus === 'PENDING' ? 'bg-yellow-500/10 border border-yellow-500/50 text-yellow-500' : 
                    'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}
                `}
              >
                {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : 
                 connectionStatus === 'CONNECTED' ? <><UserCheck size={16}/> {t("Following")}</> :
                 connectionStatus === 'PENDING' ? <><Clock size={16}/> {t("Requested")}</> :
                 <><UserPlus size={16}/> {t("Follow")}</>}
              </button>

              {/* Secure Message Button (Point 5 Restricted) */}
              <button 
                onClick={handleMessageClick}
                className={`p-2.5 rounded-xl border transition-all shadow-lg active:scale-90
                  ${connectionStatus === 'CONNECTED' ? 'bg-[#111827] border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black' : 'bg-gray-900 border-gray-800 text-gray-600'}
                `}
              >
                {connectionStatus === 'CONNECTED' ? <MessageCircle size={20}/> : <ShieldAlert size={20}/>}
              </button>
            </div>
          )}
        </div>
        
        <p className="mt-5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{profileData?.bio || t("No bio provided.")}</p>
        
        {/* Real Connection Stats (Point 3) */}
        <div className="flex gap-4 mt-6 border-y border-gray-800 py-4 justify-between px-2 bg-[#111827]/50 rounded-2xl">
          <div className="text-center flex-1"><p className="font-black text-lg text-white">{profileData?.postsCount || 0}</p><p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{t("Posts")}</p></div>
          <div className="w-[1px] bg-gray-800"></div>
          <div className="text-center flex-1"><p className="font-black text-lg text-white">{profileData?.followersCount || 0}</p><p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{t("Followers")}</p></div>
          <div className="w-[1px] bg-gray-800"></div>
          <div className="text-center flex-1"><p className="font-black text-lg text-white">{profileData?.followingCount || 0}</p><p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{t("Following")}</p></div>
        </div>

      </div>
    </div>
  );
}
