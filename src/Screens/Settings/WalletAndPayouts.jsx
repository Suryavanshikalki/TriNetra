// ==========================================
// TRINETRA SUPER APP - WALLET & ECONOMY (File 28)
// Blueprint Point 6: Payouts, Transaction History, 4 Global Gateways
// ==========================================
import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, ShieldCheck, History, Headset, CreditCard, Banknote } from 'lucide-react';
import axios from 'axios';

const t = (text) => text; // Multilanguage Placeholder

export default function WalletScreen({ userId = "TRN-123" }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('PayPal'); // Default

  // 100% Backend Linked (Mocked for UI rendering)
  useEffect(() => {
    // Ye baad me axios.get('/api/payment/wallet') se aayega
    setBalance(15450); // User ki kamai hui balance
    setTransactions([
      { id: 'TXN1', type: 'Credit', desc: 'Paid Boost Earnings (75%)', amount: '+₹3750', date: 'Today, 10:30 AM' },
      { id: 'TXN2', type: 'Debit', desc: 'Super Agentic AI (Mode C)', amount: '-₹9999', date: 'Yesterday' },
      { id: 'TXN3', type: 'Credit', desc: 'Free Boost Ads (30%)', amount: '+₹120', date: '25 Mar 2026' }
    ]);
  }, []);

  // Withdraw Function (Point 6: User transfer to bank)
  const handleWithdraw = () => {
    alert(t(`Initiating withdrawal of ₹${balance} via ${selectedGateway} to your bank account. TriNetra secure transfer started.`));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans overflow-y-auto multilanguage-container p-4">
      
      {/* 💰 Wallet Header Card */}
      <div className="bg-gradient-to-br from-[#111827] to-[#0a1014] border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 p-4 opacity-10"><WalletIcon size={100} /></div>
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
           {t("Available Balance")} <ShieldCheck size={14} className="text-green-500" />
        </h2>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-wide mb-6">
          ₹ {balance.toLocaleString('en-IN')}
        </h1>
        
        <div className="flex gap-4">
          <button onClick={handleWithdraw} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
            <ArrowUpRight size={18} /> {t("Withdraw to Bank")}
          </button>
          <button className="flex-1 bg-[#111827] border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 font-black uppercase text-xs tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
            <ArrowDownRight size={18} /> {t("Add Funds")}
          </button>
        </div>
      </div>

      {/* 🌐 Payment Gateways (Point 6 - No Razorpay) */}
      <div className="mb-6">
        <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
            <CreditCard size={14}/> {t("Select Global Gateway")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
            {['Braintree+PayPal', 'PayU India', 'Paddle', 'Adyen'].map(gateway => (
                <button 
                    key={gateway}
                    onClick={() => setSelectedGateway(gateway)}
                    className={`p-3 rounded-xl border flex items-center justify-center text-xs font-bold tracking-wide transition-all ${selectedGateway === gateway ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-[#111827] border-gray-800 text-gray-400 hover:border-gray-600'}`}
                >
                    {gateway}
                </button>
            ))}
        </div>
      </div>

      {/* 📜 Payment History (Point 6) */}
      <div className="flex-1 bg-[#111827] rounded-3xl border border-gray-800 p-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold tracking-widest flex items-center gap-2">
                <History size={16} className="text-cyan-400" /> {t("Payment History")}
            </h3>
        </div>
        
        <div className="space-y-3">
          {transactions.map(txn => (
            <div key={txn.id} className="flex justify-between items-center p-3 hover:bg-black/20 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${txn.type === 'Credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {txn.type === 'Credit' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-200">{t(txn.desc)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{txn.date}</p>
                </div>
              </div>
              <span className={`font-black tracking-wide ${txn.type === 'Credit' ? 'text-green-400' : 'text-red-400'}`}>
                {txn.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🎧 Customer Support Link (Point 6) */}
      <button className="mt-4 w-full bg-[#111827] border border-gray-800 p-4 rounded-xl flex items-center justify-between hover:border-cyan-500/50 transition-colors group">
        <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                <Headset size={18} />
            </div>
            <span className="font-bold text-sm tracking-wide text-gray-300">{t("Customer Support (Payments)")}</span>
        </div>
        <span className="text-gray-600 text-xs font-bold">24/7</span>
      </button>

    </div>
  );
}
