// ==========================================
// TRINETRA SUPER APP - USER MASTER CONTEXT (File 26)
// Exact Path: src/context/UserContext.jsx
// Blueprint Point: 2, 3, 6 & 11 - 100% ASLI AWS
// ==========================================
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import LogRocket from 'logrocket';
import * as Sentry from "@sentry/react";

const client = generateClient();
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // AWS Auth Data
  const [profile, setProfile] = useState(null); // DynamoDB Profile Data (Point 3)
  const [loading, setLoading] = useState(true);

  // ─── 1. FETCH FULL PROFILE (Point 3: Profile & Connections) ─────
  // 🔥 FIX: Isko upar rakha gaya hai taaki hoisting error na aaye
  const fetchFullProfile = async (trinetraId) => {
    try {
      const res = await client.graphql({
        query: `query GetProfile($id: ID!) {
          getTriNetraProfile(id: $id) {
            id name bio profilePic coverPic avatarUrl
            followerCount followingCount
            walletBalance aiCredits
            isOSCreator
          }
        }`,
        variables: { id: trinetraId }
      });
      
      if (res.data && res.data.getTriNetraProfile) {
        setProfile(res.data.getTriNetraProfile);
      }
    } catch (err) {
      try {
        Sentry.captureException(err);
      } catch (sentryErr) {
        // Safe catch if Sentry is blocked by user's browser
      }
      console.error("❌ AWS Profile Sync Failed", err);
    }
  };

  // ─── 2. REAL AWS SESSION SYNC (Point 2: Gatekeeper) ─────────────
  // 🔥 FIX: Isko bhi useEffect se pehle define kiya gaya hai
  const syncUserSession = async () => {
    try {
      // 🔥 Step 1: AWS Cognito से असली यूजर सेशन उठाना
      const { username, userId } = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      const authenticatedUser = {
        trinetraId: username, // Point 2: Permanent ID
        email: attributes.email,
        phone: attributes.phone_number,
        sub: userId
      };

      setUser(authenticatedUser);

      // 🔥 Step 2: AWS DynamoDB से यूजर का 'Asli' प्रोफाइल लाना (Point 3 & 6)
      await fetchFullProfile(username);

      // 🔥 Step 3: Real-time Identity Tracking (Point 12H)
      try {
        if (typeof LogRocket !== 'undefined') {
          LogRocket.identify(username, {
            name: attributes.name || 'TriNetra User',
            email: attributes.email,
          });
        }
      } catch (trackerErr) {
        console.warn("🛡️ TriNetra: Tracker loaded safely.");
      }

    } catch (err) {
      console.log("🛰️ TriNetra Gatekeeper: No active AWS session. User needs to login.");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // ─── 3. TRIGGER ENGINE ON LOAD ─────────────
  useEffect(() => {
    syncUserSession();
  }, []);

  // ─── 4. REFRESH PROFILE (Point 6 & 11: Balance/Credits) ─────────
  const refreshUserData = () => {
    if (user?.trinetraId) fetchFullProfile(user.trinetraId);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      setUser, 
      setProfile, 
      refreshUserData,
      isAuthenticated: !!user 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
