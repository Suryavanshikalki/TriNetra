// File: src/screens/Settings/CustomerSupport.jsx
import React from 'react';
import { HeadphonesIcon, MessageCircle, FileText } from 'lucide-react';

export default function CustomerSupport() {
  return (
    <div className="p-4 bg-gray-950 h-full text-white">
      <h2 className="text-2xl font-bold mb-6">Help & Support</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded-xl flex items-center space-x-4 cursor-pointer hover:bg-gray-800 transition">
          <MessageCircle className="text-green-500" />
          <div>
            <h4 className="font-bold">Chat with TriNetra Support</h4>
            <p className="text-xs text-gray-400">For Payment, Boost, and App issues</p>
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl flex items-center space-x-4 cursor-pointer hover:bg-gray-800 transition">
          <FileText className="text-blue-500" />
          <div>
            <h4 className="font-bold">My Tickets</h4>
            <p className="text-xs text-gray-400">Check escalation status (MLA/CM/PM)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
