// File: src/screens/Home/HomeFeed.jsx
import React from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import StoryViewer from './StoryViewer';

export default function HomeFeed() {
  return (
    <div className="flex flex-col h-full bg-[#0a1014] overflow-y-auto pb-24">
      {/* 24-hr Stories Section */}
      <StoryViewer />
      
      <div className="p-4">
        {/* Post Creation Box */}
        <CreatePost />
        
        {/* Mapped Feed (Posts) */}
        <PostCard 
          userName="Suryavanshi Kalki" 
          timeAgo="2 hours ago" 
          category="Development"
          content="This road construction has been pending for 3 years. Needs immediate attention!" 
          isDevelopmentIssue={true} 
        />
        <PostCard 
          userName="Nishant" 
          timeAgo="5 hours ago" 
          category="General"
          content="Just uploaded my new 3D avatar. Testing the universal download feature!" 
          isDevelopmentIssue={false} 
        />
      </div>
    </div>
  );
}
