// File: src/components/MediaViewer.jsx
import React from 'react';
import { PlayCircle, FileText, X } from 'lucide-react';

export default function MediaViewer({ type, url, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded-full cursor-pointer" onClick={onClose}>
        <X className="text-white" />
      </div>

      {type === 'video' && (
        <div className="w-full max-w-lg aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700 relative">
          <PlayCircle size={64} className="text-green-500 absolute" />
          <span className="text-gray-500">Video Player Component</span>
        </div>
      )}

      {type === 'pdf' && (
        <div className="w-full max-w-lg h-[80vh] bg-gray-200 rounded-xl flex flex-col items-center justify-center text-black">
          <FileText size={64} className="text-red-500 mb-4" />
          <h2 className="font-bold">In-Built PDF Reader</h2>
          <p className="text-sm">Document.pdf</p>
        </div>
      )}

      {type === 'audio' && (
        <div className="w-full max-w-sm bg-gray-900 p-6 rounded-2xl flex items-center space-x-4">
          <PlayCircle size={40} className="text-green-500 cursor-pointer" />
          <div className="flex-1 h-2 bg-gray-700 rounded-full relative">
            <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
