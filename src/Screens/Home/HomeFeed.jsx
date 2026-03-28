// File: src/screens/Home/HomeFeed.jsx
import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import StoryViewer from './StoryViewer';
import { translateText } from '../../services/api'; // Point 13: Translation Power
import { Zap, ShieldCheck, Languages } from 'lucide-react';

export default function HomeFeed() {
  const [posts, setPosts] = useState([
    {
      id: "p1",
      userName: "Suryavanshi Kalki",
      timeAgo: "2 hours ago",
      category: "Infrastructure",
      content: "This road construction has been pending for 3 years. Needs immediate attention!",
      isDevelopmentIssue: true,
      escalationStatus: "MLA Level 🚨", // Point 4: Chain of Command tracking
      engagementCount: 450 // System tracks high engagement for auto-escalation
    },
    {
      id: "p2",
      userName: "Nishant",
      timeAgo: "5 hours ago",
      category: "General",
      content: "Just uploaded my new 3D avatar. Testing the universal download feature!",
      isDevelopmentIssue: false,
      escalationStatus: null,
      engagementCount: 12
    }
  ]);

  const [currentLang, setCurrentLang] = useState('hi'); // Default app language

  // 🌍 Point 13: Universal Translation Handler
  const handleTranslatePost = async (postId, originalContent) => {
    alert(`TriNetra AI: Translating post to ${currentLang === 'hi' ? 'English' : 'Hindi'}...`);
    const result = await translateText(originalContent, currentLang === 'hi' ? 'en' : 'hi');
    
    if (result.success) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, content: result.translatedText } : p
      ));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1014] overflow-y-auto pb-24 scrollbar-hide">
      
      {/* 👁️🔥 Point 4: Auto-Escalation Ticker */}
      <div className="bg-red-900/20 border-b border-red-500/30 p-2 flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
        <Zap size={14} className="text-red-500 animate-pulse" />
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
          Auto-Escalation Active: Tracking 14 Public Issues in your area...
        </p>
      </div>

      {/* 24-hr Stories Section (Point 4) */}
      <StoryViewer />
      
      <div className="p-4 space-y-4 max-w-2xl mx-auto w-full">
        
        {/* Post Creation Box (Point 4: 7 Inputs - Text, Photo, Video, etc.) */}
        <CreatePost />

        {/* 🌍 Language Switcher Shortcut (UI Helper) */}
        <div className="flex justify-end">
            <button 
                onClick={() => setCurrentLang(currentLang === 'hi' ? 'en' : 'hi')}
                className="text-[10px] bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-cyan-400 flex items-center gap-1 font-bold"
            >
                <Languages size={12}/> AI Translation: {currentLang === 'hi' ? 'HINDI' : 'ENGLISH'}
            </button>
        </div>
        
        {/* Mapped Feed (Posts with AI & Escalation Power) */}
        {posts.map((post) => (
          <PostCard 
            key={post.id}
            userName={post.userName} 
            timeAgo={post.timeAgo} 
            category={post.category}
            content={post.content} 
            isDevelopmentIssue={post.isDevelopmentIssue} 
            escalationStatus={post.escalationStatus}
            onTranslate={() => handleTranslatePost(post.id, post.content)} // AI Translation Trigger
          />
        ))}
      </div>

      {/* 🛡️ TriNetra Trust Badge */}
      <div className="flex flex-col items-center py-6 opacity-30">
        <ShieldCheck className="text-gray-500" size={30} />
        <p className="text-[10px] text-gray-500 font-bold mt-1">SECURED BY TRINETRA ENCRYPTION</p>
      </div>
    </div>
  );
}
