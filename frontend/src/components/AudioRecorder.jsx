// ==========================================
// TRINETRA SUPER APP - AUDIO RECORDER (File 31)
// Exact File Path: src/components/AudioRecorder.jsx
// Blueprint Point: 4 & 5 - Real Mic / Voice Note Support
// ==========================================
import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2, Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function AudioRecorder({ onUploadSuccess, userId }) {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);

  // 100% Real Mic Access & Recording
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
    } catch (err) { alert(t("Mic access denied.")); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const deleteRecording = () => setAudioBlob(null);

  // 100% Real Upload to TriNetra AWS S3
  const uploadVoiceNote = async () => {
    if (!audioBlob) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('media', audioBlob, `voice_note_${Date.now()}.mp3`);
    formData.append('userId', userId);
    formData.append('uploadType', 'voice_note');

    try {
      const res = await axios.post('https://trinetra-umys.onrender.com/api/chat/upload-media', formData);
      onUploadSuccess(res.data.url);
      setAudioBlob(null);
    } catch (err) { alert(t("Failed to upload Voice Note.")); }
    finally { setIsUploading(false); }
  };

  return (
    <div className="flex items-center gap-3 bg-[#111827] p-2 rounded-2xl border border-gray-800 shadow-xl">
      {!audioBlob ? (
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-cyan-500 text-black'}`}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </button>
      ) : (
        <div className="flex items-center gap-4 px-2">
          <button onClick={deleteRecording} className="text-red-500 hover:text-red-400"><Trash2 size={20}/></button>
          <div className="h-2 w-24 bg-cyan-900 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-400 w-full animate-pulse"></div>
          </div>
          <button onClick={uploadVoiceNote} disabled={isUploading} className="bg-cyan-500 p-3 rounded-xl text-black">
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      )}
      {isRecording && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{t("Recording...")}</span>}
    </div>
  );
}
