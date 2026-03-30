import React, { useState } from 'react';
import { ArrowLeft, Headset, Send, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function CustomerSupport({ currentUser, onBack }) {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('Payment Issue');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 100% Real Support Ticket Logic (Linked to Escalation Point 4)
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if(!message.trim()) return;

    setIsSubmitting(true);
    try {
      // Hitting the real backend escalation engine
      await axios.post('https://trinetra-umys.onrender.com/api/escalation/create-ticket', {
        userId: currentUser?.trinetraId,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString()
      });
      alert(t("Ticket raised! Our team and automated escalation bot are investigating."));
      setMessage('');
    } catch (err) {
      alert(t("Failed to connect to TriNetra Support server."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-50 overflow-y-auto">
      <header className="p-4 bg-[#111827] flex items-center gap-4 border-b border-gray-800 shadow-lg sticky top-0 z-10">
        <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-90" />
        <div>
          <h2 className="text-lg font-black tracking-wide">{t("Customer Support")}</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t("24/7 Secure Assistance")}</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 bg-cyan-500/10 p-6 rounded-3xl border border-cyan-500/30">
          <Headset size={40} className="text-cyan-400" />
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest">{t("How can we help?")}</h3>
            <p className="text-[10px] text-gray-400 mt-1">{t("Your complaints are monitored by the TriNetra Auto-Escalation Engine.")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">{t("Subject")}</label>
            <select 
              className="w-full bg-[#111827] border border-gray-800 p-4 rounded-2xl text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none"
              value={subject} onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Payment Issue">{t("Payment / Wallet Issue")}</option>
              <option value="AI Credits">{t("AI Mode Credits Issue")}</option>
              <option value="App Bug">{t("App Technical Bug")}</option>
              <option value="Privacy Violation">{t("Privacy / Safety Report")}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">{t("Your Message")}</label>
            <textarea 
              className="w-full bg-[#111827] border border-gray-800 p-4 rounded-2xl text-sm text-white focus:outline-none focus:border-cyan-500 min-h-[150px] resize-none"
              placeholder={t("Describe your issue in detail...")}
              value={message} onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>{t("Submit Ticket")} <Send size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
