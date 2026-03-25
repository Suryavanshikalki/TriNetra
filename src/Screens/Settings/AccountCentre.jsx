// File: src/screens/Settings/AccountsCentre.jsx
import React from 'react';

export default function AccountsCentre() {
  return (
    <div className="h-full bg-[#0a1014] text-white p-4">
      <h2 className="text-xl font-bold mb-6">Accounts Centre</h2>
      <div className="bg-gray-900 rounded-xl p-4 space-y-4">
         <div className="border-b border-gray-800 pb-3 cursor-pointer">Personal Details</div>
         <div className="border-b border-gray-800 pb-3 cursor-pointer">Password & Security</div>
         <div className="border-b border-gray-800 pb-3 cursor-pointer">Ad Preferences</div>
         <div className="cursor-pointer text-red-500">Deactivate / Delete Account</div>
      </div>
    </div>
  );
}
