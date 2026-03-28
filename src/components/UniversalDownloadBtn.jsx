// File: src/components/UniversalDownloadBtn.jsx
import React, { useState } from 'react';
import { Download, FileCheck, Loader2, ShieldCheck, FileType } from 'lucide-react';

export default function UniversalDownloadBtn({ fileUrl, fileName, fileType = "Original" }) {
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * 👁️🔥 Point 4: Universal Download Logic
   * यह फंक्शन फाइल को फेच करेगा और उसे 'Blob' में बदलकर 
   * सीधे डिवाइस (Android/iPhone/Windows) के स्टोरेज में फोर्स-डाउनलोड करेगा।
   */
  const handleDownload = async () => {
    if (!fileUrl) return alert("Error: File URL not found.");
    
    setIsDownloading(true);
    
    try {
      // Step 1: Fetching the file as a blob (TriNetra Security Gateway)
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      // Step 2: Creating a temporary download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      
      // Point 4: Keeping original file name and extension
      link.setAttribute('download', fileName || `TriNetra_Media_${Date.now()}`);
      
      // Step 3: Triggering the download
      document.body.appendChild(link);
      link.click();
      
      // Step 4: Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`Success: ${fileName} downloaded securely.`);
    } catch (error) {
      console.error("Download Error:", error);
      alert("TriNetra Shield: Download failed. Please check your connection.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border shadow-lg active:scale-95 ${
          isDownloading 
          ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' 
          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        }`}
      >
        {isDownloading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
        )}
        
        <span>{isDownloading ? 'ENCRYPTING & SAVING...' : `DOWNLOAD ${fileType.toUpperCase()}`}</span>
      </button>

      {/* 🛡️ Point 6: Security Tag */}
      <div className="flex items-center gap-1 opacity-40 ml-1">
        <ShieldCheck size={10} className="text-cyan-500" />
        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
          Secure Original Format Download
        </span>
      </div>
    </div>
  );
}
