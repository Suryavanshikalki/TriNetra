import React, { useState } from 'react';
import { Smartphone, Mail, Github, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (No Firebase, No Axios, No Render) 🔥
import { signIn, confirmSignIn, signInWithRedirect } from 'aws-amplify/auth';
import { TriNetraLogo } from '../../App'; // Your Universal Logo

export default function LoginScreen({ onLoginSuccess }) {
  const { t } = useTranslation();
  const [method, setMethod] = useState(null); // 'phone' or 'email'
  const [inputVal, setInputVal] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ─── 1. REAL AWS OTP SENDER (Cognito) ─────────────────────────
  const sendOTP = async (e) => {
    e.preventDefault();
    if(method === 'phone' && inputVal.length < 10) return setError(t("Enter valid phone number (+91)"));
    
    setLoading(true); 
    setError('');
    
    try {
      // 🔥 Asli AWS Cognito Call (SMS/Email OTP Trigger)
      const { nextStep } = await signIn({ username: inputVal });
      
      if (
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_MFA_CODE' || 
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE'
      ) {
        setIsOtpSent(true);
      } else if (nextStep.signInStep === 'DONE') {
        // If passwordless/auto-verified
        fetchUserAndProceed();
      }
    } catch (err) {
      console.error("AWS Auth Error:", err);
      setError(t("Failed to send OTP. Check your details."));
    } finally {
      setLoading(false);
    }
  };

  // ─── 2. REAL AWS OTP VERIFIER ──────────────────────────────────
  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');
    
    try {
      // 🔥 Confirming OTP strictly via AWS
      const { nextStep } = await confirmSignIn({ challengeResponse: otp });
      
      if (nextStep.signInStep === 'DONE') {
        fetchUserAndProceed();
      }
    } catch (err) {
      setError(t("Invalid OTP or expired."));
    } finally {
      setLoading(false);
    }
  };

  // ─── 3. REAL AWS SOCIAL LOGIN (Google, Apple, Microsoft) ──────
  const handleOAuth = async (providerName) => {
    setLoading(true); 
    setError('');
    try {
      // Direct AWS Cognito Hosted UI / Federation
      await signInWithRedirect({ provider: providerName });
      // Note: AWS will auto-redirect back to the app and trigger Auth Hub listener
    } catch (err) {
      setError(`${providerName} login failed securely.`);
      setLoading(false);
    }
  };

  // ─── 4. GITHUB LOGIN (POINT 2: AI ONLY MODE) ───────────────────
  const handleGitHubLogin = async () => {
    setLoading(true);
    try {
      // We pass customState 'AI_MODE_ONLY' so AWS knows to restrict this user
      await signInWithRedirect({ 
        provider: 'GitHub',
        customState: 'AI_MODE_ONLY' 
      });
    } catch (err) {
      setError("GitHub auth failed.");
      setLoading(false);
    }
  };

  // Fetch final user data from AWS after successful entry
  const fetchUserAndProceed = async () => {
    // onLoginSuccess will trigger fetching full profile from AppSync
    onLoginSuccess();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1014] text-white p-6 font-sans relative">
      
      {/* Universal TriNetra Logo & Strict Entry Message */}
      <div className="flex flex-col items-center mb-10">
        <div className="mb-4"><TriNetraLogo size={80} pulse={true}/></div>
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          {t("TriNetra")}
        </h1>
        <p className="text-gray-500 text-xs font-bold tracking-widest mt-3 flex items-center gap-2 bg-[#111827] px-4 py-1.5 rounded-full border border-gray-800">
          <ShieldCheck size={14} className="text-green-500"/> {t("AWS Secured Strict Entry")}
        </p>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 text-xs font-bold px-4 py-2 rounded-lg mb-4 text-center w-full max-w-sm border border-red-500/20">{error}</div>}

      {!method ? (
        <div className="w-full max-w-sm space-y-4 animate-fade-in-up">
          
          {/* Main Entry Methods */}
          <button onClick={() => setMethod('phone')} className="w-full flex items-center gap-4 bg-[#111827] border border-gray-800 hover:border-cyan-500 p-4 rounded-xl transition-all shadow-lg active:scale-95">
            <Smartphone size={20} className="text-cyan-400" />
            <span className="font-bold text-sm tracking-wide">{t("Mobile Number (OTP)")}</span>
          </button>
          
          <button onClick={() => setMethod('email')} className="w-full flex items-center gap-4 bg-[#111827] border border-gray-800 hover:border-violet-500 p-4 rounded-xl transition-all shadow-lg active:scale-95">
            <Mail size={20} className="text-violet-400" />
            <span className="font-bold text-sm tracking-wide">{t("Email Login")}</span>
          </button>

          {/* Point 2: Social OAuth Methods */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button onClick={() => handleOAuth('Google')} title="Google" className="bg-white text-black font-black p-3.5 rounded-xl flex justify-center shadow-lg active:scale-95 text-lg transition-transform hover:scale-105">G</button>
            <button onClick={() => handleOAuth('Apple')} title="Apple" className="bg-gradient-to-b from-gray-700 to-black border border-gray-600 text-white font-black p-3.5 rounded-xl flex justify-center shadow-lg active:scale-95 text-lg transition-transform hover:scale-105"></button>
            <button onClick={() => handleOAuth('Microsoft')} title="Microsoft" className="bg-[#00a4ef] text-white font-black p-3.5 rounded-xl flex justify-center shadow-lg active:scale-95 text-lg transition-transform hover:scale-105">M</button>
          </div>

          {/* Point 2: GitHub (AI Mode Only) */}
          <button onClick={handleGitHubLogin} className="w-full mt-4 flex items-center justify-center gap-3 bg-[#111827] border border-gray-800 p-4 rounded-xl hover:border-green-500 transition-all shadow-lg active:scale-95 group">
            <Github size={20} className="text-gray-400 group-hover:text-green-400 transition-colors" /> 
            <span className="font-bold text-sm text-gray-400 group-hover:text-white transition-colors">{t("GitHub (AI OS Mode Only)")}</span>
          </button>
        </div>
      ) : (
        /* OTP Input Forms */
        <div className="w-full max-w-sm bg-[#111827] p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] animate-fade-in-up">
          <form onSubmit={isOtpSent ? verifyOTP : sendOTP} className="flex flex-col gap-4">
            
            {!isOtpSent ? (
              <input 
                type={method === 'phone' ? 'tel' : 'email'} 
                placeholder={method === 'phone' ? '+91 0000000000' : 'trinetra@example.com'} 
                className="w-full bg-[#0a1014] border border-gray-800 p-4 rounded-xl text-white focus:border-cyan-500 outline-none transition-colors" 
                value={inputVal} 
                onChange={(e) => setInputVal(e.target.value)} 
                disabled={loading} 
                required 
              />
            ) : (
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                className="w-full bg-[#0a1014] border border-cyan-500 p-4 rounded-xl text-white text-center tracking-[0.5em] font-bold outline-none shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                disabled={loading} 
                required 
              />
            )}

            <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-4 rounded-xl flex justify-center transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              {loading ? <Loader2 size={20} className="animate-spin" /> : (isOtpSent ? t('Verify AWS OTP') : t('Proceed'))}
            </button>
            
            <button type="button" onClick={() => { setMethod(null); setIsOtpSent(false); }} className="w-full text-gray-500 font-bold uppercase tracking-widest text-[10px] hover:text-white py-2 transition-colors">
              {t("Cancel & Go Back")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
