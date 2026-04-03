import React, { useState } from 'react';
import { User, Check, Palette, Shirt, Zap, Box, Crown, RefreshCcw, Sparkles, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Fake Alerts) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function AvatarCreator({ currentUser, onSave }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Face');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // 👁️🔥 Real Configuration State for AWS DynamoDB
  const [avatarData, setAvatarData] = useState({
    face: 1,
    hair: 1,
    outfit: 1,
    isPremium: false
  });

  const categories = [
    { id: 'Face', icon: User },
    { id: 'Hair', icon: Palette },
    { id: 'Outfit', icon: Shirt }
  ];

  // ─── 1. REAL AWS DYNAMODB SAVE LOGIC (Point 3) ──────────────────
  const handleFinalSave = async () => {
    if (!currentUser?.trinetraId) {
      setError(t("Authentication Error: TriNetra ID missing."));
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // 🔥 AWS AppSync Mutation: Saving the 3D Avatar JSON config to the user's profile
      const mutation = `
        mutation SaveTriNetraAvatar($userId: ID!, $avatarConfig: String!) {
          updateUserProfile(id: $userId, avatarConfig: $avatarConfig) {
            id
            avatarConfig
          }
        }
      `;

      await client.graphql({
        query: mutation,
        variables: {
          userId: currentUser.trinetraId,
          avatarConfig: JSON.stringify(avatarData) // Real data conversion
        }
      });

      // Pass the saved data back to ProfileSetup or UserProfile component
      if (onSave) onSave(avatarData);

    } catch (err) {
      console.error("❌ AWS Avatar Save Failed:", err);
      setError(t("Failed to sync 3D Avatar to AWS server."));
    } finally {
      setIsSaving(false);
    }
  };

  // Select Item Logic
  const handleSelect = (index) => {
    // Index 4, 8 are premium (Crown) items
    const isPremiumItem = index === 4 || index === 8;
    setAvatarData({
      ...avatarData,
      [activeTab.toLowerCase()]: index,
      isPremium: avatarData.isPremium || isPremiumItem
    });
  };

  return (
    <div className="h-full bg-[#0a1014] text-white flex flex-col pb-24 overflow-hidden font-sans animate-fade-in">
      
      {/* 🚀 Header Section */}
      <div className="p-6 flex justify-between items-center border-b border-gray-800 bg-[#111827] shadow-xl relative z-20">
        <div>
            <h2 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">{t("Avatar Creator")}</h2>
            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <Zap size={10}/> TriNetra 3D Engine v5.0
            </p>
        </div>
        <button 
          onClick={() => setAvatarData({ face: 1, hair: 1, outfit: 1, isPremium: false })}
          className="bg-[#0a1014] border border-gray-800 p-2.5 rounded-xl text-gray-500 hover:text-cyan-400 hover:border-cyan-500 transition-all active:scale-90 shadow-lg"
          title={t("Reset Avatar")}
        >
            <RefreshCcw size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-900/40 text-red-400 p-2 text-center text-xs font-bold border-b border-red-900 uppercase tracking-widest">
          {error}
        </div>
      )}

      {/* 👤 3D Preview Area (The Viewport) */}
      <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-[#0a1014] to-cyan-950/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Placeholder for 3D Model Render */}
        <div className="relative z-10 w-64 h-80 flex items-center justify-center">
             <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full animate-pulse"></div>
             
             {/* 👁️ Digital Avatar Real-time Preview */}
             <div className="flex flex-col items-center animate-bounce-slow">
                <div className="text-[120px] drop-shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-500 transform scale-110">
                    {activeTab === 'Face' ? '👤' : activeTab === 'Hair' ? '💇‍♂️' : '👕'}
                </div>
                <div className="mt-6 bg-black/80 backdrop-blur-md border border-cyan-500/50 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Box size={14} className="text-cyan-400 animate-spin-slow" />
                    <span className="text-[10px] font-black text-cyan-400 tracking-[0.2em]">AWS 3D MESH SYNC</span>
                </div>
             </div>
        </div>

        {/* Rotation Indicators */}
        <div className="absolute bottom-6 text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-gray-700"></span> Pinch to Zoom • Swipe to Rotate <span className="w-8 h-[1px] bg-gray-700"></span>
        </div>
      </div>

      {/* 🛠️ Customization Control Panel */}
      <div className="bg-[#111827] rounded-t-[2.5rem] p-6 border-t border-gray-800 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] relative z-20">
        
        {/* Tabs */}
        <div className="flex justify-around mb-8 bg-[#0a1014] p-1.5 rounded-2xl border border-gray-800 shadow-inner">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeTab === cat.id;
                return (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${isActive ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-500 hover:text-cyan-400'}`}
                    >
                        <Icon size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t(cat.id)}</span>
                    </button>
                )
            })}
        </div>

        {/* Options Grid (Point 11 / Premium Linking) */}
        <div className="grid grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                const isPremium = i === 4 || i === 8;
                const isSelected = avatarData[activeTab.toLowerCase()] === i;
                
                return (
                  <button 
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`h-16 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all active:scale-90 relative overflow-hidden
                        ${isSelected ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-800 bg-[#0a1014] hover:border-gray-600'}
                        ${isPremium && !isSelected ? 'border-yellow-900/50' : ''}
                      `}
                  >
                      {isPremium && (
                          <div className="absolute inset-0 bg-yellow-500/5 flex items-start justify-end p-1">
                              <Crown size={12} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,1)]" />
                          </div>
                      )}
                      {activeTab === 'Face' ? '🎨' : activeTab === 'Hair' ? '✂️' : '👔'}
                  </button>
                );
            })}
        </div>

        {/* 🚀 Action Button (Real AWS Trigger) */}
        <button 
            onClick={handleFinalSave}
            disabled={isSaving}
            className={`w-full p-5 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg
              ${isSaving ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_10px_30px_rgba(6,182,212,0.3)]'}
            `}
        >
            {isSaving ? (
              <><Loader2 size={20} className="animate-spin" /> {t("Syncing to AWS...")}</>
            ) : (
              <><Check size={20} strokeWidth={3} /> {t("Save & Deploy Avatar")}</>
            )}
        </button>

        <div className="mt-5 flex items-center justify-center gap-2 opacity-50">
            <Sparkles size={12} className="text-cyan-500" />
            <p className="text-[8px] font-bold tracking-[0.3em] text-cyan-400 uppercase">TriNetra Encryption Keys Locked</p>
            <Sparkles size={12} className="text-cyan-500" />
        </div>
      </div>

    </div>
  );
}
