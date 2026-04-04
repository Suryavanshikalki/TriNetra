// ==========================================
// TRINETRA SUPER APP - BOOST ENGINE (File 18)
// Exact Path: src/screens/Economy/BoostSubscriptions.jsx
// ==========================================
import React, { useState } from 'react';
import { Rocket, Zap, TrendingUp, ShieldCheck, CheckCircle2, DollarSign, Loader2, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function BoostSubscriptions({ currentUser, postIdToBoost = null, onBack }) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('PAYU_INDIA');
  const [duration, setDuration] = useState('MONTHLY'); // 'DAILY' or 'MONTHLY'
  const [isProcessing, setIsProcessing] = useState(false);

  // ─── 1. 100% BLUEPRINT PRICING & SPLITS (Point 7, 8, 9, 10) ────────
  const boostPlans = [
    {
      id: 'FREE_BOOST',
      title: 'Free Boost (70/30)',
      dailyPrice: 0,
      monthlyPrice: 0,
      split: '70% TriNetra / 30% You',
      desc: 'Free reach via Ads. TriNetra keeps 70%, You keep 30%.',
      icon: <Zap size={24} className="text-yellow-400" />,
      bg: 'bg-yellow-500/10', border: 'border-yellow-500/50'
    },
    {
      id: 'PAID_BOOST_BASIC',
      title: 'Paid Boost (25/75)',
      dailyPrice: 349,
      monthlyPrice: 10000,
      split: '25% TriNetra / 75% You',
      desc: 'Paid reach. No monetization required. You keep 75% of profit.',
      icon: <TrendingUp size={24} className="text-cyan-400" />,
      bg: 'bg-cyan-500/10', border: 'border-cyan-500/50'
    },
    {
      id: 'PAID_BOOST_MONETIZATION',
      title: 'Paid Boost + Monetization',
      dailyPrice: 799,
      monthlyPrice: 20000,
      split: '100% You (Full Profit)',
      desc: 'Maximum reach + Full Monetization. 100% earnings go to your wallet.',
      icon: <DollarSign size={24} className="text-violet-400" />,
      bg: 'bg-violet-500/10', border: 'border-violet-500/50'
    },
    {
      id: 'PRO_AUTO_BOOST',
      title: 'Pro Auto-Boost',
      dailyPrice: 1500, // Estimated for daily
      monthlyPrice: 28000,
      split: '30% TriNetra / 70% You',
      desc: 'Politics/Marketing. Interest-based auto-targeting for followers.',
      icon: <ShieldCheck size={24} className="text-green-400" />,
      bg: 'bg-green-500/10', border: 'border-green-500/50'
    }
  ];

  // ─── 2. REAL AWS PAYMENT INITIALIZATION (Point 6) ──────────────────
  const handleBoostPayment = async () => {
    if(!selectedPlan) return alert(t("Select a Plan first."));
    
    setIsProcessing(true);
    const plan = boostPlans.find(p => p.id === selectedPlan);
    const finalAmount = duration === 'DAILY' ? plan.dailyPrice : plan.monthlyPrice;

    try {
      // 🔥 AWS AppSync Mutation: Creates a secure checkout session
      const mutation = `
        mutation CreateBoostOrder($userId: ID!, $planId: String!, $duration: String!, $gateway: String!, $amount: Float!, $postId: ID) {
          createTriNetraBoostOrder(userId: $userId, planId: $planId, duration: $duration, gateway: $gateway, amount: $amount, postId: $postId) {
            orderId
            checkoutUrl
            status
          }
        }
      `;

      const res = await client.graphql({
        query: mutation,
        variables: {
          userId: currentUser?.trinetraId,
          planId: selectedPlan,
          duration: duration,
          gateway: selectedGateway,
          amount: parseFloat(finalAmount),
          postId: postIdToBoost
        }
      });

      const { checkoutUrl, status } = res.data.createTriNetraBoostOrder;

      if (status === 'SUCCESS' && checkoutUrl) {
        // 🔥 Redirect to real PayU, PayPal, Paddle or Adyen
        window.location.href = checkoutUrl;
      } else if (selectedPlan === 'FREE_BOOST') {
        alert(t("Free Boost Activated! Ads will now scale your content."));
        onBack();
      }

    } catch (err) {
      console.error("❌ AWS Boost Error:", err);
      alert(t("Gateway connection failed securely."));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-[70] overflow-y-auto animate-fade-in">
      
      {/* 🚀 Header */}
      <header className="p-5 bg-[#111827] flex items-center justify-between border-b border-gray-800 shadow-2xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-75 transition-transform" />
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            {t("Boost Engine")} <Rocket size={20} className="text-cyan-400 animate-pulse" />
          </h2>
        </div>
        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest border border-gray-800 px-3 py-1 rounded-full">
           AWS SECURE
        </div>
      </header>

      <div className="p-5 space-y-6 pb-40 max-w-2xl mx-auto w-full">
        
        {/* 📅 Duration Switcher (Point 8 & 9) */}
        <div className="flex bg-[#111827] p-1.5 rounded-2xl border border-gray-800 shadow-inner">
           <button 
             onClick={() => setDuration('DAILY')}
             className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${duration === 'DAILY' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-500'}`}
           >
             <Clock size={14}/> {t("Daily Plan")}
           </button>
           <button 
             onClick={() => setDuration('MONTHLY')}
             className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${duration === 'MONTHLY' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-500'}`}
           >
             <Calendar size={14}/> {t("Monthly Plan")}
           </button>
        </div>

        {/* 💳 Gateway Selection (Point 6 - NO RAZORPAY) */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t("Select Secure Gateway")}</h3>
          <div className="grid grid-cols-2 gap-3">
            {['PAYU_INDIA', 'PAYPAL', 'PADDLE', 'ADYEN'].map(gw => (
              <button 
                key={gw}
                onClick={() => setSelectedGateway(gw)}
                className={`py-3 rounded-xl text-[9px] font-black border transition-all ${selectedGateway === gw ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-800 bg-[#111827] text-gray-500'}`}
              >
                {gw.replace('_', ' ')}
              </button>
            ))}
          </div>
          <p className="text-[8px] text-red-500/70 text-center font-bold uppercase tracking-tighter italic">
            * {t("Razorpay is permanently disabled by TriNetra Security.")}
          </p>
        </div>

        {/* 📈 Boost Plans Grid */}
        <div className="space-y-4">
          {boostPlans.map((plan) => {
            const price = duration === 'DAILY' ? plan.dailyPrice : plan.monthlyPrice;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer group active:scale-95 ${isSelected ? `${plan.border} ${plan.bg} shadow-2xl` : 'border-gray-800 bg-[#111827] hover:border-gray-700'}`}
              >
                {isSelected && <CheckCircle2 className="absolute top-5 right-5 text-cyan-400" size={24} />}
                
                <div className="flex gap-5">
                    <div className={`p-4 rounded-2xl ${isSelected ? 'bg-white/10' : 'bg-black/40'} transition-colors`}>
                      {plan.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-base uppercase tracking-tight text-white mb-1">{t(plan.title)}</h3>
                        <p className="text-cyan-400 font-black text-xl tracking-tighter">
                          {price === 0 ? 'FREE' : `₹${price.toLocaleString()}`}
                          <span className="text-[10px] text-gray-500 ml-1">/ {duration.toLowerCase()}</span>
                        </p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                           <span className="bg-black/60 border border-gray-800 px-3 py-1 rounded-full text-[9px] font-black text-gray-300 uppercase tracking-widest">
                             {t("Split:")} {plan.split}
                           </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-3 leading-relaxed font-medium">{t(plan.desc)}</p>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 Fixed Bottom Call to Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-[#0a1014]/90 backdrop-blur-2xl border-t border-gray-800 pb-10 z-30">
        <button 
          onClick={handleBoostPayment}
          disabled={!selectedPlan || isProcessing}
          className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex justify-center items-center gap-3 shadow-2xl active:scale-95
            ${selectedPlan ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_10px_30px_rgba(6,182,212,0.4)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
          `}
        >
          {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <>{t("Activate Boost Engine")} <TrendingUp size={18}/></>}
        </button>
      </div>
    </div>
  );
}
