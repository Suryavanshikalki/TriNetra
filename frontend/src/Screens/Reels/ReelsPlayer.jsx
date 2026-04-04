// ==========================================
// TRINETRA SUPER APP - REELS PLAYER (File 10)
// Exact Path: src/screens/Reels/ReelsPlayer.jsx
// ==========================================
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Download, Music, UserPlus, Check, Loader2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function ReelsPlayer({ reels = [], currentUser, onOpenComments, onBoostReel }) {
  const { t } = useTranslation();
  
  const [likedReels, setLikedReels] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [isActionLoading, setIsActionLoading] = useState({});
  
  const videoRefs = useRef({});

  // ─── 1. REAL-TIME INTERSECTION OBSERVER (Smooth Auto-Play) ────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => console.log("Autoplay blocked"));
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.8 } // 80% visibility required for play
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reels]);

  // ─── 2. TRUE UNIVERSAL DOWNLOAD (Point 4: Force Save to Gallery) ──
  const handleDownload = async (url, reelId) => {
    if (!url) return;
    setIsActionLoading(prev => ({ ...prev, [reelId]: true }));
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `TriNetra_Reel_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Download Failed:", err);
    } finally {
      setIsActionLoading(prev => ({ ...prev, [reelId]: false }));
    }
  };

  // ─── 3. REAL AWS LIKE MUTATION ────────────────────────────────────
  const handleLike = async (reelId) => {
    const isLiked = likedReels.has(reelId);
    
    // Optimistic UI Update
    const newLiked = new Set(likedReels);
    if (isLiked) newLiked.delete(reelId);
    else newLiked.add(reelId);
    setLikedReels(newLiked);

    try {
      await client.graphql({
        query: `mutation LikeReel($id: ID!, $userId: ID!) { 
          likeTriNetraReel(id: $id, userId: $userId) { id likesCount } 
        }`,
        variables: { id: reelId, userId: currentUser?.trinetraId }
      });
    } catch (error) {
      console.error("AWS Like Error");
    }
  };

  // ─── 4. REAL AWS FOLLOW (Mutual Connection Start) ────────────────
  const handleFollow = async (targetUserId) => {
    if (!currentUser || currentUser.trinetraId === targetUserId) return;

    const newFollowed = new Set(followedUsers);
    newFollowed.add(targetUserId);
    setFollowedUsers(newFollowed);

    try {
      await client.graphql({
        query: `mutation FollowUser($reqId: ID!, $recId: ID!) { 
          sendConnectionRequest(requesterId: $reqId, receiverId: $recId) { status } 
        }`,
        variables: { reqId: currentUser.trinetraId, recId: targetUserId }
      });
    } catch (error) {
      console.error("AWS Follow Error");
    }
  };

  return (
    <div className="h-screen w-full bg-black snap-y snap-mandatory overflow-y-scroll hide-scrollbar scroll-smooth">
      {reels.map((reel) => {
        const isLiked = likedReels.has(reel._id) || reel.isLikedByMe;
        const isFollowed = followedUsers.has(reel.userId) || reel.isFollowedByMe;

        return (
          <div key={reel._id} className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
            
            <video 
              ref={el => videoRefs.current[reel._id] = el}
              src={reel.videoUrl} 
              className="h-full w-full object-cover" 
              loop 
              playsInline 
              onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
            />

            {/* ⚡ Right Action Sidebar (Premium Design) */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-5 items-center z-20">
              
              {/* Creator Profile with Follow Plus */}
              <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500 p-0.5 bg-black shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <img src={reel.avatar || "https://trinetra-logo.png"} className="w-full h-full rounded-full object-cover" alt="user" />
                </div>
                {!isFollowed && currentUser?.trinetraId !== reel.userId && (
                  <button 
                    onClick={() => handleFollow(reel.userId)}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-cyan-500 text-black rounded-full p-0.5 border-2 border-black"
                  >
                    <UserPlus size={12} strokeWidth={4} />
                  </button>
                )}
              </div>

              {/* Like */}
              <div className="flex flex-col items-center">
                  <button onClick={() => handleLike(reel._id)} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 active:scale-75 transition-all">
                      <Heart size={26} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
                  </button>
                  <span className="text-[10px] font-black text-white mt-1 drop-shadow-md">{reel.likesCount || 0}</span>
              </div>
              
              {/* Comment */}
              <div className="flex flex-col items-center">
                  <button onClick={() => onOpenComments(reel._id)} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 active:scale-75 transition-all">
                      <MessageCircle size={26} className="text-white" />
                  </button>
                  <span className="text-[10px] font-black text-white mt-1">{reel.commentsCount || 0}</span>
              </div>

              {/* 💸 Point 6: Boost Button (Bijli) */}
              <button onClick={() => onBoostReel(reel._id)} className="p-3 bg-gradient-to-br from-violet-600 to-cyan-600 rounded-full border border-white/20 shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-75 transition-all">
                 <Zap size={26} className="text-white fill-white" />
              </button>

              {/* Universal Download (Original Format) */}
              <button onClick={() => handleDownload(reel.videoUrl, reel._id)} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white active:scale-75 transition-all">
                 {isActionLoading[reel._id] ? <Loader2 size={26} className="animate-spin text-cyan-400" /> : <Download size={26} />}
              </button>

              {/* Share */}
              <button onClick={() => navigator.share({ url: reel.videoUrl })} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 active:scale-75 transition-all">
                  <Share2 size={26} className="text-white" />
              </button>
            </div>

            {/* 📝 Bottom Info (Caption & Audio) */}
            <div className="absolute left-0 bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/40 to-transparent z-10">
              <h4 className="font-black text-sm tracking-wide text-white mb-2 flex items-center gap-2">
                @{reel.username} {isFollowed && <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-widest">{t("Requested")}</span>}
              </h4>
              <p className="text-xs text-gray-200 line-clamp-2 mb-4 pr-20 leading-relaxed font-medium">{reel.caption}</p>
              
              <div className="flex items-center gap-2">
                  <div className="bg-white/10 backdrop-blur-lg p-2 rounded-full animate-spin-slow">
                     <Music size={14} className="text-cyan-400" />
                  </div>
                  <marquee className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest w-40">
                      {reel.audioName || t("Original Audio - TriNetra Beats")}
                  </marquee>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
