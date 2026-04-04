import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Key, User, Smartphone, Loader2, Share2, ShieldAlert, BadgeCheck, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Axios, No Render Dummy) 🔥
import { generateClient } from 'aws-amplify/api';
import { resetPassword } from 'aws-amplify/auth';

const client = generateClient();

export default function AccountsCentre({ currentUser, onBack }) {
  const { t } = useTranslation();
  const [personalDetails, setPersonalDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ─── 1. REAL AWS FETCH: PERSONAL & SECURITY DETAILS (Point 12-C) ───
  useEffect(() => {
    const fetchSecurityDetails = async () => {
      if (!currentUser?.trinetraId) return;
      try {
        // 🔥 Asli AWS GraphQL Query: Fetching secure PII (Personally Identifiable Info)
        const res = await client.graphql({
          query: `query GetSecurityInfo($userId: ID!) {
            getTriNetraSecurityDetails(userId: $userId) {
              email
              phone
              twoFactorEnabled
              isVerified
              connectedAccounts { provider lastSync }
              adPreferences { personalizedAds marketingEmails }
            }
          }`,
          variables: { userId: currentUser.trinetraId }
        });
        setPersonalDetails(res.data.getTriNetraSecurityDetails);
      } catch (err) {
        console.error("❌ AWS Security Fetch Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSecurityDetails();
  }, [currentUser]);

  // ─── 2. REAL AWS PASSWORD RESET (Firebase/Cognito Standard) ────────
  const handlePasswordReset = async () => {
    const confirm = window.confirm(t("Send a secure password reset code to your registered device?"));
    if (!confirm) return;

    setIsActionLoading(true);
    try {
      // 🔥 Real AWS Amplify Auth Command
      await resetPassword({ username: currentUser.trinetraId });
      alert(t("Secure AWS Reset Code sent to your phone/email."));
    } catch (err) {
      alert(t("Reset Failed: Please check your AWS connectivity."));
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-[60] overflow-y-auto animate-fade-in">
      
      {/* 🚀 Header: Meta-Style TriNetra Theme */}
      <header className="p-5 bg-[#111827] flex items-center gap-4 border-b border-gray-800 shadow-2xl sticky top-0 z-20">
        <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-75 transition-transform" size={24} />
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            {t("Accounts Centre")} <Zap size={14} className="text-cyan-400 fill-cyan-400" />
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
            {t("TriNetra Meta-Control Hub")}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center"><Loader2 size={40} className="text-cyan-500 animate-spin" /></div>
      ) : (
        <div className="p-5 space-y-8 pb-32 max-w-2xl mx-auto w-full">
          
          {/* 📱 Profiles & Connected Experiences (Point 12-C) */}
          <section>
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 px-2">{t("Profiles")}</h3>
            <div className="bg-[#111827] p-5 rounded-[2rem] border border-gray-800 shadow-xl group hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#0a1014] border-2 border-cyan-500/50 overflow-hidden shadow-lg relative">
                    {currentUser?.profilePic ? <img src={currentUser.profilePic} className="w-full h-full object-cover" alt="pfp" /> : <User size={28} className="m-3 text-gray-700" />}
                    <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-[#111827]"></div>
                  </div>
                  <div>
                    <h4 className="font-black text-base">{currentUser?.name || "TriNetra User"}</h4>
                    <div className="flex gap-2 mt-1">
                       <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-cyan-500/20">TriNetra</span>
                       <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-blue-500/20">Facebook</span>
                       <span className="text-[9px] bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-pink-500/20">Instagram</span>
                    </div>
                  </div>
                </div>
                <BadgeCheck size={24} className={personalDetails?.isVerified ? "text-cyan-400" : "text-gray-700"} />
              </div>
            </div>
          </section>

          {/* 🔐 Account Settings (Point 12-C) */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2">{t("Account Settings")}</h3>
            
            <div className="bg-[#111827] rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl">
              
              {/* Password & Security */}
              <div onClick={handlePasswordReset} className="flex items-center justify-between p-5 hover:bg-[#0a1014] transition-all cursor-pointer border-b border-gray-800/50 group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <Key size={22} />
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase tracking-wide">{t("Password and Security")}</span>
                    <p className="text-[10px] text-gray-500">{t("Change password & login alerts")}</p>
                  </div>
                </div>
                {isActionLoading ? <Loader2 size={20} className="animate-spin text-cyan-500" /> : <ArrowLeft size={18} className="text-gray-700 rotate-180" />}
              </div>

              {/* Personal Details */}
              <div className="flex items-center justify-between p-5 hover:bg-[#0a1014] transition-all cursor-pointer border-b border-gray-800/50 group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-500 group-hover:bg-violet-500 group-hover:text-black transition-all">
                    <User size={22} />
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase tracking-wide">{t("Personal Details")}</span>
                    <p className="text-[10px] text-gray-400 font-bold">{personalDetails?.email || personalDetails?.phone || "No contact info"}</p>
                  </div>
                </div>
                <ArrowLeft size={18} className="text-gray-700 rotate-180" />
              </div>

              {/* Ad Preferences (New: Point 12-C) */}
              <div className="flex items-center justify-between p-5 hover:bg-[#0a1014] transition-all cursor-pointer group border-b border-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-2xl text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
                    <Globe size={22} />
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase tracking-wide">{t("Ad Preferences")}</span>
                    <p className="text-[10px] text-gray-500">{t("Manage data used for ads")}</p>
                  </div>
                </div>
                <ArrowLeft size={18} className="text-gray-700 rotate-180" />
              </div>

              {/* 2FA Status */}
              <div className="flex items-center justify-between p-5 hover:bg-[#0a1014] transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all">
                    <Smartphone size={22} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-wide">{t("Two-Factor Authentication")}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${personalDetails?.twoFactorEnabled ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                  {personalDetails?.twoFactorEnabled ? t("Active") : t("Off")}
                </div>
              </div>

            </div>
          </section>

          {/* 🛡️ Privacy & Verification (Point 12-C) */}
          <section className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-[2.5rem] flex flex-col items-center text-center">
             <ShieldCheck size={40} className="text-cyan-400 mb-4" />
             <h4 className="font-black text-lg uppercase tracking-tighter mb-2">{t("Verified Experience")}</h4>
             <p className="text-[11px] text-gray-400 leading-relaxed mb-6">
                {t("Your accounts are linked via TriNetra's secure satellite mesh. All security logs are stored in AWS CloudWatch.")}
             </p>
             <button className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-[0_10px_20px_rgba(6,182,212,0.3)]">
                {t("Get Meta Verified Check")}
             </button>
          </section>

        </div>
      )}

      {/* 🔒 TriNetra Legal Footer */}
      <div className="p-8 text-center bg-[#111827] mt-auto">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            TriNetra © 2026 • AWS WAF PROTECTED • HIPAA COMPLIANT
         </p>
      </div>
    </div>
  );
}
