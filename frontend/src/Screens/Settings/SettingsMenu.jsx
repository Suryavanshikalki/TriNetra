// ==========================================
// TRINETRA SUPER APP - SETTINGS & PREFERENCES (File 23)
// Exact Path: src/screens/Settings/SettingsMenu.jsx
// Blueprint Point: 12 (B, C, D, E, F, G, H)
// ==========================================
import React, { useState } from 'react';
import { 
  UserCircle, Users, LayoutDashboard, Clock, Bookmark, PlaySquare, ShoppingBag,
  Shield, Lock, Eye, CreditCard, HelpCircle, ChevronRight, ChevronDown, Settings as SettingsIcon,
  Smile, Accessibility, MessageSquare, ToggleRight, ToggleLeft, Globe, Moon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function SettingsMenu({ currentUser, onNavigate }) {
  const { t, i18n } = useTranslation();
  const [expandedSection, setExpandedSection] = useState('preferences');

  // Point 12E: Preference States (Reactions, Accessibility, WhatsApp)
  const [prefs, setPrefs] = useState({
    reactions: true,
    accessibility: false,
    whatsappSync: false
  });

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const togglePref = async (key) => {
    const newVal = !prefs[key];
    setPrefs({ ...prefs, [key]: newVal });
    try {
      // Asli Backend Hit to save preferences
      await axios.post('https://trinetra-umys.onrender.com/api/user/preferences', {
        userId: currentUser?.trinetraId,
        key: key,
        value: newVal
      });
    } catch (err) {
      console.error("Failed to sync preference");
    }
  };

  // Point 12: Multilingual Engine Live
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-24 font-sans">
      
      {/* Menu Header */}
      <div className="p-4 border-b border-gray-800 bg-[#111827] sticky top-0 z-10">
        <h1 className="text-2xl font-black tracking-wide mb-4">{t("Menu")}</h1>
        <div onClick={() => onNavigate('Profile')} className="flex items-center gap-3 bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 cursor-pointer shadow-lg">
          <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border border-cyan-500/30">
            {currentUser?.profilePic ? <img src={currentUser.profilePic} alt="PFP" className="w-full h-full object-cover"/> : <UserCircle size={48} className="text-gray-400" />}
          </div>
          <div>
            <h3 className="font-bold text-sm">{currentUser?.name || 'TriNetra User'}</h3>
            <p className="text-[10px] text-cyan-400 uppercase tracking-widest">{currentUser?.trinetraId}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Settings & Privacy Master Dropdown */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-lg border-l-2 border-l-cyan-500">
          <button onClick={() => toggleSection('settings')} className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3"><SettingsIcon size={20} className="text-cyan-400"/><span className="font-bold text-sm">{t("Settings and privacy")}</span></div>
            {expandedSection === 'settings' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {expandedSection === 'settings' && (
            <div className="bg-[#0a1014] p-2 space-y-1">
              <div onClick={() => onNavigate('AccountsCentre')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer transition-all"><Shield size={18} className="text-blue-400" /><div><p className="font-bold">{t("Accounts Centre")}</p></div></div>
              <div onClick={() => onNavigate('PrivacyCheckup')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer transition-all"><Lock size={18} className="text-green-400" /><div><p className="font-bold">{t("Privacy Checkup")}</p></div></div>
              <div onClick={() => onNavigate('AudienceVisibility')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer transition-all"><Eye size={18} className="text-purple-400" /><div><p className="font-bold">{t("Audience and visibility")}</p></div></div>
              <div onClick={() => onNavigate('WalletAndPayouts')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer transition-all"><CreditCard size={18} className="text-yellow-400" /><div><p className="font-bold">{t("Payments & Activity")}</p></div></div>
            </div>
          )}
        </div>

        {/* ==========================================
            POINT 12E: PREFERENCES SETTINGS
        ========================================== */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
          <button onClick={() => toggleSection('preferences')} className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3"><Smile size={20} className="text-yellow-400"/><span className="font-bold text-sm">{t("Preferences (12E)")}</span></div>
            {expandedSection === 'preferences' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {expandedSection === 'preferences' && (
            <div className="bg-[#0a1014] p-2 space-y-1 divide-y divide-gray-800">
              
              <div className="flex items-center justify-between p-3">
                <span className="text-sm">{t("Reaction preferences")}</span>
                <button onClick={() => togglePref('reactions')}>{prefs.reactions ? <ToggleRight size={28} className="text-cyan-400"/> : <ToggleLeft size={28} className="text-gray-600"/>}</button>
              </div>

              <div className="flex items-center justify-between p-3">
                <span className="text-sm">{t("Accessibility (Contrast)")}</span>
                <button onClick={() => togglePref('accessibility')}>{prefs.accessibility ? <ToggleRight size={28} className="text-cyan-400"/> : <ToggleLeft size={28} className="text-gray-600"/>}</button>
              </div>

              <div className="flex items-center justify-between p-3">
                <div>
                    <span className="text-sm block">{t("WhatsApp Integration")}</span>
                    <span className="text-[10px] text-gray-500">{t("Sync Chats & Contacts")}</span>
                </div>
                <button onClick={() => togglePref('whatsappSync')}>{prefs.whatsappSync ? <ToggleRight size={28} className="text-green-500"/> : <ToggleLeft size={28} className="text-gray-600"/>}</button>
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2"><Globe size={16} className="text-gray-400"/><span className="text-sm">{t("Language")}</span></div>
                <select onChange={(e) => handleLanguageChange(e.target.value)} value={i18n.language} className="bg-[#111827] text-cyan-400 text-xs p-1.5 rounded border border-gray-700 focus:outline-none">
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2"><Moon size={16} className="text-gray-400"/><span className="text-sm">{t("Dark mode")}</span></div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full font-bold">{t("System Default")}</span>
              </div>

            </div>
          )}
        </div>

        {/* Help & Support */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
          <div onClick={() => onNavigate('CustomerSupport')} className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3"><HelpCircle size={20} className="text-gray-400"/><span className="font-bold text-sm">{t("Help and support")}</span></div>
            <ChevronRight size={18} className="text-gray-600" />
          </div>
        </div>

      </div>
    </div>
  );
}
