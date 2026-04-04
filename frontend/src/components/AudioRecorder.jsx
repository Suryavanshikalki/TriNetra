// ==========================================
// TRINETRA SUPER APP - AUDIO RECORDER (File 31)
// Exact File Path: src/components/AudioRecorder.jsx
// Blueprint Point: 4 & 5 - Real Mic / Voice Note / Universal Download
// ==========================================
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Send, Loader2, Download, Play, Pause, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy) 🔥
import { uploadData, getUrl } from 'aws-amplify/storage';

export default function AudioRecorder({ onUploadSuccess, currentUser, receiverId }) {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  // ─── 1. REAL MIC ACCESS & TIMER LOGIC ─────────────────────────────
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mpeg' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert(t("Mic access denied. Secure Satellite Link required."));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ─── 2. TRUE UNIVERSAL DOWNLOAD (Point 4: Save to Gallery) ────────
  const handleDownloadLocally = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TriNetra_Voice_${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ─── 3. REAL AWS S3 UPLOAD (Point 5: Secure Voice Note) ────────────
  const uploadVoiceNote = async () => {
    if (!audioBlob || !currentUser?.trinetraId) return;
    setIsUploading(true);

    try {
      // Secure Path: protected/voice_notes/sender_to_receiver/timestamp.mp3
      const fileName = `voice_notes/${currentUser.trinetraId}_to_${receiverId}/${Date.now()}.mp3`;
      
      // 🔥 Direct Upload to AWS S3
      await uploadData({
        path: `protected/${fileName}`,
        data: audioBlob,
        options: { contentType: 'audio/mpeg', accessLevel: 'authenticated' }
      }).result;

      // Get secure CDN URL for the chat message
      const urlResult = await getUrl({ path: `protected/${fileName}` });
      const finalUrl = urlResult.url.toString();

      onUploadSuccess(finalUrl, 'audio'); // Trigger chat message send
      setAudioBlob(null);
    } catch (err) {
      console.error("❌ AWS Voice Upload Failed:", err);
      alert(t("Failed to sync Voice Note to AWS."));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 animate-fade-in-up">
      <div className="flex items-center gap-3 bg-[#111827]/90 backdrop-blur-xl p-3 rounded-[2rem] border border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        
        {!audioBlob ? (
          <div className="flex items-center gap-4 flex-1 px-2">
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-5 rounded-full transition-all active:scale-90 shadow-lg ${isRecording ? 'bg-red-500 animate-pulse shadow-red-500/20' : 'bg-cyan-500 text-black shadow-cyan-500/20'}`}
            >
              {isRecording ? <Square size={22} fill="currentColor" /> : <Mic size={22} />}
            </button>
            
            {isRecording ? (
              <div className="flex flex-col">
                <span className="text-xs font-black text-red-500 uppercase tracking-widest">{t("Live Recording")}</span>
                <span className="text-lg font-black text-white tabular-nums">{formatTime(timer)}</span>
              </div>
            ) : (
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t("Tap to record voice note")}</span>
            )}

            {/* 🔊 Live Waveform Visualizer (CSS Animation) */}
            {isRecording && (
              <div className="flex items-end gap-1 h-6 ml-auto pr-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={`w-1 bg-cyan-500 rounded-full animate-voice-bar delay-${i*100}`} style={{ height: `${Math.random() * 100}%` }}></div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1 px-2">
            {/* Delete */}
            <button onClick={() => setAudioBlob(null)} className="p-3 bg-gray-800 text-gray-400 rounded-full hover:text-red-500 transition-colors">
              <Trash2 size={20}/>
            </button>

            {/* Play Preview (Visual Placeholder) */}
            <div className="flex-1 bg-[#0a1014] h-12 rounded-2xl border border-gray-800 flex items-center px-4 gap-3">
               <Play size={16} className="text-cyan-400" />
               <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-1/3"></div>
               </div>
               <span className="text-[10px] font-bold text-gray-500">0:00</span>
            </div>

            {/* 🔥 POINT 4: UNIVERSAL DOWNLOAD BUTTON */}
            <button 
              onClick={handleDownloadLocally}
              title={t("Download to Gallery")}
              className="p-3 bg-gray-800 text-cyan-400 rounded-full hover:bg-cyan-500 hover:text-black transition-all"
            >
              <Download size={20}/>
            </button>

            {/* Send to AWS */}
            <button 
              onClick={uploadVoiceNote} 
              disabled={isUploading} 
              className="bg-cyan-500 p-4 rounded-full text-black shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} fill="currentColor" />}
            </button>
          </div>
        )}
      </div>

      {/* 🔒 Encryption Tag */}
      <div className="flex items-center justify-center gap-2 opacity-50">
        <ShieldCheck size={10} className="text-green-500" />
        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">AWS S3 Encrypted Payload</span>
      </div>
    </div>
  );
}
