// File: src/screens/Messenger/CallScreen.jsx
import React from 'react';
import { PhoneOff, MicOff, VideoOff, SwitchCamera } from 'lucide-react';

export default function CallScreen({ isVideo, onEndCall }) {
  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">
      {/* Caller Info */}
      <div className="absolute top-10 left-0 w-full flex flex-col items-center z-10">
        <div className="w-20 h-20 bg-gray-800 rounded-full mb-4 border-2 border-green-500 shadow-[0_0_15px_green]"></div>
        <h2 className="text-white font-bold text-xl">Suryavanshi Kalki</h2>
        <p className="text-green-500 text-sm mt-1">Calling...</p>
      </div>

      {/* ZegoCloud Container Area */}
      <div className="flex-1 bg-black relative">
        {/* Placeholder for Video Stream */}
        {isVideo && <div className="absolute bottom-40 right-6 w-28 h-40 bg-gray-800 rounded-xl border border-gray-600"></div>}
      </div>

      {/* Call Controls */}
      <div className="bg-gray-900 p-8 flex justify-between items-center pb-12 rounded-t-3xl border-t border-gray-800">
        <button className="bg-gray-800 p-4 rounded-full text-white hover:bg-gray-700 transition"><MicOff size={24}/></button>
        {isVideo && <button className="bg-gray-800 p-4 rounded-full text-white hover:bg-gray-700 transition"><SwitchCamera size={24}/></button>}
        {isVideo && <button className="bg-gray-800 p-4 rounded-full text-white hover:bg-gray-700 transition"><VideoOff size={24}/></button>}
        <button onClick={onEndCall} className="bg-red-600 p-5 rounded-full text-white hover:bg-red-500 transition shadow-[0_0_15px_red]"><PhoneOff size={28}/></button>
      </div>
    </div>
  );
}
