// ==========================================
// TRINETRA SUPER APP - THE ECONOMY (File 21)
// Exact Path: src/screens/Economy/WalletAndPayouts.jsx
// Blueprint Point: 6 (Monetization, Boost & Wallet) - 100% ASLI
// ==========================================
import React, { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, ShieldCheck, 
  History, Headset, CreditCard, Loader2, FileText, Download, 
  ArrowLeft, Zap, TrendingUp, DollarSign, X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function WalletAndPayouts({ currentUser, onBack, onNavigateToSupport }) {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('PAYU_INDIA');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 🔥 New: Receipt Preview State (Point 4: In-built Reader)
  const [activeReceipt, setActiveReceipt] = useState(null);

  // ─── 1. REAL AWS FETCH: WALLET & REVENUE DATA (Point 6) ───────────
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!currentUser?.trinetraId) return;
      try {
        // 🔥 Asli AWS GraphQL Query: Fetching real-time balance & split history
        const res = await client.graphql({
          query: `query GetWallet($userId: ID!) {
            getTriNetraWallet(userId: $userId) {
              balance
              transactions {
                id
                type
                amount
                description
                sourceType 
                splitRatio
                receiptUrl
                timestamp
              }
            }
          }`,
          variables: { userId: currentUser.trinetraId }
        });
        
        if (res.data.getTriNetraWallet) {
          setBalance(res.data.getTriNetraWallet.balance);
          setTransactions(res.data.getTriNetraWallet.transactions.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
        }
      } catch (err) {
        console.error("❌ AWS Wallet Sync Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWalletData();
  }, [currentUser]);

  // ─── 2. REAL WITHDRAWAL LOGIC (Point 6: Payout to Bank) ────────────
  const handleWithdraw = async () => {
    if (balance <= 0) return alert(t("Insufficient funds in TriNetra Wallet."));
    
    const confirmWithdraw = window.confirm(`${t("Withdraw")} ₹${balance} ${t("via")} ${selectedGateway}?`);
    if (!confirmWithdraw) return;

    setIsProcessing(true);
    try {
      // 🔥 AWS AppSync Mutation: Triggering Secure Payout via chosen Gateway
      await client.graphql({
        query: `mutation CreatePayout($userId: ID!, $amount: Float!, $gateway: String!) {
          requestTriNetraPayout(userId: $userId, amount: $amount, gateway: $gateway) {
            status
            payoutId
          }
        }`,
        variables: {
          userId: currentUser?.trinetraId,
          amount: parseFloat(balance),
          gateway: selectedGateway
        }
      });

      alert(t("Payout initiated! Funds will reflect in your bank securely via AWS Banking Mesh."));
      setBalance(0); // Update UI
    } catch (err) {
      alert(t("Withdrawal failed. Check AWS Security Logs."));
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── 3. UNIVERSAL RECEIPT DOWNLOAD (Point 4) ──────────────────────
  const downloadReceipt = async (url, id) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `TriNetra_Receipt_${id}.pdf`;
      link.click();
    } catch (e) { alert("Download Failed"); }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center bg-[#0a1014]"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans overflow-y-auto pb-32 animate-fade-in relative">
      
      {/* 🚀 Header */}
      <header className="p-5 bg-[#111827] flex items-center justify-between border-b border-gray-800 shadow-2xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-75 transition-transform" />
          <h2 className="text-xl font-black uppercase tracking-tight">{t("Earnings & Wallet")}</h2>
        </div>
        <ShieldCheck className="text-green-500" size={24} />
      </header>

      <div className="p-5 space-y-6 max-w-2xl mx-auto w-full">
        
        {/* 💳 Master Balance Card (Point 6) */}
        <div className="bg-gradient-to-br from-[#111827] to-cyan-950/30 border border-cyan-500/30 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
            <WalletIcon size={200} className="rotate-12" />
          </div>
          
          <div className="relative z-10">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t("Total TriNetra Earnings")}</p>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-tighter mb-8">
              ₹ {balance.toLocaleString('en-IN')}
            </h1>
            
            <button 
              onClick={handleWithdraw} 
              disabled={isProcessing || balance <= 0}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(6,182,212,0.3)] disabled:opacity-30 disabled:shadow-none"
            >
              {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <><ArrowUpRight size={20} strokeWidth={3} /> {t("Transfer to Bank")}</>}
            </button>
          </div>
        </div>

        {/* 🌐 Select Payout Gateway (Point 6: No Razorpay) */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
            <CreditCard size={14} className="text-cyan-400"/> {t("Secure Payout Gateways")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {['PAYU_INDIA', 'PAYPAL', 'PADDLE', 'ADYEN'].map(gw => (
              <button 
                key={gw}
                onClick={() => setSelectedGateway(gw)}
                className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedGateway === gw ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-xl' : 'bg-[#111827] border-gray-800 text-gray-600 hover:border-gray-600'}`}
              >
                {gw.replace('_', ' ')}
              </button>
            ))}
          </div>
          <p className="text-[8px] text-red-500/50 text-center font-bold uppercase tracking-widest italic">* {t("Razorpay is permanently banned.")}</p>
        </div>

        {/* 📜 Detailed Transaction History (Point 6 Splits) */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
            <History size={16} className="text-violet-400" /> {t("Revenue & Activity History")}
          </h3>
          
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-10 bg-[#111827] rounded-[2rem] border border-gray-800">
                 <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{t("No transactions found.")}</p>
              </div>
            ) : transactions.map(txn => (
              <div key={txn.id} className="bg-[#111827] border border-gray-800 p-5 rounded-3xl hover:border-cyan-500/30 transition-all group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${txn.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {txn.type === 'CREDIT' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-gray-200">{t(txn.description)}</h4>
                        {txn.sourceType === 'BOOST' && <Zap size={12} className="text-yellow-500" />}
                      </div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase mt-1 tracking-tighter">
                        {new Date(txn.timestamp).toLocaleString()} • {txn.splitRatio || '100%'} {t("Revenue Split")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg tracking-tighter ${txn.type === 'CREDIT' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount}
                    </p>
                    {txn.receiptUrl && (
                      <button 
                        onClick={() => setActiveReceipt(txn.receiptUrl)}
                        className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-1 hover:text-white transition-colors"
                      >
                        {t("View Receipt")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🆘 Payment Support (Point 6) */}
        <button 
          onClick={onNavigateToSupport}
          className="w-full bg-[#111827] border border-gray-800 p-5 rounded-[2rem] flex items-center justify-between hover:border-cyan-500/50 transition-all shadow-xl group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 p-3 rounded-2xl group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
              <Headset size={22} />
            </div>
            <div className="text-left">
              <span className="text-sm font-black uppercase tracking-tight text-gray-300">{t("Payment Support")}</span>
              <p className="text-[9px] text-gray-600 font-bold uppercase">{t("Dispute a transaction or split issue")}</p>
            </div>
          </div>
          <span className="text-cyan-500 text-[10px] font-black border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-500/5">24/7</span>
        </button>
      </div>

      {/* 🖼️ IN-BUILT RECEIPT READER MODAL (Point 4) */}
      {activeReceipt && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in">
          <header className="p-5 flex justify-between items-center border-b border-gray-800">
            <h2 className="text-sm font-black uppercase tracking-widest text-cyan-400">{t("Transaction Receipt")}</h2>
            <div className="flex gap-4">
              <button onClick={() => downloadReceipt(activeReceipt, 'TXN')} className="text-gray-400 hover:text-white"><Download size={24}/></button>
              <button onClick={() => setActiveReceipt(null)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
            </div>
          </header>
          <div className="flex-1 bg-white">
             {/* In-built PDF Reader */}
             <iframe src={`${activeReceipt}#toolbar=0`} className="w-full h-full border-none" title="Receipt" />
          </div>
        </div>
      )}

      {/* 🔒 Master Security Footer */}
      <footer className="p-8 text-center bg-[#111827] mt-auto">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-cyan-500"/> AWS SECURITY MESH v6.2 LOCKED
         </p>
      </footer>
    </div>
  );
}
