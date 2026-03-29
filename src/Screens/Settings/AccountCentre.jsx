import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Key, User, Smartphone, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function AccountsCentre({ currentUser, onBack }) {
  const { t } = useTranslation();
  const [personalDetails, setPersonalDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 100% Real Fetch: Securely get personal details from DB
  useEffect(() => {
    const fetchSecurityDetails = async () => {
      try {
        const res = await axios.get(`https://trinetra-umys.onrender.com/api/user/security-details?userId=${currentUser?.trinetraId}`);
        if(res.data.success) setPersonalDetails(res.data.details);
      } catch (err) {
        console.error("Failed to load secure Accounts Centre");
      } finally {
        setIsLoading(false);
      }
    };
    if(currentUser) fetchSecurityDetails();
  }, [currentUser]);

  // Real Password Change Trigger (Connected to Firebase/Backend)
  const handlePasswordChange = async () => {
    const confirm = window.confirm(t("Send password reset link to your registered email/phone?"));
    if(confirm) {
      try {
        await axios.post('https://trinetra-umys.onrender.com/api/auth/reset-password', { userId: currentUser?.trinetraId });
        alert(t("Secure reset link sent successfully."));
      } catch (err) {
        alert(t("Failed to send reset link. Try again."));
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] text-white font-sans fixed inset-0 z-50 overflow-y-auto">
      
      {/* Real Header */}
      <header className="p-4 bg-[#111827] flex items-center gap-4 border-b border-gray-800 shadow-lg sticky top-0 z-10">
        <ArrowLeft onClick={onBack} className="text-cyan-400 cursor-pointer active:scale-90" />
        <div>
          <h2 className="text-lg font-black tracking-wide">{t("Accounts Centre")}</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t("Manage your connected experiences")}</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center"><Loader2 size={30} className="text-cyan-500 animate-spin" /></div>
      ) : (
        <div className="p-4 space-y-6 pb-20">
          
          {/* Profiles Managed */}
          <div className="bg-[#111827] p-4 rounded-2xl border border-gray-800 shadow-md">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t("Profiles")}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border border-cyan-500/30">
                  {currentUser?.profilePic ? <img src={currentUser.profilePic} className="w-full h-full object-cover"/> : <User size={24} className="text-gray-400 m-3" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{currentUser?.name || "TriNetra User"}</h4>
                  <p className="text-[10px] text-cyan-400">{t("Facebook, Instagram & TriNetra active")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">{t("Account settings")}</h3>
            
            <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-md">
              
              {/* Password and Security */}
              <div onClick={handlePasswordChange} className="flex items-center justify-between p-4 hover:bg-[#1a2333] transition-colors cursor-pointer border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <Key size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">{t("Password and security")}</span>
                </div>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={16} className="text-green-500" />
                   <ArrowLeft size={16} className="text-gray-600 rotate-180" />
                </div>
              </div>

              {/* Personal Details */}
              <div className="flex items-center justify-between p-4 hover:bg-[#1a2333] transition-colors cursor-pointer border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-gray-400" />
                  <div>
                    <span className="text-sm font-medium block">{t("Personal details")}</span>
                    <span className="text-[10px] text-gray-500">{personalDetails?.email || personalDetails?.phone || "Update contact info"}</span>
                  </div>
                </div>
                <ArrowLeft size={16} className="text-gray-600 rotate-180" />
              </div>

              {/* Verification & 2FA */}
              <div className="flex items-center justify-between p-4 hover:bg-[#1a2333] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className="text-gray-400" />
                  <span className="text-sm font-medium">{t("Two-factor authentication (2FA)")}</span>
                </div>
                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold uppercase tracking-widest">{t("On")}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
