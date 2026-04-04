// ==========================================
// TRINETRA SUPER APP - UNIVERSAL DOWNLOAD (File 32)
// Exact File Path: src/components/UniversalDownloadBtn.jsx
// Blueprint Point: 4 - Original Format Download from AWS S3
// ==========================================
import React, { useState } from 'react';
import { Download, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS & MONITORING IMPORTS (No Dummy Logic)
import { downloadData } from 'aws-amplify/storage';
import * as Sentry from "@sentry/react";

export default function UniversalDownloadBtn({ 
  mediaPath, // The S3 Key/Path (e.g., 'public/posts/video1.mp4')
  fileName = "TriNetra_Media",
  mediaType = "auto" 
}) {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // ─── 1. REAL UNIVERSAL DOWNLOAD LOGIC (Point 4) ───────────────────
  const handleDownload = async () => {
    if (!mediaPath) return;
    setIsDownloading(true);

    try {
      // 🔥 AWS Amplify Storage: Direct Secure Binary Download
      const { body } = await downloadData({
        path: mediaPath,
        options: {
          // Point 4: Accessing the original format securely
          accessLevel: 'guest', 
        }
      }).result;

      // Convert stream to blob
      const blob = await body.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Auto-detect extension from MIME type if possible
      const extensionMap = {
        'video/mp4': 'mp4',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'application/pdf': 'pdf',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav'
      };
      const ext = extensionMap[blob.type] || 'file';

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}_${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup Securely
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);

    } catch (err) {
      // 🔥 Real Sentry Logging for AWS Failures
      Sentry.captureException(err);
      console.error("❌ TriNetra S3 Download Failed:", err);
      alert(t("Secure Satellite Link Failed. Check AWS WAF Status."));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation(); // Prevents triggering parent clicks (like opening a post)
        handleDownload();
      }}
      disabled={isDownloading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-[1rem] border-2 transition-all active:scale-90 shadow-lg font-sans ${
        isDone 
        ? 'bg-green-500/20 border-green-500 text-green-500 shadow-green-500/10' 
        : 'bg-[#111827] border-gray-800 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/5 active:bg-cyan-500 active:text-black'
      }`}
    >
      <div className="relative">
        {isDownloading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isDone ? (
          <CheckCircle size={16} className="animate-bounce" />
        ) : (
          <Download size={16} strokeWidth={3} />
        )}
      </div>

      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
        {isDownloading ? t("Syncing...") : isDone ? t("Saved") : t("Original")}
      </span>

      {/* 🔒 Point 12H: Security Badge */}
      {!isDownloading && !isDone && (
        <div className="ml-1 opacity-20 group-hover:opacity-100">
           <ShieldAlert size={10} />
        </div>
      )}
    </button>
  );
}
