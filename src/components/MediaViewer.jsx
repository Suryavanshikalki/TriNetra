import React from 'react';
import { X, Download, Maximize, Play, FileText, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UniversalMediaViewer({ mediaUrl, mediaType, onClose }) {
  const { t } = useTranslation();

  // Point 4: Universal Download Logic (Original Quality from S3)
  const handleDownload = () => {
    if (!mediaUrl) return;
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.target = '_blank';
    link.download = `TriNetra_Original_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
      
      {/* Viewer Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="text-white hover:text-red-500 transition-colors"><X size={28} /></button>
        <div className="flex gap-6">
           <button onClick={handleDownload} className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95">
              <Download size={18} /> {t("Original")}
           </button>
           <button className="text-white"><Share2 size={24} /></button>
        </div>
      </div>

      {/* Real In-built Player Logic (Point 4) */}
      <div className="w-full h-full max-h-[70vh] flex items-center justify-center p-4">
        {mediaType === 'image' && (
          <img src={mediaUrl} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10" alt="viewer"/>
        )}
        
        {mediaType === 'video' && (
          <video controls autoPlay className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/10">
            <source src={mediaUrl} type="video/mp4" />
            {t("Your device does not support the TriNetra Player.")}
          </video>
        )}

        {mediaType === 'document' || mediaType === 'pdf' && (
          <div className="flex flex-col items-center gap-6">
            <div className="bg-[#111827] p-10 rounded-3xl border border-gray-800 shadow-2xl">
               <FileText size={100} className="text-cyan-400" />
            </div>
            <p className="font-bold text-center uppercase tracking-widest text-sm">{t("PDF / Document Ready")}</p>
            <button onClick={handleDownload} className="bg-white text-black font-black px-8 py-3 rounded-2xl uppercase text-xs tracking-[0.2em]">{t("Open Original PDF")}</button>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 px-8 text-center">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em]">{t("TriNetra Universal Secure Player")}</p>
      </div>
    </div>
  );
}
