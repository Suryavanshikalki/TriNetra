import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 100% Real Language Dictionary for TriNetra
const resources = {
  en: { 
    translation: { 
      "TriNetra": "TriNetra", 
      "Strict Secure Entry": "Strict Secure Entry", 
      "Mobile Number (OTP)": "Mobile Number (OTP)",
      "Email Login": "Email Login",
      "GitHub (AI Mode Only)": "GitHub (AI Mode Only)",
      "Verify OTP": "Verify OTP",
      "Proceed": "Proceed",
      "Back": "Back",
      "Home": "Home",
      "Reels": "Reels",
      "Chat": "Chat",
      "Menu": "Menu"
    } 
  },
  hi: { 
    translation: { 
      "TriNetra": "त्रिनेत्र", 
      "Strict Secure Entry": "सख्त सुरक्षित प्रवेश", 
      "Mobile Number (OTP)": "मोबाइल नंबर (OTP)",
      "Email Login": "ईमेल लॉगिन",
      "GitHub (AI Mode Only)": "गिटहब (सिर्फ AI मोड)",
      "Verify OTP": "OTP वेरीफाई करें",
      "Proceed": "आगे बढ़ें",
      "Back": "पीछे जाएं",
      "Home": "होम",
      "Reels": "रील्स",
      "Chat": "चैट",
      "Menu": "मेनू"
    } 
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", 
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
