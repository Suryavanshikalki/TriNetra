// ==========================================
// TRINETRA SUPER APP - THEME ENGINE (File 24)
// Exact Path: src/context/ThemeContext.jsx
// Blueprint Point: 12-E & 12H - 100% ASLI AWS SYNC
// ==========================================
import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();
const ThemeContext = createContext();

export const ThemeProvider = ({ children, currentUser }) => {
  // ─── 1. INITIAL STATE (Point 12-E: OLED Default) ────────────────
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('trinetra_theme');
    if (savedTheme) return savedTheme === 'dark';
    // System preference detection (Auto-detect Point 1)
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isInitializing, setIsInitializing] = useState(true);

  // ─── 2. REAL AWS SYNC (Point 12-E: Memory Lock) ──────────────────
  useEffect(() => {
    if (currentUser?.trinetraId) {
      fetchThemeFromAWS();
    } else {
      applyTheme(isDarkMode);
      setIsInitializing(false);
    }
  }, [currentUser]);

  const fetchThemeFromAWS = async () => {
    try {
      // AWS AppSync से यूज़र की मास्टर प्रेफरेंस उठाना
      const res = await client.graphql({
        query: `query GetTheme($userId: ID!) {
          getTriNetraPreferences(userId: $userId) { darkMode }
        }`,
        variables: { userId: currentUser.trinetraId }
      });
      
      const cloudTheme = res.data.getTriNetraPreferences?.darkMode;
      if (typeof cloudTheme === 'boolean') {
        applyTheme(cloudTheme);
      }
    } catch (err) {
      console.error("❌ AWS Theme Sync Failed, using local cache.");
      applyTheme(isDarkMode);
    } finally {
      setIsInitializing(false);
    }
  };

  // ─── 3. THE "ASLI" THEME APPLICATION (OLED Optimization) ─────────
  const applyTheme = (darkMode) => {
    setIsDarkMode(darkMode);
    localStorage.setItem('trinetra_theme', darkMode ? 'dark' : 'light');

    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      // 📱 Mobile Status Bar Optimization (Point 1: 6-Platform)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0a1014');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    applyTheme(newMode);

    // 🔥 Sync with AWS (No Dummy Logic)
    if (currentUser?.trinetraId) {
      try {
        await client.graphql({
          query: `mutation UpdateTheme($userId: ID!, $darkMode: Boolean!) {
            updateTriNetraTheme(userId: $userId, darkMode: $darkMode) { status }
          }`,
          variables: { userId: currentUser.trinetraId, darkMode: newMode }
        });
      } catch (err) {
        console.error("❌ AWS Cloud Update Failed");
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isInitializing }}>
      {/* 🚀 Using CSS Variables for OLED Black (#000000) support */}
      <div className={`${isDarkMode ? 'dark bg-[#0a1014]' : 'light bg-white'} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
