// File: src/screens/Settings/SettingsMenu.jsx
import React from 'react';
import { User, Shield, Eye, CreditCard, HelpCircle, Globe } from 'lucide-react';

export default function SettingsMenu({ onNavigate }) {
  const menuItems = [
    { title: "Accounts Centre", icon: <User size={20}/>, target: "accounts" },
    { title: "Privacy Checkup", icon: <Shield size={20}/>, target: "privacy" },
    { title: "Audience & Visibility", icon: <Eye size={20}/>, target: "audience" },
    { title: "Payments & Wallet", icon: <CreditCard size={20}/>, target: "wallet" },
    { title: "Boost & AI Subscriptions", icon: <CreditCard size={20}/>, target: "boost" },
    { title: "App Language (A/क)", icon: <Globe size={20} className="text-blue-500"/>, target: "language" }, // नया जोड़ा गया
    { title: "Help & Support", icon: <HelpCircle size={20}/>, target: "support" },
  ];

  return (
    <div className="h-full bg-[#0a1014] text-white p-4 overflow-y-auto pb-24">
      <h2 className="text-2xl font-bold mb-6 mt-4">Settings & Privacy</h2>
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <div key={index} onClick={() => onNavigate(item.target)} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-800 transition">
             <div className="flex items-center space-x-4">
                 <span className="text-gray-400">{item.icon}</span>
                 <span className="font-bold">{item.title}</span>
             </div>
             <span className="text-gray-500">{">"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
