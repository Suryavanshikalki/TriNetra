// File: src/components/AudioRecorder.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, Send, Mic } from 'lucide-react';

export default function AudioRecorder({ onSend, onCancel }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 bg-gray-800 rounded-full flex items-center px-4 py-2 space-x-3 justify-between">
      <div className="flex items-center text-red-500 animate-pulse">
        <Mic size={16} className="mr-2" />
        <span className="font-mono text-sm">
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </span>
      </div>
      
      {/* Mock Waveform */}
      <div className="flex-1 flex items-center space-x-1 px-4 opacity-50">
        {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-3 bg-green-500 rounded-full"></div>)}
      </div>

      <div className="flex items-center space-x-4">
        <Trash2 onClick={onCancel} size={20} className="text-gray-400 cursor-pointer hover:text-red-500" />
        <Send onClick={() => onSend('audio_data')} size={20} className="text-green-500 cursor-pointer" />
      </div>
    </div>
  );
}
