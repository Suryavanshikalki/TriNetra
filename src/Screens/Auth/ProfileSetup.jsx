// File: src/screens/Auth/ProfileSetup.jsx
import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';

export default function ProfileSetup({ onComplete, onSkip }) {
  const [bio, setBio] = useState('');

  return (
    <div className="h-screen bg-black text-white p-6 flex flex-col items-center">
      <h2 className="text-3xl font-black mt-10 mb-2">Set Up Your Profile</h2>
      <p className="text-gray-500 text-sm mb-10 text-center">Make your TriNetra ID stand out.</p>

      {/* Cover & Profile Pic UI */}
      <div className="w-full max-w-sm relative mb-16">
        <div className="h-32 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 cursor-pointer">
          <span className="text-gray-500 flex items-center"><Camera size={16} className="mr-2"/> Cover Photo</span>
        </div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gray-900 border-4 border-black rounded-full flex items-center justify-center cursor-pointer shadow-lg">
          <User size={32} className="text-gray-500"/>
          <div className="absolute bottom-0 right-0 bg-green-500 p-1.5 rounded-full border-2 border-black">
             <Camera size={12} className="text-black"/>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl font-bold text-green-500">
          Create 3D Avatar
        </button>
        <textarea 
          placeholder="Write your Bio..." 
          className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-white outline-none h-24 resize-none focus:border-green-500"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        
        <button onClick={onComplete} className="w-full bg-green-600 p-4 rounded-xl font-bold mt-6">
          Save & Continue
        </button>
        <button onClick={onSkip} className="w-full bg-transparent text-gray-500 p-4 font-bold">
          Skip for now
        </button>
      </div>
    </div>
  );
}
