// ==========================================
// TRINETRA SUPER APP - MAIN NAV BAR (File 33)
// Exact File Path: src/components/NavBar.jsx
// Blueprint Point: 12A - Home, Reels, Friends, Dashboard, Notify, Profile
// ==========================================
import React from 'react';
import { Home, PlaySquare, Users, LayoutDashboard, Bell, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NavBar({ activeTab, onTabChange, unreadNotifications = 0 }) {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={22} />, color: 'text-cyan-400' },
    { id: 'reels', label: 'Reels', icon: <PlaySquare size={22} />, color: 'text-red-500' },
    { id: 'friends', label: 'Friends', icon: <Users size={22} />, color: 'text-blue-400' },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} />, color: 'text-green-400' },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={22} />, color: 'text-yellow-400' },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={22} />, color: 'text-white' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#111827]/95 backdrop-blur-xl border-t border-gray-800 flex justify-around items-center py-2 pb-6 z-[90] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center gap-1 transition-all active:scale-75 relative ${
            activeTab === item.id ? item.color : 'text-gray-500'
          }`}
        >
          {/* Notification Badge for Point 12A */}
          {item.id === 'notifications' && unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-[#0a1014]">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
          
          <div className={`${activeTab === item.id ? 'scale-110' : 'scale-100'} transition-transform`}>
            {item.icon}
          </div>
          
          <span className="text-[8px] font-black uppercase tracking-tighter">
            {t(item.label)}
          </span>
          
          {/* Active Indicator Line */}
          {activeTab === item.id && (
            <div className={`absolute -bottom-2 w-1 h-1 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
          )}
        </button>
      ))}
    </nav>
  );
}
