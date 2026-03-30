// File: src/context/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [appLang, setAppLang] = useState('en'); // 'en' for English, 'hi' for Hindi

  const switchLanguage = (langCode) => {
    setAppLang(langCode);
    localStorage.setItem('trinetra_lang', langCode);
  };

  // Function to get the correct text word based on current language
  const t = (key) => {
    return translations[appLang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ appLang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
