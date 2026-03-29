import React, { useState } from 'react';
import { Rocket, Zap, TrendingUp, ShieldCheck, CheckCircle2, DollarSign, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function BoostSubscriptions({ currentUser, postIdToBoost = null }) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('PayU India');
  const [isProcessing, setIsProcessing] = useState(false);

  // 100% Blueprint Rates & Splits (Point 7, 8, 9, 10)
  const boostPlans = [
    {
      id: 'FreeBoost',
      title: 'Free Boost',
      price: 0,
      priceDisplay: '₹0',
      split: '70% TriNetra / 30% You',
      desc: 'Free reach. Ads will run on your post. You keep 30% of earnings.',
      icon: <Zap size={24} className="text-yellow-400" />,
      bg: 'bg-yellow-500/10', border: 'border-yellow-500/50'
    },
    {
      id: 'PaidBoost',
      title: 'Paid Boost',
      price: 5000,
      priceDisplay: '₹5,000',
      split: '25% TriNetra / 75% You',
      desc: 'Pay for reach. You keep 75% of all ad monetization benefits.',
      icon: <TrendingUp size={24} className="text-cyan-400" />,
      bg: 'bg-cyan-500/10', border: 'border-cyan-500/50'
    },
    {
      id: 'PaidBoostMonetization',
      title: 'Paid Boost + Monetization',
      price: 7500,
      priceDisplay: '₹7,500',
      split: '100% You (Full Profit)',
      desc: 'Ultimate reach + Full Monetization. 100% earnings go to your wallet.',
      icon: <DollarSign size={24} className="text-violet-400" />,
      bg: 'bg-violet-500/10', border: 'border-violet-500/50'
    },
    {
      id: 'ProAutoBoost',
      title: 'Pro Auto-Boost',
      price: 10000,
      priceDisplay: '₹10,000 / month',
      split: '30% TriNetra / 70% You',
      desc: 'For Politics/Marketing. System auto-finds exact target followers.',
      icon: <ShieldCheck size={24} className="text-green-400" />,
      bg: 'bg-green-500/10', border: 'border-green-500/50'
    }
  ];

  // Real Payment Initialization to Backend
  const handlePayment = async () => {
    if(!selectedPlan) return alert(t("Please select a Boost Plan first."));
    
    setIsProcessing(true);
    const planDetails = boostPlans.find(p => p.id === selectedPlan);

    try {
      const res = await axios.post('https://trinetra-umys.onrender.com/api/payment/recharge', {
        userId: currentUser?.trinetraId,
        type: selectedPlan,
        amount: planDetails.price,
        gateway: selectedGateway,
        postId: postIdToBoost
      });
      
      if(res.data.success) {
        alert(t(`${planDetails.title} activated successfully via ${selectedGateway}. Rules applied.`));
      }
    } catch (err) {
      alert(t("Payment gateway connection failed."));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans overflow-y-auto p-4">
      
      <div className="text-center mb-6 mt-2">
        <div className="inline-block p-4 rounded-full bg-cyan-900/30 border border-cyan-500/30 mb-4">
            <Rocket size={32} className="text-cyan-400" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
          {t("TriNetra Boost Engine")}
        </h1>
      </div>

      {/* Gateway Selection for Buying Plans */}
      <div className="mb-4">
        <select 
          className="w-full bg-[#111827] border border-gray-800 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500"
          value={selectedGateway}
          onChange={(e) => setSelectedGateway(e.target.value)}
        >
          <option value="PayU India">PayU India</option>
          <option value="Braintree+PayPal">Braintree + PayPal</option>
          <option value="Paddle">Paddle</option>
          <option value="Adyen">Adyen</option>
        </select>
        <p className="text-[10px] text-gray-500 mt-1 uppercase text-center font-bold tracking-widest">{t("Razorpay is permanently disabled")}</p>
      </div>

      <div className="space-y-4 mb-24">
        {boostPlans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative p-5 rounded-2xl border cursor-pointer transition-all active:scale-95 ${selectedPlan === plan.id ? `${plan.border} ${plan.bg} shadow-[0_0_15px_rgba(6,182,212,0.2)]` : 'border-gray-800 bg-[#111827]'}`}
          >
            {selectedPlan === plan.id && <div className="absolute top-4 right-4 text-cyan-400"><CheckCircle2 size={20} /></div>}
            
            <div className="flex gap-4">
                <div className="mt-1">{plan.icon}</div>
                <div>
                    <h3 className="font-black text-lg tracking-wide mb-1">{t(plan.title)}</h3>
                    <p className="text-cyan-400 font-bold text-sm tracking-widest mb-2">{plan.priceDisplay}</p>
                    <span className="inline-block bg-black/50 border border-gray-700 px-2 py-1 rounded text-[10px] font-bold text-gray-300 mb-2 uppercase tracking-wider">
                        {t("Revenue Split:")} {t(plan.split)}
                    </span>
                    <p className="text-xs text-gray-500 leading-relaxed pr-6">{t(plan.desc)}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#0a1014]/90 backdrop-blur-md border-t border-gray-800 pb-20">
        <button 
          onClick={handlePayment}
          disabled={!selectedPlan || isProcessing}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 ${selectedPlan ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
          {isProcessing ? <Loader2 size={20} className="animate-spin" /> : t("Proceed to Payment")}
        </button>
      </div>
    </div>
  );
}
