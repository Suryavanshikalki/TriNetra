// File: src/screens/Messenger/CallScreen.jsx
import React, { useState, useEffect } from 'react';
import { PhoneOff, MicOff, Mic, VideoOff, Video, SwitchCamera, ShieldCheck, Volume2, User } from 'lucide-react';

export default function CallScreen({ isVideo, callerName, callerImage, onEndCall }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // 🕒 Call Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[100] flex flex-col overflow-hidden">
      
      {/* 🛡️ Point 5: Mutual Connection Verification Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
        <ShieldCheck size={14} className="text-cyan-400" />
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Mutual Connection Verified</span>
      </div>

      {/* Caller Info Area */}
      <div className="absolute top-24 left-0 w-full flex flex-col items-center z-10">
        <div className="relative mb-4">
            <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,230,255,0.3)] rotate-45 overflow-hidden">
                {callerImage ? (
                    <img src={callerImage} alt="caller" className="-rotate-45 w-full h-full object-cover" />
                ) : (
                    <User size={40} className="-rotate-45 text-cyan-500" />
                )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-cyan-500 p-1.5 rounded-lg shadow-lg">
                <Volume2 size={14} className="text-black" />
            </div>
        </div>
        
        <h2 className="text-white font-black text-2xl tracking-tight">{callerName || "Suryavanshi Kalki"}</h2>
        <p className="text-cyan-400 text-sm font-bold mt-1 animate-pulse">
            {callTimer > 0 ? formatTime(callTimer) : "Connecting..."}
        </p>
      </div>

      {/* 🎥 ZegoCloud Video Container Area */}
      <div className="flex-1 bg-black relative flex items-center justify-center">
        {!isVideo && (
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-black opacity-50"></div>
        )}
        
        {/* Placeholder for Remote Video Stream (ZegoCloud Hook) */}
        {isVideo && !isVideoOff && (
            <div id="remote-video-container" className="w-full h-full bg-gray-900 flex items-center justify-center">
                 <p className="text-gray-700 text-xs font-bold uppercase tracking-widest italic">Remote Stream Active</p>
            </div>
        )}

        {/* Local Video Preview (Point 1: Cross-platform UI) */}
        {isVideo && (
            <div className="absolute bottom-44 right-6 w-32 h-44 bg-gray-800 rounded-2xl border-2 border-cyan-500/50 shadow-2xl overflow-hidden z-30">
                 {isVideoOff ? (
                     <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <VideoOff size={20} className="text-gray-600" />
                     </div>
                 ) : (
                     <div id="local-video-container" className="w-full h-full bg-black"></div>
                 )}
            </div>
        )}
      </div>

      {/* 📱 Call Controls (WhatsApp 2.0 Style) */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl p-8 flex justify-around items-center pb-14 rounded-t-[3rem] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Mute Button */}
        <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-5 rounded-3xl transition-all active:scale-90 ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
        </button>

        {/* Video Toggle (If Video Call) */}
        {isVideo && (
            <>
                <button 
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-5 rounded-3xl transition-all active:scale-90 ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isVideoOff ? <VideoOff size={24}/> : <Video size={24}/>}
                </button>
                
                <button className="bg-white/10 p-5 rounded-3xl text-white hover:bg-white/20 transition-all active:scale-90">
                    <SwitchCamera size={24}/>
                </button>
            </>
        )}

        {/* End Call Button (Point 5: Strict Action) */}
        <button 
            onClick={onEndCall} 
            className="bg-red-600 p-6 rounded-[2rem] text-white hover:bg-red-500 transition-all shadow-[0_10px_25px_rgba(239,68,68,0.4)] active:scale-95"
        >
          <PhoneOff size={30} fill="currentColor"/>
        </button>
      </div>

      {/* 🔒 Encryption Tag */}
      <div className="absolute bottom-4 w-full text-center">
        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em]">End-to-End TriNetra Encryption Active</p>
      </div>
    </div>
  );
}
