// ==========================================
// TRINETRA SUPER APP - GLOBAL i18n ENGINE (File 37)
// Exact Path: src/i18n.js
// Blueprint Point: 1, 4, 6, 11, 12E & 13 - 100% ASLI
// ==========================================
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ─── 1. REAL GLOBAL DICTIONARY (Point 13: Universal Hub) ──────────
const resources = {
  // 🇺🇸 ENGLISH (Global Master)
  en: {
    translation: {
      "app_name": "TriNetra",
      "tagline": "The Ultimate 100% Super App",
      
      // Point 2: Gatekeeper
      "login_secure": "Strict Secure Entry",
      "mobile_otp": "Mobile Number (OTP)",
      "email_auth": "Email Identity Login",
      "github_ai": "GitHub (AI Coding Mode Only)",
      "verify": "Verify Identity",
      
      // Point 4: Escalation Engine (Asli Logic)
      "escalate_issue": "Escalate to Authority",
      "authority_level": "Current Stage: {{level}}",
      "justice_engine": "Justice Monitoring Active",
      
      // Point 6: The Economy
      "wallet": "TriNetra Wallet",
      "payout": "Bank Transfer",
      "boost_free": "Free Boost (70/30 Split)",
      "boost_paid": "Paid Boost (25/75 Split)",
      "boost_pro": "Pro Monetization (100% User)",
      
      // Point 11: Master AI Brain
      "ai_chatbot": "Mode A: Chatbot",
      "ai_agentic": "Mode B: Agentic AI",
      "ai_super": "Mode C: Super Agentic (Human Brain)",
      "os_tier": "OS Creation Tier",
      
      // Point 12A: Navigation
      "home": "Home",
      "reels": "Reels",
      "chat": "Messenger",
      "dashboard": "Dashboard",
      "menu": "Settings & Menu"
    }
  },

  // 🇮🇳 HINDI (Local Master)
  hi: {
    translation: {
      "app_name": "त्रिनेत्र",
      "tagline": "100% अल्टीमेट सुपर ऐप",
      "login_secure": "सख्त सुरक्षित प्रवेश",
      "mobile_otp": "मोबाइल नंबर (OTP)",
      "github_ai": "गिटहब (सिर्फ AI कोडिंग मोड)",
      "escalate_issue": "अधिकारी को शिकायत भेजें",
      "authority_level": "वर्तमान स्तर: {{level}}",
      "wallet": "त्रिनेत्र वॉलेट",
      "payout": "बैंक में ट्रांसफर",
      "boost_pro": "प्रो मॉनेटाइजेशन (100% आपकी कमाई)",
      "ai_super": "सुपर एजेंटिक AI (मानव मस्तिष्क)",
      "home": "होम",
      "reels": "रील्स",
      "chat": "मैसेंजर",
      "menu": "सेटिंग्स और मेनू"
    }
  },

  // 🇸🇦 ARABIC (RTL Support - Point 13)
  ar: {
    translation: {
      "app_name": "تراي نيترا",
      "login_secure": "دخول آمن صارم",
      "mobile_otp": "رقم الهاتف (OTP)",
      "wallet": "محفظة تراي نيترا",
      "payout": "تحويل بنكي",
      "ai_super": "الذكاء الاصطناعي الفائق (دماغ بشري)",
      "home": "الرئيسية",
      "chat": "رسول",
      "menu": "القائمة"
    }
  },

  // 🇪🇸 SPANISH (Global Reach)
  es: {
    translation: {
      "app_name": "TriNetra",
      "login_secure": "Entrada Segura Estricta",
      "wallet": "Billetera TriNetra",
      "payout": "Transferencia Bancaria",
      "ai_super": "IA Super Agente (Cerebro Humano)",
      "home": "Inicio",
      "chat": "Mensajero",
      "menu": "Menú"
    }
  }
};

// ─── 2. ENGINE INITIALIZATION (Auto-detect & Persist) ─────────────
i18n
  .use(LanguageDetector) // असली डिटेक्शन (Browser/System Lang)
  .use(initReactI18next)
  .init({
    resources,
    // Point 12E: Use local cache or default to Hindi/English
    lng: localStorage.getItem('trinetra_lang') || "hi", 
    fallbackLng: "en",
    debug: false, // Production में false रहेगा (Point 12H)
    
    interpolation: {
      escapeValue: false // React के लिए false (Security handled by React)
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// 🌍 Point 13: Handle RTL Automatically on Load
const currentLang = i18n.language || "hi";
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

export default i18n;
