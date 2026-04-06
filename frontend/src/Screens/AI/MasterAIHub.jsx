import React, { useState, useEffect } from 'react';
import { BrainCircuit, Cpu, Zap, Globe, Lock, ShieldCheck, ArrowRight, Loader2, Sparkles, Scale, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generateClient } from 'aws-amplify/api';

// 🔥 1. GLOBAL INITIALIZATION (POINT 12: ASLI MONITORING)
import LogRocket from 'logrocket';
import * as Sentry from "@sentry/react";

LogRocket.init('trinetra/master-hub');
Sentry.init({
  dsn: "https://asli_sentry_key@sentry.io/trinetra",
  tracesSampleRate: 1.0,
});

const client = generateClient();

// 🔥 2. TRINETRA BLUEPRINT (POINT 1-12: THE CONSTITUTION)
const TRINETRA_BLUEPRINT = {
  version: "1.0.0-Stable-AWS",
  prices: {
    modeA: 2499,      // Chatbot
    modeB: 2999,      // Agentic (300 Credits)
    modeC: 9999,      // Super Agentic (900 Credits)
    osTier: 79999     // OS Creation (5000 Credits)
  },
  escalationChain: ["Local", "MLA", "CM", "PM", "Civil Court", "High Court", "Supreme Court", "International"],
  revenueSplits: { free: "70/30", paid: "25/75", pro: "100/0" }
};

export default function MasterAIHub({ currentUser, onLaunchAI }) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState(null);
  const [userCredits, setUserCredits] = useState({ chatbot: 0, agentic: 0, superAgentic: 0, osCreation: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  // ─── 3. REAL AWS DATABASE FETCH (Checking User's Plan) ───────────
  useEffect(() => {
    const fetchAICredits = async () => {
      if (!currentUser?.trinetraId) return;
      try {
        LogRocket.identify(currentUser.trinetraId);
        
        const query = `
          query GetAICredits($userId: ID!) {
            getUserAICredits(userId: $userId) {
              chatbot agentic superAgentic osCreation planType
            }
          }
        `;
        const res = await client.graphql({
          query,
          variables: { userId: currentUser.trinetraId }
        });

        if (res.data?.getUserAICredits) {
          setUserCredits(res.data.getUserAICredits);
        }
      } catch (err) {
        Sentry.captureException(err);
        console.error("❌ AWS Sync Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAICredits();
  }, [currentUser]);

  // ─── 4. THE 4 POWER TIERS (A TO Z ASLI LOGIC) ────────────────────
  const aiModes = [
    {
      id: 'ModeA',
      name: 'Mode A: Chatbot AI',
      level: 'GPT-4o / Gemini / DeepSeek / Meta',
      price: `₹${TRINETRA_BLUEPRINT.prices.modeA}/mo`,
      credits: userCredits.chatbot === -1 ? 'Unlimited' : `${userCredits.chatbot} msgs left`,
      desc: 'Free Lifetime Meta basics. Paid for Unlimited Power and Master Research.',
      icon: <BrainCircuit size={28} className="text-cyan-400" />,
      color: 'border-cyan-500/50 bg-cyan-500/5 hover:bg-cyan-500/10'
    },
    {
      id: 'ModeB',
      name: 'Mode B: Agentic AI',
      level: 'Manus / Emergent Level',
      price: `₹${TRINETRA_BLUEPRINT.prices.modeB}/mo`,
      credits: `${userCredits.agentic} credits left`,
      desc: 'Complex tasks, Advanced Coding, GitHub Auto-Upload. 300 credits included.',
      icon: <Cpu size={28} className="text-violet-400" />,
      color: 'border-violet-500/50 bg-violet-500/5 hover:bg-violet-500/10'
    },
    {
      id: 'ModeC',
      name: 'Mode C: Super Agentic AI',
      level: '100% Human-Brain Brain & Heart',
      price: `₹${TRINETRA_BLUEPRINT.prices.modeC}/mo`,
      credits: `${userCredits.superAgentic} credits left`,
      desc: 'Thinks, feels, and invents. 100% controlled emotions (No anger). 900 credits.',
      icon: <Globe size={28} className="text-green-400" />,
      color: 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10'
    },
    {
      id: 'OSMode',
      name: 'OS Creation Tier',
      level: 'The Ultimate OS Builder',
      price: `₹${TRINETRA_BLUEPRINT.prices.osTier}/mo`,
      credits: `${userCredits.osCreation} credits left`,
      desc: '₹79999/month. Full Operating System development with 5000 Premium Credits.',
      icon: <Lock size={28} className="text-red-400" />,
      color: 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10'
    }
  ];

  // ─── 5. INITIALIZE MASTER BRAIN (POINT 11: AWS TRIGGER) ──────────
  const handleLaunchAI = async () => {
    if (!selectedMode) return;
    
    const modeKeyMap = { ModeA: 'chatbot', ModeB: 'agentic', ModeC: 'superAgentic', OSMode: 'osCreation' };
    const currentKey = modeKeyMap[selectedMode];

    if (userCredits[currentKey] === 0) {
       alert(t("Insufficient AI credits. Please recharge your TriNetra Wallet."));
       return;
    }

    setIsActivating(true);
    try {
      // 🔥 AWS APPSYNC MUTATION: Warm up 6-in-1 Brain on AWS S3/EC2
      const mutation = `
        mutation WarmUpBrain($userId: ID!, $mode: String!) {
          initializeTriNetraBrain(userId: $userId, mode: $mode) {
            status instanceId
          }
        }
      `;
      await client.graphql({
        query: mutation,
        variables: { userId: currentUser?.trinetraId, mode: selectedMode }
      });

      LogRocket.track('AI_BRAIN_INITIALIZED', { mode: selectedMode });
      onLaunchAI(selectedMode); 
    } catch (err) {
      Sentry.captureException(err);
      alert(t("TriNetra Master Brain connection failed. Check AWS CloudWatch."));
    } finally {
      setIsActivating(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#0a1014]"><Loader2 size={50} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-screen bg-[#0a1014] text-white overflow-hidden">
      
      {/* 👁️ Header - Point 11 Identity */}
      <div className="text-center py-8 bg-gradient-to-b from-cyan-950/20 to-transparent">
        <div className="inline-block p-4 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.3)] mb-4 animate-pulse">
            <Zap size={40} className="text-cyan-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-500">
          {t("Master AI Hub")}
        </h1>
        <div className="flex items-center justify-center gap-4 mt-3">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-500"/> {t("AWS WAF Protected")}
           </p>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Scale size={14} className="text-orange-500"/> {t("Auto-Escalation Ready")}
           </p>
        </div>
      </div>

      {/* AI Modes Selection Grid */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-32">
        {aiModes.map((mode) => (
          <div 
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`relative p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${mode.color} ${selectedMode === mode.id ? 'border-opacity-100 scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-white/5 opacity-70'}`}
          >
            <div className="flex gap-5 items-start">
                <div className="p-3 bg-black rounded-2xl border border-white/10">{mode.icon}</div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-black text-lg tracking-wide">{t(mode.name)}</h3>
                        <span className="text-[10px] font-black text-cyan-400 px-2 py-1 bg-cyan-400/10 rounded border border-cyan-400/20">{mode.price}</span>
                    </div>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-3">{t(mode.level)}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={12} className="text-yellow-500" />
                        <span className="text-[11px] font-black text-gray-300 uppercase tracking-tighter">
                            {t(mode.credits)}
                        </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 leading-relaxed">{t(mode.desc)}</p>
                </div>
            </div>
            {selectedMode === mode.id && <div className="absolute top-2 right-2"><Info size={14} className="text-white/20"/></div>}
          </div>
        ))}
      </div>

      {/* 🚀 Launch Button - Point 1 */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0a1014] via-[#0a1014] to-transparent">
        <button 
          onClick={handleLaunchAI}
          disabled={!selectedMode || isActivating}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${selectedMode ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-black shadow-2xl' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
        >
          {isActivating ? <Loader2 size={24} className="animate-spin" /> : <>{t("Initialize 6-in-1 Brain")} <ArrowRight size={22} /></>}
        </button>
      </div>
    </div>
  );
}
