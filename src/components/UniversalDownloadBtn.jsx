// File: src/components/UniversalDownloadBtn.jsx
import React from 'react';
import { Download } from 'lucide-react';

export default function UniversalDownloadBtn({ fileUrl, fileName }) {
  
  const handleDownload = () => {
    // Original format download logic goes here
    alert(`${fileName} is downloading to your device storage...`);
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center bg-gray-800 hover:bg-gray-700 text-green-500 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-gray-700 shadow-sm"
    >
      <Download size={14} className="mr-2" />
      Download File
    </button>
  );
}
