import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Globe, Lock, PlaySquare, FileText, Loader2, Save, UserCheck, Eye, Phone, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function AudienceVisibility({ currentUser, onBack }) {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    defaultAudience: 'public',
    storyVisibility: 'mutuals',
    reelsVisibility: 'public',
    profileVisibility: 'public',
    professionalMode: false,
    findByName: true,
    findByPhone: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ─── 1. REAL AWS FETCH: AUDIENCE SETTINGS (Point 12-F) ───────────
  useEffect(() => {
    const fetchAudienceSettings = async () => {
      if (!currentUser?.trinetraId) return;
      try {
        // 🔥 Asli AWS GraphQL Query: Fetching secure Visibility settings
        const res = await client.graphql({
          query: `query GetVisibility($userId: ID!) {
            getTriNetraAudienceSettings(userId: $userId) {
              defaultAudience
              storyVisibility
              reelsVisibility
              profileVisibility
              professionalMode
              findByName
              findByPhone
            }
          }`,
          variables: { userId: currentUser.trinetraId }
        });
        
        if (res.data.getTriNetraAudienceSettings) {
          setPreferences(res.data.getTriNetraAudienceSettings);
        }
      } catch (err) {
        console.error("❌ AWS Audience Fetch Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAudienceSettings();
  }, [currentUser]);

  // ─── 2. REAL AWS UPDATE: SAVE SETTINGS (Zero-Dummy) ──────────────
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 🔥 AWS AppSync Mutation: Syncing with Master TriNetra Database
      await client.graphql({
        query: `mutation UpdateVisibility($userId: ID!, $input: AudienceInput!) {
          updateTriNetraAudience(userId: $userId, input: $input) {
            status
          }
        }`,
        variables: {
          userId: currentUser?.trinetraId,
          input: preferences
        }
      });
      alert(t("Audience preferences saved securely on AWS."));
    } catch (err) {
      alert(t("Failed to save preferences. Check AWS WAF status."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center bg-[#0a1014]"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-[60] overflow-y-auto animate-fade-in">
      
      {/* 🚀 Header: Point 12 Style */}
      <header className="p-5 bg-[#111827] flex items-center justify-between border-b border-gray-800 shadow-2xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-75 transition-transform" size={24} />
          <div>
            <h2 className="text-xl font-black tracking-tight">{t("Audience and visibility")}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{t("Control your digital footprint")}</p>
          </div>
        </div>
        <button onClick={handleSaveSettings} disabled={isSaving} className="bg-cyan-500 text-black p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-90 transition-all">
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </header>

      <div className="p-5 space-y-8 pb-32 max-w-2xl mx-auto w-full">
        
        {/* 📝 POSTS AUDIENCE (Point 12-F) */}
        <section>
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
            <FileText size={14}/> {t("Posts")}
          </h3>
          <div className="bg-[#111827] rounded-[2rem] border border-gray-800 p-3 shadow-xl flex flex-col gap-2">
            {['public', 'mutuals', 'private'].map((mode) => (
              <label key={mode} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${preferences.defaultAudience === mode ? 'bg-cyan-500/10 border border-cyan-500/50' : 'border border-transparent hover:bg-[#0a1014]'}`}>
                <div className="flex items-center gap-4">
                  {mode === 'public' ? <Globe size={20} className="text-cyan-400" /> : mode === 'mutuals' ? <Users size={20} className="text-violet-400" /> : <Lock size={20} className="text-gray-500" />}
                  <div>
                    <span className="text-sm font-black uppercase tracking-wide">{t(mode)}</span>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {mode === 'public' ? t("Visible to everyone") : mode === 'mutuals' ? t("Only mutual connections") : t("Hidden from everyone")}
                    </p>
                  </div>
                </div>
                <input type="radio" name="posts" value={mode} checked={preferences.defaultAudience === mode} onChange={(e) => setPreferences({...preferences, defaultAudience: e.target.value})} className="accent-cyan-500 w-5 h-5 cursor-pointer" />
              </label>
            ))}
          </div>
        </section>

        {/* 📱 REELS & STORIES (Point 4 & 12-F) */}
        <section>
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
            <PlaySquare size={14}/> {t("Stories and Reels")}
          </h3>
          <div className="bg-[#111827] rounded-[2rem] border border-gray-800 overflow-hidden shadow-xl">
             <div className="flex items-center justify-between p-5 border-b border-gray-800/50 group">
                <div className="flex items-center gap-4">
                  <Eye size={20} className="text-gray-400 group-hover:text-cyan-400" />
                  <span className="text-sm font-black uppercase tracking-wide">{t("Story Visibility")}</span>
                </div>
                <select 
                  className="bg-[#0a1014] text-cyan-400 text-[10px] font-black uppercase p-2 px-3 rounded-xl border border-gray-700 focus:border-cyan-500 outline-none"
                  value={preferences.storyVisibility}
                  onChange={(e) => setPreferences({...preferences, storyVisibility: e.target.value})}
                >
                  <option value="public">{t("Public")}</option>
                  <option value="mutuals">{t("Mutuals Only")}</option>
                </select>
             </div>
             <div className="flex items-center justify-between p-5 group">
                <div className="flex items-center gap-4">
                  <Zap size={20} className="text-gray-400 group-hover:text-violet-400" />
                  <span className="text-sm font-black uppercase tracking-wide">{t("Reels Audience")}</span>
                </div>
                <select 
                  className="bg-[#0a1014] text-violet-400 text-[10px] font-black uppercase p-2 px-3 rounded-xl border border-gray-700 focus:border-cyan-500 outline-none"
                  value={preferences.reelsVisibility}
                  onChange={(e) => setPreferences({...preferences, reelsVisibility: e.target.value})}
                >
                  <option value="public">{t("Public")}</option>
                  <option value="mutuals">{t("Mutuals Only")}</option>
                </select>
             </div>
          </div>
        </section>

        {/* 💼 PROFESSIONAL MODE (Point 12-F NEW) */}
        <section>
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
            <Briefcase size={14}/> {t("Professional Mode")}
          </h3>
          <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-[2rem] shadow-lg flex items-center justify-between">
            <div className="flex-1 pr-4">
               <h4 className="text-sm font-black uppercase text-cyan-400 mb-1">{t("Creator Dashboard Access")}</h4>
               <p className="text-[10px] text-gray-400 leading-relaxed">{t("Enabling professional mode unlocks insights and monetization for your TriNetra content.")}</p>
            </div>
            <button 
              onClick={() => setPreferences({...preferences, professionalMode: !preferences.professionalMode})}
              className={`w-14 h-7 rounded-full relative transition-all ${preferences.professionalMode ? 'bg-cyan-500' : 'bg-gray-800'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${preferences.professionalMode ? 'left-8' : 'left-1'}`}></div>
            </button>
          </div>
        </section>

        {/* 🔍 DISCOVERY: FIND BY PHONE/NAME (Point 12-F NEW) */}
        <section>
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
            <UserCheck size={14}/> {t("How people find you")}
          </h3>
          <div className="bg-[#111827] rounded-[2rem] border border-gray-800 overflow-hidden shadow-xl">
             <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
                <div className="flex items-center gap-4">
                  <Globe size={18} className="text-gray-500" />
                  <span className="text-xs font-black uppercase tracking-wide">{t("Find by TriNetra Name")}</span>
                </div>
                <input type="checkbox" checked={preferences.findByName} onChange={(e) => setPreferences({...preferences, findByName: e.target.checked})} className="accent-cyan-500 w-5 h-5" />
             </div>
             <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <Phone size={18} className="text-gray-500" />
                  <span className="text-xs font-black uppercase tracking-wide">{t("Find by Phone Number")}</span>
                </div>
                <input type="checkbox" checked={preferences.findByPhone} onChange={(e) => setPreferences({...preferences, findByPhone: e.target.checked})} className="accent-cyan-500 w-5 h-5" />
             </div>
          </div>
        </section>

      </div>

      {/* 🔒 TriNetra Security Footer */}
      <div className="p-8 text-center bg-[#111827] mt-auto">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-cyan-500"/> AWS CLOUDWATCH LOGGING ACTIVE
         </p>
      </div>
    </div>
  );
}
