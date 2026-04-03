// ==========================================
// TRINETRA SUPER APP - REELS PLAYER (File 10)
// Exact Path: src/screens/Reels/ReelsPlayer.jsx
// ==========================================
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Download, Music, UserPlus, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function ReelsPlayer({ reels = [], currentUser, onOpenComments }) {
  const { t } = useTranslation();
  
  // States for real-time UI updates (Optimistic UI)
  const [likedReels, setLikedReels] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  
  // Refs for tracking video elements to play/pause on scroll
  const videoRefs = useRef({});

  // 100% Real: Auto Play/Pause video when scrolling (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(e => console.log("Autoplay prevented by browser"));
          } else {
            video.pause();
            video.currentTime = 0; // Reset video when swiped away
          }
        });
      },
      { threshold: 0.6 } // When 60% of video is visible, it plays
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reels]);

  // 100% Real: Original Quality Download (Point 4)
  const handleDownload = (url) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `TriNetra_Reel_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 100% Real: API Call for Like
  const handleLike = async (reelId) => {
    const isLiked = likedReels.has(reelId);
    
    // Instant UI update
    const newLiked = new Set(likedReels);
    if (isLiked) newLiked.delete(reelId);
    else newLiked.add(reelId);
    setLikedReels(newLiked);

    try {
      await axios.post('https://trinetra-umys.onrender.com/api/reels/like', {
        reelId: reelId,
        userId: currentUser?.trinetraId,
        action: isLiked ? 'unlike' : 'like'
      });
    } catch (error) {
      console.error("Like API offline or failed");
      // Optional: Revert state if API fails
    }
  };

  // 100% Real: API Call for Follow (Mutual Connection Rule Starter)
  const handleFollow = async (targetUserId) => {
    if (!currentUser || currentUser.trinetraId === targetUserId) return;

    // Instant UI update
    const newFollowed = new Set(followedUsers);
    newFollowed.add(targetUserId);
    setFollowedUsers(newFollowed);

    try {
      await axios.post('https://trinetra-umys.onrender.com/api/user/follow', {
        followerId: currentUser.trinetraId,
        targetId: targetUserId
      });
    } catch (error) {
      console.error("Follow API offline or failed");
    }
  };

  // 100% Real: Native OS Share Dialog
  const handleShare = async (reel) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TriNetra Reel by @${reel.username}`,
          text: reel.caption,
          url: reel.videoUrl
        });
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback for PC/Unsupported browsers
      navigator.clipboard.writeText(reel.videoUrl);
      alert(t("Link copied to clipboard!"));
    }
  };

  return (
    <div className="h-screen w-full bg-black snap-y snap-mandatory overflow-y-scroll hide-scrollbar scroll-smooth">
      {reels.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
            {t("No Reels Available")}
        </div>
      ) : reels.map((reel) => {
        const isLiked = likedReels.has(reel._id) || reel.isLikedByMe;
        const isFollowed = followedUsers.has(reel.userId) || reel.isFollowedByMe;

        return (
          <div key={reel._id} className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden bg-black">
            
            <video 
              ref={el => videoRefs.current[reel._id] = el}
              src={reel.videoUrl} 
              className="h-full w-full object-cover" 
              loop 
              muted={false} // Users want sound on reels
              playsInline 
            />

            {/* Action Buttons */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-10">
              
              {/* Like Button */}
              <div className="flex flex-col items-center gap-1 group">
                  <button onClick={() => handleLike(reel._id)} className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:scale-75 transition-transform">
                      <Heart size={28} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
                  </button>
                  <span className="text-[10px] font-black text-white">
                    {isLiked ? (reel.likes + 1) : reel.likes}
                  </span>
              </div>
              
              {/* Comment Button (Triggers Parent Function) */}
              <div className="flex flex-col items-center gap-1 group">
                  <button onClick={() => onOpenComments && onOpenComments(reel._id)} className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:scale-75 transition-transform">
                      <MessageCircle size={28} className="text-white" />
                  </button>
                  <span className="text-[10px] font-black text-white">{reel.comments}</span>
              </div>

              {/* Download Button */}
              <button onClick={() => handleDownload(reel.videoUrl)} className="p-3 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-500/50 text-cyan-400 active:scale-75 transition-transform">
                 <Download size={28} />
              </button>

              {/* Share Button */}
              <button onClick={() => handleShare(reel)} className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:scale-75 transition-transform">
                  <Share2 size={24} className="text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="absolute left-0 bottom-20 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full border-2 border-cyan-500 overflow-hidden bg-gray-900">
                      {reel.avatar ? (
                        <img src={reel.avatar} className="w-full h-full object-cover" alt="user" />
                      ) : (
                        <span className="text-cyan-500 font-bold h-full w-full flex items-center justify-center">{reel.username?.charAt(0)}</span>
                      )}
                  </div>
                  <h4 className="font-black text-sm tracking-wide text-white">@{reel.username}</h4>
                  
                  {/* Follow Button Logic */}
                  {currentUser?.trinetraId !== reel.userId && !isFollowed && (
                    <button onClick={() => handleFollow(reel.userId)} className="bg-cyan-500 text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 active:scale-95">
                        <UserPlus size={10} /> {t("Follow")}
                    </button>
                  )}
                  {isFollowed && (
                    <span className="text-[9px] font-black uppercase flex items-center gap-1 text-cyan-400">
                       <Check size={10} /> {t("Requested")}
                    </span>
                  )}
              </div>
              <p className="text-xs text-gray-200 line-clamp-2 mb-4 pr-16">{reel.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
