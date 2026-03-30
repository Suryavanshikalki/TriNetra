// File: src/screens/Profile/AvatarCreator.jsx
import React, { useState } from 'react';
import { User, Check, Palette, Shirt, Zap, Box, Crown, RefreshCcw, Sparkles } from 'lucide-react';

export default function AvatarCreator({ onSave }) {
  const [activeTab, setActiveTab] = useState('Face');
  
  // 👁️🔥 Customization State (Point 3: High-end UI)
  const [avatarData, setAvatarData] = useState({
    skin: 1,
    hair: 1,
    outfit: 1,
    glow: false
  });

  const categories = [
    { id: 'Face', icon: User },
    { id: 'Hair', icon: Palette },
    { id: 'Outfit', icon: Shirt }
  ];

  const handleFinalSave = () => {
    alert("TriNetra 3D Engine: Finalizing your unique Identity ID...");
    if (onSave) onSave(avatarData);
  };

  return (
    <div className="h-full bg-[#0a1014] text-white flex flex-col pb-24 overflow-hidden">
      
      {/* Header Section */}
      <div className="p-6 flex justify-between items-center border-b border-gray-800">
        <div>
            <h2 className="text-2xl font-black tracking-tighter">Avatar Creator</h2>
            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">TriNetra 3D Engine v5.0</p>
        </div>
        <button className="bg-gray-900 p-2 rounded-xl text-gray-500 hover:text-white transition">
            <RefreshCcw size={20} />
        </button>
      </div>

      {/* 👤 3D Preview Area (The Viewport) */}
      <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-[#0a1014] to-cyan-950/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Placeholder for 3D Model (Point 3: 3D Option) */}
        <div className="relative z-10 w-64 h-80 flex items-center justify-center">
             <div className="absolute inset-0 bg-cyan-500/5 blur-[80px] rounded-full"></div>
             
             {/* 👁️ Digital Avatar Placeholder */}
             <div className="flex flex-col items-center animate-bounce-slow">
                <div className="text-[120px] drop-shadow-[0_0_30px_rgba(0,230,255,0.4)]">
                    {activeTab === 'Face' ? '👤' : activeTab === 'Hair' ? '💇‍♂️' : '👕'}
                </div>
                <div className="mt-4 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-4 py-1 rounded-full flex items-center gap-2">
                    <Box size={12} className="text-cyan-400" />
                    <span className="text-[9px] font-black text-cyan-400 tracking-widest">3D MESH ACTIVE</span>
                </div>
             </div>
        </div>

        {/* Rotation Indicators */}
        <div className="absolute bottom-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            Pinch to Zoom • Swipe to Rotate
        </div>
      </div>

      {/* 🛠️ Customization Control Panel (Point 1: High-end UI) */}
      <div className="bg-[#111827] rounded-t-[2.5rem] p-6 border-t border-gray-800 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        
        {/* Tabs */}
        <div className="flex justify-around mb-8 bg-black/30 p-1 rounded-2xl border border-gray-800">
            {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${activeTab === cat.id ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-500'}`}
                    >
                        <Icon size={18} />
                        <span className="text-[9px] font-black">{cat.id.toUpperCase()}</span>
                    </button>
                )
            })}
        </div>

        {/* Options Grid (Point 11: Linked to Tiers) */}
        <div className="grid grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <button 
                    key={i}
                    onClick={() => setAvatarData({...avatarData, skin: i})}
                    className={`h-16 rounded-2xl border-2 flex items-center justify-center text-xl transition-all ${i === 4 ? 'relative overflow-hidden border-yellow-500' : 'border-gray-800 bg-gray-900/50'}`}
                >
                    {i === 4 && (
                        <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center">
                            <Crown size={12} className="text-yellow-500 mb-8 ml-8" />
                        </div>
                    )}
                    {activeTab === 'Face' ? '🎨' : activeTab === 'Hair' ? '✂️' : '👔'}
                </button>
            ))}
        </div>

        {/* Action Button (Point 2: No Skip Policy) */}
        <button 
            onClick={handleFinalSave}
            className="w-full bg-cyan-500 text-black p-5 rounded-2xl font-black text-sm flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(0,230,255,0.2)] active:scale-95 transition-all"
        >
            <Check size={20} strokeWidth={3} /> SAVE & DEPLOY TO PROFILE
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
            <Sparkles size={12} className="text-cyan-500" />
            <p className="text-[8px] font-bold tracking-[0.2em] text-cyan-400 uppercase">TriNetra Encryption Keys Locked</p>
        </div>
      </div>

    </div>
  );
}
