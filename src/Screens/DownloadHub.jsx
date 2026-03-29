// ==========================================
// TRINETRA SUPER APP - DOWNLOAD HUB (WELCOME SCREEN)
// File: src/Screens/DownloadHub.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { Download, Zap, ChevronRight, ShieldCheck, Cpu } from 'lucide-react';

export default function DownloadHub({ onProceedToLogin }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // PWA Install Prompt ko catch karna
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("Apke browser me install ka option pehle se active hai ya app install ho chuka hai.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1014] text-white p-6 font-sans relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* TriNetra Logo & Branding */}
      <div className="flex flex-col items-center z-10 mb-12 animate-fade-in-down">
        <div className="w-24 h-24 bg-[#111827] rounded-3xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-6">
          <Zap size={48} className="text-cyan-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
          TriNetra
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase font-bold flex items-center gap-2">
          <Cpu size={14} /> The Ultimate Super App
        </p>
      </div>

      {/* Features List */}
      <div className="w-full max-w-sm space-y-4 mb-12 z-10">
        <div className="flex items-center gap-4 bg-[#111827] p-4 rounded-xl border border-white/5">
          <ShieldCheck className="text-green-400" size={24} />
          <p className="text-sm text-gray-300 font-medium">Military-Grade Security</p>
        </div>
        <div className="flex items-center gap-4 bg-[#111827] p-4 rounded-xl border border-white/5">
          <Zap className="text-yellow-400" size={24} />
          <p className="text-sm text-gray-300 font-medium">Lightning Fast AI Engine</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col w-full max-w-sm gap-4 z-10">
        <button 
          onClick={handleInstallClick}
          className="flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
        >
          <Download size={20} /> Install TriNetra
        </button>
        
        <button 
          onClick={onProceedToLogin}
          className="flex items-center justify-center gap-2 w-full bg-transparent border border-gray-600 hover:border-cyan-500 hover:bg-[#111827] text-gray-300 hover:text-cyan-400 font-bold uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95"
        >
          Continue to Login <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
