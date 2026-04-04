// ==========================================
// TRINETRA SUPER APP - MAIN NAV BAR (File 33)
// Exact File Path: src/components/NavBar.jsx
// Blueprint Point: 12A - Home, Reels, Friends, Dashboard, Notify, Profile
// ==========================================
import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, Users, LayoutDashboard, Bell, UserCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 🔥 ASLI AWS IMPORTS (For Real-time Notification Badge)
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function NavBar({ activeTab, onTabChange, currentUser }) {
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── 1. REAL-TIME NOTIFICATION ENGINE (Point 12A & 12H) ──────────
  useEffect(() => {
    if (!currentUser?.trinetraId) return;

    // 🔥 AWS AppSync Subscription: Instant Red Dot when someone interacts
    const sub = client.graphql({
      query: `subscription OnNewNotification($userId: ID!) {
        onTriNetraNotification(userId: $userId) {
          id unreadTotal
        }
      }`,
      variables: { userId: currentUser.trinetraId }
    }).subscribe({
      next: ({ data }) => {
        setUnreadCount(data.onTriNetraNotification.unreadTotal);
        // Point 1: Haptic Feedback Trigger (Asli App Feel)
        if (window.navigator.vibrate) window.navigator.vibrate(10);
      },
      error: (err) => console.error("❌ Notification Link Failed", err)
    });

    return () => sub.unsubscribe();
  }, [currentUser]);

  // ─── 2. POINT 12A: MASTER NAVIGATION ITEMS ────────────────────────
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]' },
    { id: 'reels', label: 'Reels', icon: PlaySquare, color: 'text-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]' },
    { id: 'friends', label: 'Friends', icon: Users, color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.4)]' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.4)]' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-yellow-400', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.4)]' },
    { id: 'profile', label: 'Profile', icon: UserCircle, color: 'text-white', glow: 'shadow-[0_0_15px_rgba(255,255,255,0.2)]' },
  ];

  const handleTabClick = (id) => {
    // 🔥 Point 1: Real Action Trigger (Haptic)
    if (window.navigator.vibrate) window.navigator.vibrate(5);
    onTabChange(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#111827]/95 backdrop-blur-3xl border-t border-gray-800/50 flex justify-around items-center pt-3 pb-8 z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all relative group ${
              isActive ? item.color : 'text-gray-600'
            }`}
          >
            {/* 🔴 Point 12A: Real-time Notification Badge */}
            {item.id === 'notifications' && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#111827] animate-bounce-slow z-10">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            
            {/* 🧿 Icon Viewport with Dynamic Scaling */}
            <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? `${item.glow} bg-white/5 scale-110` : 'group-hover:text-gray-400'}`}>
              <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            
            {/* Label - Point 12A (FB Style) */}
            <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {t(item.label)}
            </span>
            
            {/* 💎 Point 12A: Premium Active Indicator */}
            {isActive && (
              <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}></div>
            )}
          </button>
        );
      })}

      {/* 🚀 Hidden Point: OS Creation Mode Trigger Indicator (Point 11) */}
      {currentUser?.isOSCreator && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full px-4 py-1 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-t-xl border-t border-x border-white/10">
           <div className="flex items-center gap-2">
              <Zap size={10} className="text-white animate-pulse fill-white" />
              <span className="text-[7px] font-black text-white uppercase tracking-widest">TriNetra OS Engine v6.2 Active</span>
           </div>
        </div>
      )}

    </nav>
  );
}
