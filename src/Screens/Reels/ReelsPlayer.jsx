// ==========================================
// TRINETRA SUPER APP - REELS PLAYER (File 10)
// Exact Path: src/screens/Reels/ReelsPlayer.jsx
// ==========================================
import React from 'react';
import { Heart, MessageCircle, Share2, Download, Music, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ReelsPlayer({ reels = [] }) {
  const { t } = useTranslation();

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `TriNetra_Reel_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-full bg-black snap-y snap-mandatory overflow-y-scroll hide-scrollbar scroll-smooth">
      {reels.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
            {t("No Reels Available")}
        </div>
      ) : reels.map((reel) => (
        <div key={reel._id} className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden">
          
          <video src={reel.videoUrl} className="h-full w-full object-cover" loop autoPlay muted playsInline />

          {/* Action Buttons */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-10">
            <div className="flex flex-col items-center gap-1 group">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <Heart size={28} className="text-white" />
                </div>
                <span className="text-[10px] font-black text-white">{reel.likes}</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 group">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <MessageCircle size={28} className="text-white" />
                </div>
                <span className="text-[10px] font-black text-white">{reel.comments}</span>
            </div>

            <button onClick={() => handleDownload(reel.videoUrl)} className="p-3 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-500/50 text-cyan-400">
               <Download size={28} />
            </button>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Share2 size={24} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="absolute left-0 bottom-20 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-500 overflow-hidden">
                    <img src={reel.avatar} className="w-full h-full object-cover" alt="user" />
                </div>
                <h4 className="font-black text-sm tracking-wide">@{reel.username}</h4>
                <button className="bg-cyan-500 text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                    <UserPlus size={10} /> {t("Follow")}
                </button>
            </div>
            <p className="text-xs text-gray-200 line-clamp-2 mb-4 pr-16">{reel.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
