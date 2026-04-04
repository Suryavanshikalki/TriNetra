// ==========================================
// TRINETRA SUPER APP - MULTILINGUAL HUB (File 22)
// Exact Path: src/context/LanguageContext.jsx
// Blueprint Point: 13 & 12E - 100% ASLI AWS SYNC
// ==========================================
import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n'; // i18next असली इंजन
import { generateClient } from 'aws-amplify/api';

const client = generateClient();
const LanguageContext = createContext();

export const LanguageProvider = ({ children, currentUser }) => {
  const [appLang, setAppLang] = useState(localStorage.getItem('trinetra_lang') || 'hi');
  const [isRTL, setIsRTL] = useState(false);

  // ─── 1. REAL AWS SYNC (Point 12E: Memory Lock) ──────────────────
  useEffect(() => {
    if (currentUser?.trinetraId) {
      syncLanguageWithAWS();
    }
  }, [currentUser]);

  const syncLanguageWithAWS = async () => {
    try {
      // AWS AppSync से यूज़र की चुनी हुई भाषा उठाना
      const res = await client.graphql({
        query: `query GetLang($userId: ID!) {
          getTriNetraPreferences(userId: $userId) { language }
        }`,
        variables: { userId: currentUser.trinetraId }
      });
      
      const cloudLang = res.data.getTriNetraPreferences?.language;
      if (cloudLang && cloudLang !== appLang) {
        applyLanguage(cloudLang);
      }
    } catch (err) { console.error("❌ AWS Lang Sync Failed"); }
  };

  // ─── 2. ASLI LANGUAGE APPLICATION (RTL & Persistence) ───────────
  const applyLanguage = (langCode) => {
    setAppLang(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem('trinetra_lang', langCode);

    // 🌍 RTL Support (Point 13: For Arabic)
    const isRightToLeft = langCode === 'ar';
    setIsRTL(isRightToLeft);
    document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  };

  const switchLanguage = async (langCode) => {
    applyLanguage(langCode);

    // 🔥 Update AWS Master Profile (No Dummy)
    if (currentUser?.trinetraId) {
      try {
        await client.graphql({
          query: `mutation UpdateLang($userId: ID!, $lang: String!) {
            updateTriNetraLanguage(userId: $userId, language: $lang) { status }
          }`,
          variables: { userId: currentUser.trinetraId, lang: langCode }
        });
      } catch (err) { console.error("❌ AWS Cloud Update Failed"); }
    }
  };

  // ─── 3. AI TRANSLATION HOOK (Point 13: Post/Comment) ────────────
  const translateContent = async (text, targetLang) => {
    try {
      // यह आपके Point 11 (Master AI) के 6-in-1 Brain को कॉल करेगा
      const res = await client.graphql({
        query: `query AITranslate($text: String!, $target: String!) {
          triNetraAITranslate(text: $text, targetLang: $target) { translatedText }
        }`,
        variables: { text, target: targetLang }
      });
      return res.data.triNetraAITranslate.translatedText;
    } catch (err) {
      return text; // Fail-safe: Original text
    }
  };

  return (
    <LanguageContext.Provider value={{ appLang, switchLanguage, translateContent, isRTL, t: (key) => i18n.t(key) }}>
      <div className={isRTL ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
