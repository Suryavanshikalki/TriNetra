import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Globe, Lock, PlaySquare, FileText, Loader2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function AudienceVisibility({ currentUser, onBack }) {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    defaultAudience: 'public',
    storyVisibility: 'mutuals',
    reelsVisibility: 'public'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 100% Real Fetch: Get Audience Settings from MongoDB
  useEffect(() => {
    const fetchAudienceSettings = async () => {
      try {
        const res = await axios.get(`https://trinetra-umys.onrender.com/api/user/audience-settings?userId=${currentUser?.trinetraId}`);
        if(res.data.success && res.data.settings) {
          setPreferences(res.data.settings);
        }
      } catch (err) {
        console.error("Audience DB Error");
      } finally {
        setIsLoading(false);
      }
    };
    if(currentUser) fetchAudienceSettings();
  }, [currentUser]);

  // 100% Real Update API Call
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await axios.post('https://trinetra-umys.onrender.com/api/user/update-audience', {
        userId: currentUser?.trinetraId,
        settings: preferences
      });
      alert(t("Audience preferences saved securely."));
    } catch (err) {
      alert(t("Failed to save preferences. Backend error."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center bg-[#0a1014]"><Loader2 size={30} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-50 overflow-y-auto">
      
      <header className="p-4 bg-[#111827] flex items-center justify-between border-b border-gray-800 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-90" />
          <div>
            <h2 className="text-lg font-black tracking-wide">{t("Audience and visibility")}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t("Control who sees your content")}</p>
          </div>
        </div>
        <button onClick={handleSaveSettings} disabled={isSaving} className="text-cyan-400 active:scale-95 p-2">
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </header>

      <div className="p-4 space-y-6 pb-20">
        
        {/* Default Post Audience */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2"><FileText size={14}/> {t("Posts")}</h3>
          <div className="bg-[#111827] rounded-2xl border border-gray-800 p-2 shadow-md flex flex-col gap-1">
            <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${preferences.defaultAudience === 'public' ? 'bg-cyan-500/10 border border-cyan-500/50' : 'hover:bg-[#1a2333] border border-transparent'}`}>
              <div className="flex items-center gap-3">
                <Globe size={18} className={preferences.defaultAudience === 'public' ? 'text-cyan-400' : 'text-gray-400'} />
                <span className="text-sm font-medium">{t("Public")}</span>
              </div>
              <input type="radio" name="posts" value="public" checked={preferences.defaultAudience === 'public'} onChange={(e) => setPreferences({...preferences, defaultAudience: e.target.value})} className="accent-cyan-500 w-4 h-4" />
            </label>
            
            <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${preferences.defaultAudience === 'mutuals' ? 'bg-cyan-500/10 border border-cyan-500/50' : 'hover:bg-[#1a2333] border border-transparent'}`}>
              <div className="flex items-center gap-3">
                <Users size={18} className={preferences.defaultAudience === 'mutuals' ? 'text-cyan-400' : 'text-gray-400'} />
                <div>
                  <span className="text-sm font-medium block">{t("Mutual Connections")}</span>
                  <span className="text-[10px] text-gray-500">{t("Only followers who you follow back")}</span>
                </div>
              </div>
              <input type="radio" name="posts" value="mutuals" checked={preferences.defaultAudience === 'mutuals'} onChange={(e) => setPreferences({...preferences, defaultAudience: e.target.value})} className="accent-cyan-500 w-4 h-4" />
            </label>

            <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${preferences.defaultAudience === 'private' ? 'bg-cyan-500/10 border border-cyan-500/50' : 'hover:bg-[#1a2333] border border-transparent'}`}>
              <div className="flex items-center gap-3">
                <Lock size={18} className={preferences.defaultAudience === 'private' ? 'text-cyan-400' : 'text-gray-400'} />
                <span className="text-sm font-medium">{t("Only me")}</span>
              </div>
              <input type="radio" name="posts" value="private" checked={preferences.defaultAudience === 'private'} onChange={(e) => setPreferences({...preferences, defaultAudience: e.target.value})} className="accent-cyan-500 w-4 h-4" />
            </label>
          </div>
        </div>

        {/* Stories & Reels */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2"><PlaySquare size={14}/> {t("Stories and Reels")}</h3>
          <div className="bg-[#111827] rounded-2xl border border-gray-800 p-2 shadow-md">
             {/* Note: Simplified UI for exact functionality mapped to DB */}
             <div className="flex items-center justify-between p-3 border-b border-gray-800">
                <span className="text-sm font-medium">{t("Story Visibility")}</span>
                <select 
                  className="bg-[#0a1014] text-cyan-400 text-xs p-2 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
                  value={preferences.storyVisibility}
                  onChange={(e) => setPreferences({...preferences, storyVisibility: e.target.value})}
                >
                  <option value="public">{t("Public")}</option>
                  <option value="mutuals">{t("Mutuals")}</option>
                  <option value="private">{t("Private")}</option>
                </select>
             </div>
             <div className="flex items-center justify-between p-3">
                <span className="text-sm font-medium">{t("Reels Default Audience")}</span>
                <select 
                  className="bg-[#0a1014] text-cyan-400 text-xs p-2 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
                  value={preferences.reelsVisibility}
                  onChange={(e) => setPreferences({...preferences, reelsVisibility: e.target.value})}
                >
                  <option value="public">{t("Public")}</option>
                  <option value="mutuals">{t("Mutuals")}</option>
                </select>
             </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-3 px-2 leading-relaxed">
            {t("Changes applied here will automatically update your Master TriNetra Database. Past posts visibility will not be affected unless manually changed.")}
          </p>
        </div>

      </div>
    </div>
  );
}
