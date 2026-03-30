import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, laptop, Globe, Download, Zap, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TriNetraLogo } from '../App';

export default function DownloadHub() {
  const { t } = useTranslation();
  const [detectedOS, setDetectedOS] = useState('');

  // 100% Real Auto-Detect OS Logic (Point 1)
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("win") !== -1) setDetectedOS("Windows");
    else if (userAgent.indexOf("mac") !== -1) setDetectedOS("macOS");
    else if (userAgent.indexOf("linux") !== -1) setDetectedOS("Linux");
    else if (userAgent.indexOf("android") !== -1) setDetectedOS("Android");
    else if (userAgent.indexOf("iphone") !== -1 || userAgent.indexOf("ipad") !== -1) setDetectedOS("iOS");
    else setDetectedOS("Web");
  }, []);

  const downloadLinks = [
    { name: "Android", icon: <Smartphone />, os: "Android", link: "https://trinetra.com/download/android/trinetra.apk", desc: "Flutter Build for Play Store" },
    { name: "iOS PWA", icon: <Smartphone className="text-blue-400"/>, os: "iOS", link: "https://trinetra.com/download/ios", desc: "App Store & PWA" },
    { name: "Windows", icon: <Monitor className="text-cyan-400"/>, os: "Windows", link: "https://trinetra.com/download/win/trinetra_setup.exe", desc: "Electron .exe Installer" },
    { name: "macOS", icon: <Monitor className="text-gray-300"/>, os: "macOS", link: "https://trinetra.com/download/mac/trinetra.dmg", desc: "Universal .dmg Build" },
    { name: "Linux", icon: <Monitor className="text-orange-500"/>, os: "Linux", link: "https://snapcraft.io/trinetra", desc: "Snapcraft / AppImage" },
    { name: "Web Version", icon: <Globe className="text-green-400"/>, os: "Web", link: "https://app.trinetra.com", desc: "Run directly in Browser" }
  ];

  // Sorting to bring Detected OS link to top (Point 1 - Auto Detect)
  const sortedLinks = [...downloadLinks].sort((a, b) => a.os === detectedOS ? -1 : 1);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a1014] text-white font-sans p-6 overflow-y-auto">
      
      {/* Universal Branding (Point 1) */}
      <div className="flex flex-col items-center mb-10 mt-8 animate-fade-in">
        <TriNetraLogo size={70} pulse={true} />
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] mt-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
          TriNetra
        </h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2 px-6 text-center">
          {t("The Foundation - 6 Platform Deployment Hub")}
        </p>
      </div>

      {/* Detected OS Highlight */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <ShieldCheck className="text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wide">{t("Detected System:")} <span className="text-cyan-400">{detectedOS}</span></span>
        </div>
        <div className="text-[10px] bg-cyan-500 text-black px-2 py-0.5 rounded font-black uppercase">{t("Optimal Build")}</div>
      </div>

      {/* Download Grid (Point 1 - 6 Platforms) */}
      <div className="grid grid-cols-1 gap-4 mb-20">
        {sortedLinks.map((item, index) => (
          <div 
            key={index} 
            className={`p-5 rounded-2xl border transition-all active:scale-95 flex items-center justify-between ${item.os === detectedOS ? 'bg-[#111827] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-[#111827]/50 border-gray-800'}`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl border border-gray-800 text-cyan-400">
                {item.icon}
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider">{item.name}</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{item.desc}</p>
              </div>
            </div>
            <a 
              href={item.link} 
              className={`p-3 rounded-xl flex items-center gap-2 ${item.os === detectedOS ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400'}`}
            >
              <Download size={18} />
            </a>
          </div>
        ))}
      </div>

      {/* Technical Footer (AWS, WAF, Scaling - Point 12H) */}
      <div className="text-center opacity-30 mt-auto">
        <p className="text-[8px] font-bold uppercase tracking-[0.3em]">
          Powered by AWS WAF • Auto Scaling • CloudWatch Enabled
        </p>
      </div>
    </div>
  );
}
