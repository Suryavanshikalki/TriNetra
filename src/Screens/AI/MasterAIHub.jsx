import React, { useState, useEffect } from 'react';
import { BrainCircuit, Cpu, Zap, Globe, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function MasterAIHub({ currentUser, onLaunchAI }) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState(null);
  const [userCredits, setUserCredits] = useState({ chatbot: 8, agentic: 20, superAgentic: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  // 100% Real Fetch: Checking User's Current AI Credits from DB
  useEffect(() => {
    const fetchAICredits = async () => {
      try {
        const res = await axios.get(`https://trinetra-umys.onrender.com/api/ai/credits?userId=${currentUser?.trinetraId}`);
        if (res.data.success) {
          setUserCredits(res.data.credits);
        }
      } catch (err) {
        console.error("AI Engine Offline");
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser?.trinetraId) fetchAICredits();
  }, [currentUser]);

  // Point 11: Real Blueprint Pricing & Modes
  const aiModes = [
    {
      id: 'ModeA',
      name: 'Mode A: Chatbot AI',
      level: '(GPT / Gemini / DeepSeek / Meta)',
      credits: userCredits.chatbot === -1 ? 'Unlimited' : `${userCredits.chatbot} msgs left`,
      desc: 'Free Lifetime Meta AI basics. Free Premium (8 msgs). Paid for Unlimited.',
      icon: <BrainCircuit size={28} className="text-cyan-400" />,
      color: 'border-cyan-500/50 hover:border-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'ModeB',
      name: 'Mode B: Agentic AI',
      level: '(Manus / Emergent Level)',
      credits: `${userCredits.agentic} credits left`,
      desc: 'Does complex tasks, coding, GitHub uploads. 300 credits/month on recharge.',
      icon: <Cpu size={28} className="text-violet-400" />,
      color: 'border-violet-500/50 hover:border-violet-400 bg-violet-500/10'
    },
    {
      id: 'ModeC',
      name: 'Mode C: Super Agentic AI',
      level: '(100% Human-Brain Level)',
      credits: `${userCredits.superAgentic} credits left`,
      desc: 'Thinks, feels, and invents like a human, but 100% controlled. No violence. ₹9999/month (900 credits).',
      icon: <Globe size={28} className="text-green-400" />,
      color: 'border-green-500/50 hover:border-green-400 bg-green-500/10'
    },
    {
      id: 'OSMode',
      name: 'OS Creation Tier',
      level: '(Ultimate Power)',
      credits: 'Restricted Access',
      desc: 'Most expensive plan. Build a full Operating System using AI.',
      icon: <Lock size={28} className="text-red-400" />,
      color: 'border-red-500/50 hover:border-red-400 bg-red-500/10'
    }
  ];

  // Real Initialization Logic
  const handleLaunchAI = async () => {
    if (!selectedMode) return;
    
    // Check if user has credits for the selected mode
    const modeKey = selectedMode === 'ModeA' ? 'chatbot' : selectedMode === 'ModeB' ? 'agentic' : 'superAgentic';
    if (selectedMode !== 'OSMode' && userCredits[modeKey] === 0) {
       alert(t("Insufficient credits. Please recharge your AI Wallet."));
       return;
    }

    setIsActivating(true);
    try {
      // Real API hitting your TriNetra Backend to warm up the 6-in-1 AI models
      await axios.post('https://trinetra-umys.onrender.com/api/ai/initialize', {
        userId: currentUser?.trinetraId,
        mode: selectedMode
      });
      onLaunchAI(selectedMode); // Opens the AIChatWindow (File 19)
    } catch (err) {
      alert(t("Failed to connect to the Master 6-in-1 Brain."));
    } finally {
      setIsActivating(false);
    }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center bg-[#0a1014]"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans overflow-y-auto p-4">
      
      {/* Header - Alag Pehchan (Point 11) */}
      <div className="text-center mb-8 mt-6">
        <div className="inline-block p-5 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.4)] mb-4">
            <Zap size={40} className="text-cyan-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          {t("Master AI Brain")}
        </h1>
        <p className="text-xs text-gray-400 mt-2 font-bold tracking-widest uppercase flex items-center justify-center gap-2">
           <ShieldCheck size={14} className="text-green-500"/> {t("6-in-1 Auto-Switch Engine")}
        </p>
      </div>

      {/* AI Modes Selection */}
      <div className="space-y-4 mb-24">
        {aiModes.map((mode) => (
          <div 
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`relative p-5 rounded-2xl border cursor-pointer transition-all active:scale-95 overflow-hidden ${mode.color} ${selectedMode === mode.id ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-[1.02] border-opacity-100' : 'opacity-80 border-gray-800'}`}
          >
            <div className="flex gap-4 items-start">
                <div className="mt-1 bg-[#0a1014] p-2 rounded-xl border border-gray-800">{mode.icon}</div>
                <div>
                    <h3 className="font-black text-lg tracking-wide">{t(mode.name)}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t(mode.level)}</p>
                    
                    <span className="inline-block bg-black/60 border border-gray-700 px-2 py-1 rounded text-[10px] font-bold text-white mb-2 tracking-widest">
                        {t(mode.credits)}
                    </span>
                    
                    <p className="text-xs text-gray-300 leading-relaxed pr-2">{t(mode.desc)}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Launch Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#0a1014]/90 backdrop-blur-md border-t border-gray-800 pb-20">
        <button 
          onClick={handleLaunchAI}
          disabled={!selectedMode || isActivating}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedMode ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
          {isActivating ? <Loader2 size={20} className="animate-spin" /> : <>{t("Initialize Brain")} <ArrowRight size={20} /></>}
        </button>
      </div>
    </div>
  );
}
