import React, { useState, useEffect } from 'react';
import { Smartphone, Mail, Github, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, googleProvider, appleProvider, microsoftProvider, githubProvider, setupRecaptcha } from '../../config/firebase';
import { signInWithPopup, signInWithPhoneNumber } from 'firebase/auth';
import axios from 'axios';
import { TriNetraLogo } from '../../App';

export default function LoginScreen({ onLoginSuccess }) {
  const { t } = useTranslation();
  const [method, setMethod] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setupRecaptcha('recaptcha-container');
  }, []);

  // Real API Call to TriNetra Master Engine (Point 2 - Permanent TRN ID)
  const verifyWithBackend = async (provider, authId) => {
    try {
      const res = await axios.post('https://trinetra-umys.onrender.com/api/auth/login', { provider, authId });
      if (res.data.success) {
        onLoginSuccess(res.data.user);
      } else {
        setError(t("Server validation failed."));
      }
    } catch (err) {
      setError(t("Backend Engine offline."));
    } finally {
      setLoading(false);
    }
  };

  // Real Google/Apple Popup Logic
  const handleOAuth = async (providerName, providerObj) => {
    setLoading(true); setError('');
    try {
      const result = await signInWithPopup(auth, providerObj);
      await verifyWithBackend(providerName, result.user.email || result.user.uid);
    } catch (err) {
      setError(`${providerName} login failed.`);
      setLoading(false);
    }
  };

  // Real OTP Logic
  const sendOTP = async (e) => {
    e.preventDefault();
    if(inputVal.length < 10) return setError(t("Enter valid phone number (+91)"));
    setLoading(true); setError('');
    try {
      const confirmation = await signInWithPhoneNumber(auth, inputVal, window.recaptchaVerifier);
      setConfirmResult(confirmation);
    } catch (err) {
      setError(t("OTP failed. Check formatting."));
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const result = await confirmResult.confirm(otp);
      await verifyWithBackend('Phone', result.user.phoneNumber);
    } catch (err) {
      setError(t("Invalid OTP."));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1014] text-white p-6 font-sans relative">
      <div id="recaptcha-container"></div>
      
      <div className="flex flex-col items-center mb-10">
        <div className="mb-4"><TriNetraLogo size={80} pulse={true}/></div>
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          {t("TriNetra")}
        </h1>
        <p className="text-gray-500 text-xs font-bold tracking-widest mt-3 flex items-center gap-2 bg-[#111827] px-4 py-1.5 rounded-full border border-gray-800">
          <ShieldCheck size={14} className="text-green-500"/> {t("Strict Secure Entry")}
        </p>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 text-xs font-bold px-4 py-2 rounded-lg mb-4 text-center w-full max-w-sm">{error}</div>}

      {!method ? (
        <div className="w-full max-w-sm space-y-4">
          <button onClick={() => setMethod('phone')} className="w-full flex items-center gap-4 bg-[#111827] border border-gray-800 hover:border-cyan-500 p-4 rounded-xl transition-all">
            <Smartphone size={20} className="text-cyan-400" />
            <span className="font-bold text-sm tracking-wide">{t("Mobile Number (OTP)")}</span>
          </button>
          
          <button onClick={() => setMethod('email')} className="w-full flex items-center gap-4 bg-[#111827] border border-gray-800 hover:border-violet-500 p-4 rounded-xl transition-all">
            <Mail size={20} className="text-violet-400" />
            <span className="font-bold text-sm tracking-wide">{t("Email Login")}</span>
          </button>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <button onClick={() => handleOAuth('Google', googleProvider)} className="bg-white text-black font-black p-3.5 rounded-xl flex justify-center active:scale-95 text-lg">G</button>
            <button onClick={() => handleOAuth('Apple', appleProvider)} className="bg-gradient-to-b from-gray-700 to-black border border-gray-600 text-white font-black p-3.5 rounded-xl flex justify-center active:scale-95 text-lg"></button>
            <button onClick={() => handleOAuth('Microsoft', microsoftProvider)} className="bg-[#00a4ef] text-white font-black p-3.5 rounded-xl flex justify-center active:scale-95 text-lg">M</button>
          </div>

          <button onClick={() => handleOAuth('GitHub', githubProvider)} className="w-full mt-4 flex items-center justify-center gap-3 bg-[#2b3137] border border-gray-600 p-4 rounded-xl hover:border-gray-400 transition-all">
            <Github size={20} /> <span className="font-bold text-sm">{t("GitHub (AI Mode Only)")}</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-[#111827] p-6 rounded-2xl border border-cyan-500/20">
          <form onSubmit={confirmResult ? verifyOTP : sendOTP} className="flex flex-col gap-4">
            {!confirmResult ? (
              <input type={method === 'phone' ? 'tel' : 'email'} placeholder={method === 'phone' ? '+91 00000 00000' : 'user@email.com'} className="w-full bg-[#0a1014] border border-gray-800 p-4 rounded-xl text-white focus:border-cyan-500" value={inputVal} onChange={(e) => setInputVal(e.target.value)} disabled={loading} required />
            ) : (
              <input type="text" placeholder="OTP" className="w-full bg-[#0a1014] border border-gray-800 p-4 rounded-xl text-white text-center tracking-[0.5em] focus:border-green-500" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={loading} required />
            )}
            <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-4 rounded-xl flex justify-center">
              {loading ? <Loader2 size={20} className="animate-spin" /> : (confirmResult ? t('Verify OTP') : t('Proceed'))}
            </button>
            <button type="button" onClick={() => { setMethod(null); setConfirmResult(null); }} className="w-full text-gray-500 font-bold uppercase text-xs hover:text-white py-2">{t("Back")}</button>
          </form>
        </div>
      )}
    </div>
  );
}
