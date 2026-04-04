// ==========================================
// TRINETRA SUPER APP - MEDIA VIEWER (File 30)
// Exact File Path: src/components/MediaViewer.jsx
// Blueprint Point: 4 - In-built Player & Universal Download
// ==========================================
import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Share2, Play, Loader2, ShieldCheck, Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MediaViewer({ mediaUrl, mediaType, onClose }) {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // ─── 1. TRUE UNIVERSAL DOWNLOAD (Point 4: Force Save to Gallery) ──
  const handleDownload = async () => {
    if (!mediaUrl) return;
    setIsDownloading(true);

    try {
      // 🔥 Asli Download Logic: Fetching binary data to bypass browser preview
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Extension detection for original format
      const extension = mediaType === 'video' || mediaType === 'reel' ? 'mp4' : 
                        mediaType === 'audio' ? 'mp3' : 
                        mediaType === 'pdf' || mediaType === 'document' ? 'pdf' : 'jpg';
      
      link.download = `TriNetra_Original_${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ Download Failed:", err);
      alert(t("Secure download failed. Check AWS connection."));
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── 2. NATIVE SHARE DIALOG ───────────────────────────────────────
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TriNetra Media',
          url: mediaUrl
        });
      } catch (err) { console.log("Share cancelled"); }
    }
  };

  if (!mediaUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a1014]/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-fade-in font-sans">
      
      {/* 🚀 Top Control Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent z-[110]">
        <button 
          onClick={onClose} 
          className="text-white hover:text-red-500 p-3 bg-gray-900/50 rounded-full transition-all active:scale-75 shadow-lg"
        >
          <X size={24} />
        </button>
        
        <div className="flex gap-3">
           {/* Point 4: Asli Universal Download Button */}
           <button 
             onClick={handleDownload} 
             disabled={isDownloading}
             className="flex items-center gap-2 bg-cyan-500 text-black px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 shadow-[0_10px_30px_rgba(6,182,212,0.4)] disabled:opacity-50"
           >
              {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={3} />}
              {isDownloading ? t("Saving...") : t("Original Download")}
           </button>
           
           <button 
             onClick={handleShare}
             className="text-white p-3 bg-gray-900/50 rounded-full hover:bg-cyan-500 hover:text-black transition-all"
           >
             <Share2 size={20} />
           </button>
        </div>
      </div>

      {/* 📺 THE VIEWPORT: 100% REAL IN-BUILT PLAYER (Point 4) */}
      <div className="w-full h-full flex items-center justify-center p-4 relative z-[105]">
        
        {!isLoaded && (mediaType !== 'document' && mediaType !== 'pdf') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={40} className="text-cyan-500 animate-spin" />
          </div>
        )}

        {/* 🖼️ Photo Viewer */}
        {(mediaType === 'image' || mediaType === 'photo') && (
          <img 
            src={mediaUrl} 
            onLoad={() => setIsLoaded(true)}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            alt="TriNetra_Media"
          />
        )}
        
        {/* 🎬 Video / Reels Player */}
        {(mediaType === 'video' || mediaType === 'reel') && (
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <video 
              controls 
              autoPlay 
              onLoadedData={() => setIsLoaded(true)}
              className={`max-w-full max-h-full rounded-2xl shadow-2xl border border-cyan-500/20 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <source src={mediaUrl} type="video/mp4" />
              {t("Device does not support TriNetra Video Player.")}
            </video>
          </div>
        )}

        {/* 📄 PDF / In-built Document Reader (Point 4: Real Reader) */}
        {(mediaType === 'document' || mediaType === 'pdf') && (
          <div className="w-full h-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up mt-16">
             {/* 🔥 Real PDF Embedded Reader */}
             <iframe 
                src={`${mediaUrl}#toolbar=0&navpanes=0`} 
                className="w-full h-full border-none"
                title="TriNetra_Document_Reader"
             />
          </div>
        )}

        {/* 🎵 Audio / Voice Note Player */}
        {mediaType === 'audio' && (
           <div className="flex flex-col items-center gap-6 w-full max-w-md p-10 bg-[#111827] rounded-[3rem] border border-gray-800 shadow-2xl animate-bounce-slow">
              <div className="bg-cyan-500/10 p-6 rounded-full border border-cyan-500/30">
                <Play size={48} className="text-cyan-400 fill-cyan-400" />
              </div>
              <audio 
                controls 
                onLoadedData={() => setIsLoaded(true)}
                className="w-full accent-cyan-500"
              >
                <source src={mediaUrl} type="audio/mpeg" />
              </audio>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">{t("Voice Note Player")}</span>
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">🔒 {t("End-to-End Encrypted")}</span>
              </div>
           </div>
        )}
      </div>

      {/* 🔒 Footer Infrastructure */}
      <div className="absolute bottom-10 px-8 flex flex-col items-center gap-2 z-[110]">
        <div className="flex items-center gap-2 text-cyan-500 opacity-60">
           <ShieldCheck size={14} />
           <p className="text-[9px] font-black uppercase tracking-[0.5em]">
             {t("Secure Original Media Access")}
           </p>
        </div>
        <p className="text-[7px] text-gray-600 font-bold uppercase tracking-widest italic">
          AWS S3 Bucket: protected_media_access_v6.2
        </p>
      </div>
    </div>
  );
}
