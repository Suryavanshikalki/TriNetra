import React, { useState, useEffect } from 'react';
import { BrainCircuit, Cpu, Zap, Globe, Lock, ShieldCheck, ArrowRight, Loader2, Sparkles, Database, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 1. ASLI GLOBAL INITIALIZATION (POINT 12: MONITORING & AWS)
import { generateClient } from 'aws-amplify/api';
import LogRocket from 'logrocket';
import * as Sentry from "@sentry/react";

// Sentry & LogRocket Initialization (Asli Keys Setup)
LogRocket.init('trinetra/master-hub-asli');
Sentry.init({
  dsn: "https://asli_sentry_key_from_blueprint@sentry.io/trinetra",
  tracesSampleRate: 1.0,
});

const client = generateClient();

// 🔥 2. TRINETRA BLUEPRINT (POINT 1-12: THE CONSTITUTION)
const TRINETRA_BLUEPRINT = {
  version: "1.0.0-Stable-AWS",
  origin: "Harnaut, Nalanda, Bihar",
  prices: {
    escalation: 30000, // ₹30,000/month (Point 4)
    modeA: 2499,      // Chatbot (Point 11-A)
    modeB: 2999,      // Agentic (Point 11-B - 300 Credits)
    modeC: 9999,      // Super Agentic (Point 11-C - 900 Credits)
    osTier: 79999     // OS Creation (Point 11-OS - 5000 Credits)
  },
  revenueSplits: {
    freeBoost: "70/30",
    paidBoost: "25/75",
    proMonetize: "100/0",
    autoBoost: "70/30"
  },
  escalationChain: ["Local Authority", "MLA", "CM", "PM", "Civil Court", "High Court", "Supreme Court", "International"]
};

// 🔥 3. MASTER AI HUB COMPONENT (A TO Z FUNCTIONAL)
export default function MasterAIHub({ currentUser, onLaunchAI }) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState(null);
  
  // Real Credits from AWS DynamoDB
  const [userCredits, setUserCredits] = useState({ 
    chatbot: 0,      // Mode A
    agentic: 0,      // Mode B
    superAgentic: 0, // Mode C
    osCreation: 0    // OS Tier
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  // ─── CHECK AWS DATABASE (Point 6 & 11) ──────────────────────────
  useEffect(() => {
    const fetchAICredits = async () => {
      if (!currentUser?.trinetraId) return;
      try {
        LogRocket.identify(currentUser.trinetraId);
        
        // AWS AppSync Query for Real-time Credits
        const query = `
          query GetAICredits($userId: ID!) {
            getUserAICredits(userId: $userId) {
              chatbot agentic superAgentic osCreation planType
            }
          }
        `;
        const res = await client.graphql({
          query, variables: { userId: currentUser.trinetraId }
        });

        if (res.data?.getUserAICredits) {
          setUserCredits(res.data.getUserAICredits);
        }
      } catch (err) {
        Sentry.captureException(err);
        console.error("❌ TriNetra AWS Engine Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAICredits();
  }, [currentUser]);

  // ─── POINT 11: THE 4 POWER MODES (ASLI CONTENT) ─────────────────
  const aiModes = [
    {
      id: 'ModeA',
      name: 'Mode A: Chatbot AI',
      level: 'GPT-4o / Gemini / DeepSeek / Meta',
      price: `₹${TRINETRA_BLUEPRINT.prices.modeA}/month`,
      credits: userCredits.chatbot === -1 ? 'Unlimited' : `${userCredits.chatbot} msgs left`,
      desc: 'Free Lifetime Meta basics. Paid for Unlimited Power and Master Research.',
      icon: <BrainCircuit size={28} className="text-cyan-400" />,
      color: 'border-cyan-500/50 bg-cyan-500/5 hover:border-cyan-400'
    },
    {
      id: 'ModeB',
      name: 'Mode B: Agentic AI',
      level: 'Manus / Emergent Level',
      price: `₹${TRINETRA_BLUEPRINT.prices.modeB}/month`,
      credits: `${userCredits.agentic} credits left`,
      desc: 'Complex tasks, Coding, GitHub Uploads. 300 credits/month on recharge.',
      icon: <Cpu size={28} className="text-violet-400" />,
      color: 'border-violet-500/50 bg-violet-500/5 hover:border-violet-400'
    },
    {
      id: 'ModeC',
      name: 'Mode C: Super Agentic AI',
      level: '100% Human-Brain Level',
      price: `₹${TRINETRA_BLUEPRINT.prices.modeC}/month`,
      credits: `${userCredits.superAgentic} credits left`,
      desc: 'Thinks, feels, and invents. 100% controlled emotions. No violence. 900 credits.',
      icon: <Globe size={28} className="text-green-400" />,
      color: 'border-green-500/50 bg-green-500/5 hover:border-green-400'
    },
    {
      id: 'OSMode',
      name: 'OS Creation Tier',
      level: 'The Ultimate Power',
      price: `₹${TRINETRA_BLUEPRINT.prices.osTier}/month`,
      credits: `${userCredits.osCreation} credits left`,
      desc: '₹79999/month (5000 Premium Credits). Build a full Operating System using AI.',
      icon: <Lock size={28} className="text-red-400" />,
      color: 'border-red-500/50 bg-red-500/5 hover:border-red-400'
    }
  ];

  // ─── LAUNCH AI ENGINE (POINT 11: AWS WARM-UP) ───────────────────
  const handleLaunchAI = async () => {
    if (!selectedMode) return;
    
    // Credit Verification Logic
    const modeKeyMap = { ModeA: 'chatbot', ModeB: 'agentic', ModeC: 'superAgentic', OSMode: 'osCreation' };
    const currentKey = modeKeyMap[selectedMode];

    if (userCredits[currentKey] === 0) {
       alert(t("Insufficient AI credits. Please recharge your Wallet."));
       return;
    }

    setIsActivating(true);
    try {
      // 🔥 AWS AppSync Mutation: Initialize 6-in-1 Brain on Server
      const mutation = `
        mutation InitializeBrain($userId: ID!, $mode: String!) {
          warmupTriNetraAI(userId: $userId, mode: $mode) { status instanceId }
        }
      `;
      await client.graphql({
        query: mutation, variables: { userId: currentUser?.trinetraId, mode: selectedMode }
      });

      LogRocket.track('AI_BRAIN_LAUNCHED', { mode: selectedMode });
      onLaunchAI(selectedMode); // Open the AI Interface
    } catch (err) {
      Sentry.captureException(err);
      alert(t("Failed to connect to TriNetra Master Brain. Check AWS WAF."));
    } finally {
      setIsActivating(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#0a1014]"><Loader2 size={50} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-y-auto p-4 font-sans">
      
      {/* Header - Point 11 Identity */}
      <div className="text-center mb-8 mt-6">
        <div className="inline-block p-5 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.4)] mb-4 animate-pulse">
            <Zap size={40} className="text-cyan-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-500">
          {t("TriNetra Master Hub")}
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2">
           <ShieldCheck size={14} className="text-green-500"/> 
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {t("6-in-1 Auto-Switch Engine Active")}
           </p>
        </div>
      </div>

      {/* AI Modes Selection */}
      <div className="space-y-4 mb-28">
        {aiModes.map((mode) => (
          <div 
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`relative p-5 rounded-3xl border transition-all duration-300 cursor-pointer ${mode.color} ${selectedMode === mode.id ? 'border-opacity-100 scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-gray-800 opacity-70'}`}
          >
            <div className="flex gap-4 items-start">
                <div className="mt-1 bg-black p-3 rounded-2xl border border-gray-800">{mode.icon}</div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-black text-lg tracking-wide">{t(mode.name)}</h3>
                        <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">{mode.price}</span>
                    </div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3">{t(mode.level)}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                        <Database size={12} className="text-gray-500" />
                        <span className="text-[11px] font-black text-gray-300 uppercase">
                            {t(mode.credits)}
                        </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 leading-relaxed pr-2">{t(mode.desc)}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Launch Button - Point 1 */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#0a1014]/90 backdrop-blur-md border-t border-gray-800 pb-8">
        <button 
          onClick={handleLaunchAI}
          disabled={!selectedMode || isActivating}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${selectedMode ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-black shadow-2xl scale-100' : 'bg-gray-800 text-gray-500 cursor-not-allowed scale-95'}`}
        >
          {isActivating ? <Loader2 size={24} className="animate-spin" /> : <>{t("Initialize 6-in-1 Brain")} <ArrowRight size={22} /></>}
        </button>
      </div>

      {/* Chain of Command Alert - Point 4 */}
      <div className="mt-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3">
          <ShieldAlert size={20} className="text-red-500" />
          <p className="text-[10px] text-red-300 font-bold uppercase leading-tight">
              {t("Auto-Escalation Engine Active: MLA ➡️ CM ➡️ PM Chain Online")}
          </p>
      </div>
    </div>
  );
}
