import React, { useState } from 'react';
import { 
  Users, LayoutDashboard, Clock, Bookmark, HelpCircle, Settings as SettingsIcon, 
  ChevronDown, ChevronRight, Shield, Lock, Eye, CreditCard, Globe, Moon, UserCircle, PlaySquare, ShoppingBag, MessageCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function SettingsMenu({ currentUser, onNavigate }) {
  const { t, i18n } = useTranslation();
  const [expandedSection, setExpandedSection] = useState('settings');

  // Point 12 (E): 100% Real Language Switcher
  const handleLanguageChange = async (langCode) => {
    i18n.changeLanguage(langCode);
    try {
      // Save preference to real backend
      await axios.post('https://trinetra-umys.onrender.com/api/user/preferences', {
        userId: currentUser?.trinetraId,
        language: langCode
      });
    } catch (err) {
      console.error("Language preference sync failed");
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white overflow-y-auto pb-24 font-sans">
      
      {/* Header & Profile Snippet (Blueprint Screenshot 6) */}
      <div className="p-4 border-b border-gray-800 bg-[#111827]">
        <h1 className="text-2xl font-black tracking-wide mb-4">{t("Menu")}</h1>
        <div 
          onClick={() => onNavigate('Profile')}
          className="flex items-center gap-3 bg-[#0a1014] p-3 rounded-xl border border-gray-800 hover:border-cyan-500 transition-colors cursor-pointer shadow-lg"
        >
          <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border border-cyan-500/30">
            {currentUser?.profilePic ? <img src={currentUser.profilePic} alt="PFP" className="w-full h-full object-cover"/> : <UserCircle size={48} className="text-gray-400" />}
          </div>
          <div>
            <h3 className="font-bold text-sm">{currentUser?.name || 'TriNetra User'}</h3>
            <p className="text-[10px] text-cyan-400 uppercase tracking-widest">{currentUser?.trinetraId}</p>
          </div>
        </div>
      </div>

      {/* Shortcuts Grid (Point 12 B) */}
      <div className="p-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t("Your Shortcuts")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div onClick={() => onNavigate('Friends')} className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-col gap-2 hover:border-cyan-500 cursor-pointer transition-all active:scale-95 shadow-md"><Users size={24} className="text-blue-400"/><span className="text-xs font-bold">{t("Friends")}</span></div>
          <div onClick={() => onNavigate('Dashboard')} className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-col gap-2 hover:border-cyan-500 cursor-pointer transition-all active:scale-95 shadow-md"><LayoutDashboard size={24} className="text-green-400"/><span className="text-xs font-bold">{t("Dashboard")}</span></div>
          <div onClick={() => onNavigate('Memories')} className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-col gap-2 hover:border-cyan-500 cursor-pointer transition-all active:scale-95 shadow-md"><Clock size={24} className="text-purple-400"/><span className="text-xs font-bold">{t("Memories")}</span></div>
          <div onClick={() => onNavigate('Saved')} className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-col gap-2 hover:border-cyan-500 cursor-pointer transition-all active:scale-95 shadow-md"><Bookmark size={24} className="text-pink-400"/><span className="text-xs font-bold">{t("Saved")}</span></div>
          <div onClick={() => onNavigate('Reels')} className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-col gap-2 hover:border-cyan-500 cursor-pointer transition-all active:scale-95 shadow-md"><PlaySquare size={24} className="text-red-400"/><span className="text-xs font-bold">{t("Reels")}</span></div>
          <div onClick={() => onNavigate('Marketplace')} className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-col gap-2 hover:border-cyan-500 cursor-pointer transition-all active:scale-95 shadow-md"><ShoppingBag size={24} className="text-orange-400"/><span className="text-xs font-bold">{t("Marketplace")}</span></div>
        </div>
      </div>

      <hr className="border-gray-800 mx-4" />

      {/* Main Settings Accordion (Point 12 C to H) */}
      <div className="p-4 space-y-2">
        
        {/* Help & Support */}
        <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden">
          <button onClick={() => toggleSection('help')} className="w-full flex justify-between items-center p-4 hover:bg-[#1a2333] transition-colors">
            <div className="flex items-center gap-3"><HelpCircle size={20} className="text-gray-400"/><span className="font-bold text-sm">{t("Help and support")}</span></div>
            {expandedSection === 'help' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {expandedSection === 'help' && (
            <div className="bg-[#0a1014] p-2">
              <div onClick={() => onNavigate('CustomerSupport')} className="p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer text-gray-300">{t("Customer Support (24/7)")}</div>
              <div className="p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer text-gray-300">{t("Help Centre")}</div>
            </div>
          )}
        </div>

        {/* Settings & Privacy (The Core) */}
        <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden border-l-2 border-l-cyan-500 shadow-lg">
          <button onClick={() => toggleSection('settings')} className="w-full flex justify-between items-center p-4 hover:bg-[#1a2333] transition-colors">
            <div className="flex items-center gap-3"><SettingsIcon size={20} className="text-cyan-400"/><span className="font-bold text-sm">{t("Settings and privacy")}</span></div>
            {expandedSection === 'settings' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {expandedSection === 'settings' && (
            <div className="bg-[#0a1014] p-2 space-y-1">
              
              {/* Point 12 C: Accounts Centre */}
              <div onClick={() => onNavigate('AccountsCentre')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer border border-transparent hover:border-gray-700 transition-all">
                <Shield size={18} className="text-blue-400" />
                <div><p className="font-bold">{t("Accounts Centre")}</p><p className="text-[10px] text-gray-500">{t("Password, security, personal details")}</p></div>
              </div>

              {/* Point 12 D: Privacy Checkup */}
              <div onClick={() => onNavigate('PrivacyCheckup')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer border border-transparent hover:border-gray-700 transition-all">
                <Lock size={18} className="text-green-400" />
                <div><p className="font-bold">{t("Privacy Checkup")}</p><p className="text-[10px] text-gray-500">{t("Review your security settings")}</p></div>
              </div>

              {/* Point 12 F: Audience & Visibility */}
              <div onClick={() => onNavigate('AudienceVisibility')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer border border-transparent hover:border-gray-700 transition-all">
                <Eye size={18} className="text-purple-400" />
                <div><p className="font-bold">{t("Audience and visibility")}</p><p className="text-[10px] text-gray-500">{t("Control who sees your posts & profile")}</p></div>
              </div>

              {/* Point 12 H: Payments & Wallet (Routed to WalletAndPayouts) */}
              <div onClick={() => onNavigate('WalletAndPayouts')} className="flex items-center gap-3 p-3 text-sm hover:bg-[#111827] rounded-lg cursor-pointer border border-transparent hover:border-gray-700 transition-all">
                <CreditCard size={18} className="text-yellow-400" />
                <div><p className="font-bold">{t("Payments & Activity")}</p><p className="text-[10px] text-gray-500">{t("Wallet, Ads payments, Payouts")}</p></div>
              </div>

              {/* Point 12 E: Preferences (Real Language Switcher) */}
              <div className="flex flex-col gap-2 p-3 border-t border-gray-800 mt-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t("Preferences")}</p>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3"><Globe size={18} className="text-gray-400"/><span className="text-sm">{t("Language")}</span></div>
                  <select 
                    onChange={(e) => handleLanguageChange(e.target.value)} 
                    value={i18n.language}
                    className="bg-[#111827] text-white text-xs p-1.5 rounded border border-gray-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="fr">Français (French)</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3"><Moon size={18} className="text-gray-400"/><span className="text-sm">{t("Dark mode")}</span></div>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full font-bold">{t("Default Active")}</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
