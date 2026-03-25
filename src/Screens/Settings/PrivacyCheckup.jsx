// File: src/screens/Settings/PrivacyCheckup.jsx
import React, { useState } from 'react';

export default function PrivacyCheckup() {
  const [lastSeen, setLastSeen] = useState(false);
  const [profileLock, setProfileLock] = useState(true);

  return (
    <div className="h-full bg-[#0a1014] text-white p-4">
      <h2 className="text-xl font-bold mb-6">Privacy Checkup</h2>
      <div className="bg-gray-900 rounded-xl p-4 space-y-6">
         <div className="flex justify-between items-center">
            <span>Show Last Seen & Online Status</span>
            <input type="checkbox" checked={lastSeen} onChange={()=>setLastSeen(!lastSeen)} className="toggle" />
         </div>
         <div className="flex justify-between items-center">
            <span>Profile Lock (Mutuals Only)</span>
            <input type="checkbox" checked={profileLock} onChange={()=>setProfileLock(!profileLock)} className="toggle" />
         </div>
         <div className="pt-4 border-t border-gray-800 cursor-pointer text-gray-400">Manage Blocked Users</div>
      </div>
    </div>
  );
}
