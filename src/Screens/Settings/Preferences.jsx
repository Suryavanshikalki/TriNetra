// File: src/screens/Settings/Preferences.jsx
import React, { useState } from 'react';
import { Languages, Moon, Sun, Bell, Layout, Globe, Check, Shield } from 'lucide-react';

export default function Preferences() {
  const [language, setLanguage] = useState('hi'); // Default: Hindi
  const [darkMode, setDarkMode] = useState(true);

  const languages = [
    { id: 'hi', name: 'हिन्दी (Hindi)', region: 'India' },
    { id: 'en', name: 'English', region: 'Global' },
    { id: 'es', name: 'Español', region: 'Spain' },
    { id: 'ar', name: 'العربية', region: 'UAE' }
  ];

  const handleLanguageChange = (id) => {
    setLanguage(id);
    alert(`TriNetra AI: Language system updating to ${id.toUpperCase()}...`);
    // यहाँ से पूरे ऐप (Post, Comments, Messenger) की भाषा बदल जाएगी
  };

  return (
    <div className="h-full bg-[#0a1014] text-white p-6 overflow-y-auto pb-24">
      
      {/* 🌍 Point 13: Multilanguage Hub */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-cyan-500/20 p-3 rounded-2xl">
            <Languages className="text-cyan-400" size={28} />
        </div>
        <div>
            <h2 className="text-2xl font-black">Preferences</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Language & Display Control</p>
        </div>
      </div>

      {/* 🌐 Language Selector Section */}
      <section className="mb-8">
        <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em] mb-4">App Language & Region</h3>
        <div className="space-y-3">
            {languages.map((lang) => (
                <button 
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${language === lang.id ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-gray-900 border-gray-800'}`}
                >
                    <div className="flex items-center gap-3">
                        <Globe size={18} className={language === lang.id ? 'text-cyan-400' : 'text-gray-500'} />
                        <div className="text-left">
                            <p className="font-bold text-sm">{lang.name}</p>
                            <p className="text-[9px] text-gray-600 uppercase font-bold">{lang.region}</p>
                        </div>
                    </div>
                    {language === lang.id && <Check size={18} className="text-cyan-400" />}
                </button>
            ))}
        </div>
      </section>

      {/* 🌓 Point E: Preferences (Dark Mode & Notifications) */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Experience Settings</h3>
        
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                    {darkMode ? <Moon size={18} className="text-purple-400" /> : <Sun size={18} className="text-yellow-500" />}
                </div>
                <span className="font-bold text-sm">Dark Mode</span>
            </div>
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full relative transition-all ${darkMode ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
            </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                    <Bell size={18} className="text-green-500" />
                </div>
                <span className="font-bold text-sm">Push Notifications</span>
            </div>
            <span className="text-[10px] font-black text-cyan-500">ACTIVE</span>
        </div>

        {/* Tab Bar Customization */}
        <div className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                    <Layout size={18} className="text-blue-500" />
                </div>
                <span className="font-bold text-sm">Tab Bar Settings</span>
            </div>
            <button className="text-[10px] font-black bg-gray-800 px-3 py-1 rounded-lg text-gray-400">EDIT</button>
        </div>
      </section>

      {/* 🛡️ Security Note */}
      <div className="mt-10 flex flex-col items-center opacity-30">
        <Shield size={20} className="text-gray-500" />
        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-2">TriNetra Global Localization Hub</p>
      </div>

    </div>
  );
}
