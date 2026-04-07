// ==========================================
// TRINETRA SUPER APP - THE MASTER ENTRY POINT
// Exact Path: src/index.jsx
// Blueprint Point: 1, 12A, 12H - 100% ASLI ENGINE
// ==========================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 🔥 ASLI INFRASTRUCTURE INITIALIZATION (No Dummy)
import awsAuthConfig from './aws-auth'; // Point 2: AWS Gatekeeper Config
import { Amplify } from 'aws-amplify'; // 🔥 FIX: Official AWS Engine Router
import * as Sentry from "@sentry/react";
import LogRocket from 'logrocket';
import './i18n'; // Point 13: i18next Engine (Small 'i')

// ✅ CONTEXT PROVIDERS (Point 3, 6, 11, 12E & 13)
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// ─── 1. GLOBAL MONITORING (Point 12H: Security Mesh) ─────────────
// Real-time tracking starts here to catch initialization bugs
LogRocket.init('trinetra-super-app/v6');
Sentry.init({
  dsn: "YOUR_SENTRY_DSN_ASLI_KEY", // Replace with your Asli Key
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, 
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// ─── 2. AWS GATEKEEPER STARTUP (Point 1 & 2) ─────────────────────
// 🔥 FIX: Initialize AWS Amplify with the config securely
Amplify.configure(awsAuthConfig);

// ─── 3. MASTER RENDERING ENGINE (6-Platform Support) ─────────────
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      {/* 🛡️ Sentry Error Boundary: Real-time Crash Protection */}
      <Sentry.ErrorBoundary 
        fallback={
          <div className="h-screen bg-[#0a1014] text-white flex flex-col items-center justify-center p-10 text-center font-sans">
            <div className="p-6 border-2 border-cyan-500 rounded-full animate-pulse mb-6">
               <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-cyan-500 fill-none">
                  <path d="M15 50C15 30 50 12 50 12C50 12 85 30 85 50C85 70 50 88 50 88C50 88 15 70 15 50Z" strokeWidth="8" />
               </svg>
            </div>
            <h2 className="text-cyan-400 font-black uppercase tracking-[0.3em] text-xl">TriNetra Link Error</h2>
            <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest leading-loose">
              Secure Satellite Connection Lost. <br /> AWS Security Mesh is re-establishing the link.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-3 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl active:scale-90 transition-all"
            >
              Retry Connection
            </button>
          </div>
        }
      >
        {/* 🌐 Global Context Mesh (A to Z Functional) */}
        <LanguageProvider>
          <ThemeProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>
  );
} else {
  // 🚨 Critical Infrastructure Alert
  console.error("TriNetra Foundation Error: #root element missing from index.html");
  Sentry.captureMessage("CRITICAL_INIT_FAILURE: Root DOM element not found.");
}
