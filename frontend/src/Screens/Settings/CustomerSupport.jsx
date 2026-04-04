// ==========================================
// TRINETRA SUPER APP - CUSTOMER SUPPORT (File 19)
// Exact Path: src/screens/Settings/CustomerSupport.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Headset, Send, MessageSquare, AlertCircle, Loader2, ShieldCheck, Gavel, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy) 🔥
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function CustomerSupport({ currentUser, onBack }) {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('PAYMENT_ISSUE');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── 1. REAL AWS FETCH: TICKET HISTORY (Point 6) ──────────────────
  useEffect(() => {
    fetchMyTickets();
  }, [currentUser]);

  const fetchMyTickets = async () => {
    if (!currentUser?.trinetraId) return;
    try {
      // 🔥 Asli AWS GraphQL Query: Fetching user's support history
      const res = await client.graphql({
        query: `query ListMyTickets($userId: ID!) {
          listTriNetraSupportTickets(userId: $userId) {
            items {
              id
              subject
              message
              status
              escalationLevel
              timestamp
            }
          }
        }`,
        variables: { userId: currentUser.trinetraId }
      });
      setTickets(res.data.listTriNetraSupportTickets.items.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (err) {
      console.error("❌ AWS Support Fetch Failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. REAL AUTO-ESCALATION TICKET TRIGGER (Point 4 & 6) ──────────
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if(!message.trim()) return;

    setIsSubmitting(true);
    try {
      // 🔥 AWS AppSync Mutation: Triggering the Justice Engine
      const mutation = `
        mutation CreateSupportTicket($userId: ID!, $subject: String!, $message: String!) {
          createTriNetraSupportTicket(userId: $userId, subject: $subject, message: $message) {
            id
            status
          }
        }
      `;

      await client.graphql({
        query: mutation,
        variables: {
          userId: currentUser?.trinetraId,
          subject: subject,
          message: message
        }
      });

      alert(t("Ticket Raised! TriNetra Auto-Escalation Engine is now monitoring this case."));
      setMessage('');
      fetchMyTickets(); // Refresh list
    } catch (err) {
      alert(t("Failed to connect to TriNetra Justice Server. Check AWS status."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-[70] overflow-y-auto animate-fade-in">
      
      {/* 🚀 Header */}
      <header className="p-5 bg-[#111827] flex items-center justify-between border-b border-gray-800 shadow-2xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-75 transition-transform" />
          <div>
            <h2 className="text-xl font-black tracking-tight">{t("Support Hub")}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{t("Escalation Engine v2.0")}</p>
          </div>
        </div>
        <ShieldCheck className="text-green-500" size={24} />
      </header>

      <div className="p-5 space-y-8 pb-32 max-w-2xl mx-auto w-full">
        
        {/* 🚨 Point 4: Escalation Status Banner */}
        <div className="flex items-center gap-4 bg-red-900/10 p-6 rounded-[2rem] border border-red-500/30 shadow-inner">
          <div className="bg-red-500 p-3 rounded-2xl text-black">
            <Gavel size={28} className="animate-bounce-slow" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-red-500">{t("Justice Guaranteed")}</h3>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
              {t("Unresolved issues are automatically escalated to MLA -> CM -> Supreme Court.")}
            </p>
          </div>
        </div>

        {/* 📝 New Ticket Form */}
        <form onSubmit={handleSubmitTicket} className="space-y-4 bg-[#111827] p-6 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t("Issue Category")}</label>
            <select 
              className="w-full bg-[#0a1014] border border-gray-800 p-4 rounded-2xl text-sm text-cyan-400 font-bold focus:border-cyan-500 outline-none appearance-none"
              value={subject} onChange={(e) => setSubject(e.target.value)}
            >
              <option value="PAYMENT_ISSUE">{t("Payment / Wallet Issue")}</option>
              <option value="AI_CREDITS">{t("AI Mode Credits Issue")}</option>
              <option value="APP_BUG">{t("App Technical Bug")}</option>
              <option value="PRIVACY_REPORT">{t("Privacy / Safety Report")}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t("Detailed Description")}</label>
            <textarea 
              className="w-full bg-[#0a1014] border border-gray-800 p-4 rounded-2xl text-sm text-white focus:border-cyan-500 outline-none min-h-[120px] resize-none"
              placeholder={t("What happened? (Our AI will scan for escalation triggers)")}
              value={message} onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !message.trim()}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] active:scale-95"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <>{t("Launch Escalation")} <Send size={20} /></>}
          </button>
        </form>

        {/* 📜 Ticket History (Point 6) */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2">{t("Your Support History")}</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 size={30} className="text-gray-700 animate-spin" /></div>
          ) : tickets.length === 0 ? (
            <div className="text-center p-10 border-2 border-dashed border-gray-800 rounded-[2rem] text-gray-600 font-bold uppercase text-[10px] tracking-widest">
              {t("No active tickets found.")}
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-[#111827] border border-gray-800 p-5 rounded-3xl group hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-cyan-500/20">
                        {ticket.subject.replace('_', ' ')}
                      </span>
                      <p className="text-xs font-bold text-gray-200 mt-2 line-clamp-1">{ticket.message}</p>
                    </div>
                    <div className="text-right">
                       <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${ticket.status === 'RESOLVED' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {ticket.status === 'RESOLVED' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                          {t(ticket.status)}
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-800/50">
                    <span className="text-[9px] text-gray-600 font-bold uppercase">{new Date(ticket.timestamp).toLocaleDateString()}</span>
                    <span className="text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1">
                      <Gavel size={10} /> {t("Escalation:")} {ticket.escalationLevel || 'LEVEL_0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* 🔒 Encryption Footer */}
      <div className="p-8 text-center bg-[#111827] mt-auto">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-cyan-500"/> AWS SECURE SUPPORT CHANNEL
         </p>
      </div>
    </div>
  );
}
