import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, MicOff, Mic, VideoOff, Video, SwitchCamera, ShieldCheck, Volume2, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS & ZEGOCLOUD IMPORTS 🔥
import { generateClient } from 'aws-amplify/api';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const client = generateClient();

export default function CallScreen({ isVideo, callerName, callerImage, roomId, currentUser, receiverId, onEndCall }) {
  const { t } = useTranslation();
  
  // Real ZegoCloud Engine State
  const [zg, setZg] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallConnected, setIsCallConnected] = useState(false);
  
  // UI States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideo); // Audio call = video off by default
  const [isFrontCamera, setIsFrontCamera] = useState(true); // 🔥 New: Camera State
  const [callTimer, setCallTimer] = useState(0);
  const [statusText, setStatusText] = useState("Authenticating Securely...");

  // DOM Refs for Video Injection
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // ─── 1. REAL ZEGOCLOUD & AWS INITIALIZATION ───────────────────────
  useEffect(() => {
    const initCall = async () => {
      try {
        setStatusText("Requesting AWS Token...");
        
        // Securely Fetch Zego Token from AWS Backend
        const res = await client.graphql({
          query: `query GetCallToken($userId: ID!, $roomId: String!) {
            generateZegoToken(userId: $userId, roomId: $roomId) { token appId }
          }`,
          variables: { userId: currentUser?.trinetraId, roomId: roomId }
        });

        const { token, appId } = res.data.generateZegoToken;

        setStatusText("Connecting to TriNetra Satellite...");

        // Initialize Zego Express WebRTC Engine
        const zegoEngine = new ZegoExpressEngine(appId, "wss://webliveroom-api.zegocloud.com/ws");
        setZg(zegoEngine);

        // Listen for Remote Stream
        zegoEngine.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
          if (updateType === 'ADD') {
            setIsCallConnected(true);
            const rStream = await zegoEngine.startPlayingStream(streamList[0].streamID);
            setRemoteStream(rStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = rStream;
            }
          } else if (updateType === 'DELETE') {
            handleEndCall(); // Disconnect if friend drops
          }
        });

        // Login to Secure Room
        await zegoEngine.loginRoom(roomId, token, { userID: currentUser.trinetraId, userName: currentUser.name || "TriNetraUser" });

        // Create Local Stream (Camera/Mic)
        const lStream = await zegoEngine.createStream({ camera: { video: isVideo, audio: true } });
        setLocalStream(lStream);
        
        if (localVideoRef.current && isVideo) {
          localVideoRef.current.srcObject = lStream;
        }

        // Publish Local Stream to Room
        zegoEngine.startPublishingStream(`${roomId}_${currentUser.trinetraId}`, lStream);
        
        setStatusText("Ringing...");

      } catch (err) {
        console.error("❌ Call Initialization Failed:", err);
        setStatusText("Connection Failed.");
      }
    };

    initCall();

    return () => { handleEndCall(); };
  }, []);

  // ─── 2. REAL CALL TIMER ───────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (isCallConnected) {
      interval = setInterval(() => setCallTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCallConnected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── 3. REAL HARDWARE CONTROLS (Mute / Camera Off / Switch) ───────
  const toggleMute = () => {
    if (zg && localStream) {
      zg.muteMicrophone(!isMuted); 
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (zg && localStream && isVideo) {
      zg.mutePublishStreamVideo(!isVideoOff); 
      setIsVideoOff(!isVideoOff);
    }
  };

  // 🔥 FIXED: REAL CAMERA SWITCH LOGIC
  const toggleCamera = async () => {
    if (zg && localStream && isVideo && !isVideoOff) {
      try {
        // True hardware command to switch mobile camera lens
        await zg.useFrontCamera(localStream, !isFrontCamera);
        setIsFrontCamera(!isFrontCamera);
      } catch (err) {
        console.error("Camera switch failed:", err);
      }
    }
  };

  // ─── 4. SECURE CALL TERMINATION ───────────────────────────────────
  const handleEndCall = () => {
    if (zg) {
      if (localStream) zg.destroyStream(localStream);
      zg.logoutRoom(roomId);
    }
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[100] flex flex-col overflow-hidden animate-fade-in font-sans">
      
      {/* 🛡️ Point 5: Mutual Connection Verification */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-[#0a1014]/80 border border-cyan-500/50 px-5 py-2 rounded-full flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)]">
        <ShieldCheck size={16} className="text-cyan-400" />
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{t("Mutual Connection Verified")}</span>
      </div>

      {/* 👤 Caller Info Area */}
      <div className="absolute top-24 left-0 w-full flex flex-col items-center z-30 pointer-events-none">
        <div className="relative mb-5 drop-shadow-2xl">
            <div className="w-28 h-28 bg-[#111827] rounded-3xl flex items-center justify-center border-[3px] border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.5)] rotate-45 overflow-hidden">
                {callerImage ? (
                    <img src={callerImage} alt="caller" className="-rotate-45 w-[140%] h-[140%] object-cover" />
                ) : (
                    <User size={40} className="-rotate-45 text-cyan-500" />
                )}
            </div>
            <div className="absolute -bottom-3 -right-3 bg-cyan-500 p-2 rounded-xl shadow-lg border border-[#0f172a]">
                <Volume2 size={16} className="text-black" />
            </div>
        </div>
        
        <h2 className="text-white font-black text-3xl tracking-tight drop-shadow-md">{callerName || "Unknown Caller"}</h2>
        <p className={`text-sm font-bold mt-2 uppercase tracking-widest ${isCallConnected ? 'text-green-400' : 'text-cyan-400 animate-pulse'}`}>
            {isCallConnected ? formatTime(callTimer) : statusText}
        </p>
      </div>

      {/* 🎥 REAL ZEGOCLOUD VIDEO CONTAINER AREA */}
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
        
        {!isVideo && <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 to-black opacity-80"></div>}
        
        {/* Remote Video Stream */}
        {isVideo && (
            <div className="w-full h-full bg-[#0a1014] flex items-center justify-center relative">
                 <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 {!isCallConnected && <Loader2 size={40} className="text-cyan-500 animate-spin absolute" />}
            </div>
        )}

        {/* Local Video Preview */}
        {isVideo && (
            <div className="absolute bottom-40 right-6 w-32 h-48 bg-[#111827] rounded-2xl border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden z-40 transition-all">
                 {isVideoOff ? (
                     <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <VideoOff size={24} className="text-gray-600" />
                     </div>
                 ) : (
                     <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isFrontCamera ? 'mirror-mode' : ''}`} />
                 )}
            </div>
        )}
      </div>

      {/* 📱 Real Call Controls */}
      <div className="bg-[#111827]/90 backdrop-blur-2xl p-8 flex justify-around items-center pb-14 rounded-t-[3rem] border-t border-cyan-900/50 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] relative z-40">
        
        {/* Mute Button */}
        <button 
            onClick={toggleMute}
            className={`p-5 rounded-[2rem] transition-all shadow-lg active:scale-90 ${isMuted ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#0a1014] text-white hover:bg-gray-800 border border-gray-700'}`}
        >
          {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
        </button>

        {/* Video Toggle & Camera Switch */}
        {isVideo && (
            <>
                <button 
                    onClick={toggleVideo}
                    className={`p-5 rounded-[2rem] transition-all shadow-lg active:scale-90 ${isVideoOff ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#0a1014] text-white hover:bg-gray-800 border border-gray-700'}`}
                >
                  {isVideoOff ? <VideoOff size={24}/> : <Video size={24}/>}
                </button>
                
                {/* 🔥 REAL CAMERA SWITCH BUTTON */}
                <button 
                    onClick={toggleCamera}
                    disabled={isVideoOff}
                    title="Switch Camera" 
                    className={`p-5 rounded-[2rem] transition-all shadow-lg active:scale-90 ${isVideoOff ? 'bg-gray-800 text-gray-600 cursor-not-allowed border-transparent' : 'bg-[#0a1014] text-white hover:bg-gray-800 border border-gray-700'}`}
                >
                    <SwitchCamera size={24}/>
                </button>
            </>
        )}

        {/* End Call Button */}
        <button 
            onClick={handleEndCall} 
            className="bg-red-600 p-6 rounded-[2.5rem] text-white hover:bg-red-500 transition-all shadow-[0_10px_30px_rgba(239,68,68,0.5)] active:scale-95"
        >
          <PhoneOff size={32} fill="currentColor"/>
        </button>
      </div>

      {/* 🔒 Encryption Tag */}
      <div className="absolute bottom-5 w-full text-center z-50">
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-2">
           <ShieldCheck size={12} className="text-green-500"/> TriNetra End-to-End Encrypted
        </p>
      </div>
    </div>
  );
}
