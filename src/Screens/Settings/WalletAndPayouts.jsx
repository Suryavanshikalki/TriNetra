import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, ShieldCheck, History, Headset, CreditCard, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function WalletAndPayouts({ currentUser }) {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('Braintree+PayPal'); // Default Gateway
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // 100% Real Fetch: Wallet Balance & History from TriNetra DB
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await axios.get(`https://trinetra-umys.onrender.com/api/payment/wallet?userId=${currentUser?.trinetraId}`);
        if (res.data.success) {
          setBalance(res.data.balance);
          setTransactions(res.data.history);
        }
      } catch (err) {
        console.error("Wallet DB Offline");
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser?.trinetraId) fetchWalletData();
  }, [currentUser]);

  // Real Withdrawal Request to Backend
  const handleWithdraw = async () => {
    if (balance <= 0) return alert(t("Insufficient balance to withdraw."));
    setIsProcessing(true);
    try {
      // Hitting the real backend route (File 53 Payment Controller)
      const res = await axios.post('https://trinetra-umys.onrender.com/api/payment/withdraw', {
        userId: currentUser?.trinetraId,
        amount: balance,
        gateway: selectedGateway
      });
      if(res.data.success) {
        alert(t(`Withdrawal of ₹${balance} via ${selectedGateway} initiated successfully. Funds will reflect in your bank soon.`));
        setBalance(0); // Update local state after success
      }
    } catch (err) {
      alert(t("Withdrawal request failed. Secure connection error."));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center bg-[#0a1014]"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans overflow-y-auto p-4">
      
      {/* Real Wallet Balance Card */}
      <div className="bg-gradient-to-br from-[#111827] to-[#0a1014] border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden mb-6 mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10"><WalletIcon size={100} /></div>
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
           {t("Available Balance")} <ShieldCheck size={14} className="text-green-500" />
        </h2>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-wide mb-6">
          ₹ {balance.toLocaleString('en-IN')}
        </h1>
        
        <div className="flex gap-4 relative z-10">
          <button onClick={handleWithdraw} disabled={isProcessing} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><ArrowUpRight size={18} /> {t("Withdraw to Bank")}</>}
          </button>
        </div>
      </div>

      {/* Point 6: 4 Global Gateways (No Razorpay) */}
      <div className="mb-6">
        <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
            <CreditCard size={14}/> {t("Select Global Gateway for Payout")}
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

      {/* Point 6: Real Transaction History */}
      <div className="flex-1 bg-[#111827] rounded-3xl border border-gray-800 p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold tracking-widest flex items-center gap-2">
                <History size={16} className="text-cyan-400" /> {t("Payment History")}
            </h3>
        </div>
        
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center text-gray-500 text-xs py-4">{t("No transactions yet.")}</div>
          ) : transactions.map(txn => (
            <div key={txn._id} className="flex justify-between items-center p-3 bg-[#0a1014] rounded-xl border border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${txn.type === 'Credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {txn.type === 'Credit' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-200">{t(txn.description)}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-black tracking-wide ${txn.type === 'Credit' ? 'text-green-400' : 'text-red-400'}`}>
                {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Point 6: Customer Support Routing */}
      <button className="w-full bg-[#111827] border border-gray-800 p-4 rounded-xl flex items-center justify-between hover:border-cyan-500/50 transition-colors group mb-6">
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
