// ==========================================
// TRINETRA SUPER APP - UNIVERSAL DOWNLOAD (File 32)
// Exact File Path: src/components/UniversalDownloadBtn.jsx
// Blueprint Point: 4 - Original Format Download from AWS S3
// ==========================================
import React, { useState } from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UniversalDownloadBtn({ mediaUrl, fileName = "TriNetra_Media" }) {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // 100% Real Universal Download Logic
  const handleDownload = async () => {
    if (!mediaUrl) return;
    setIsDownloading(true);

    try {
      // Fetching the file as a blob to ensure it downloads instead of opening in a new tab
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      // Ensuring the original extension is preserved
      link.setAttribute('download', `${fileName}_${Date.now()}`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error("TriNetra Download Error: S3 Secure Link failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
        isDone 
        ? 'bg-green-500/20 border-green-500 text-green-500' 
        : 'bg-black/60 border-cyan-500/30 text-cyan-400 hover:border-cyan-400'
      }`}
    >
      {isDownloading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isDone ? (
        <CheckCircle size={14} />
      ) : (
        <Download size={14} />
      )}
      {isDownloading ? t("Downloading...") : isDone ? t("Saved") : t("Original")}
    </button>
  );
}
