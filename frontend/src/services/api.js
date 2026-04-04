// ==========================================
// TRINETRA SUPER APP - MASTER API CONFIG (File 34)
// Point 2, 4, 6, 11 - REAL AWS BACKEND ENGINE
// Status: 100% ASLI (Axios & Render Deleted 🗑️)
// ==========================================
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';
import * as Sentry from "@sentry/react";

const client = generateClient();

// ─── 1. AUTH & PROFILE (Point 2 & 3: Gatekeeper) ──────────────────
export const authService = {
  // Real AWS GraphQL Query for Profile
  getProfile: async (trinetraId) => {
    try {
      const res = await client.graphql({
        query: `query GetProfile($id: ID!) {
          getTriNetraProfile(id: $id) {
            id name bio profilePic coverPic followerCount followingCount
          }
        }`,
        variables: { id: trinetraId }
      });
      return res.data.getTriNetraProfile;
    } catch (err) { Sentry.captureException(err); throw err; }
  }
};

// ─── 2. FEED & MEDIA (Point 4: Universal Download) ────────────────
export const feedService = {
  getFeed: async () => {
    const res = await client.graphql({
      query: `query ListPosts {
        listTriNetraPosts(limit: 50) {
          items { id content type mediaUrl user { name profilePic } }
        }
      }`
    });
    return res.data.listTriNetraPosts.items;
  },

  // Asli Media Upload to S3 (No Multipart Dummy)
  uploadMedia: async (file, path) => {
    try {
      const result = await uploadData({
        path: `public/${path}/${Date.now()}_${file.name}`,
        data: file,
      }).result;
      return result;
    } catch (err) { Sentry.captureException(err); throw err; }
  }
};

// ─── 3. THE ECONOMY (Point 6: Wallet & Boost) ─────────────────────
export const economyService = {
  getWallet: async (userId) => {
    const res = await client.graphql({
      query: `query GetWallet($id: ID!) {
        getTriNetraWallet(userId: $id) { balance transactions { amount type status } }
      }`,
      variables: { id: userId }
    });
    return res.data.getTriNetraWallet;
  },

  // Real Withdrawal Logic (No Dummy Razorpay)
  requestPayout: async (payoutData) => {
    return await client.graphql({
      query: `mutation Payout($input: PayoutInput!) {
        createTriNetraPayout(input: $input) { status payoutId }
      }`,
      variables: { input: payoutData }
    });
  }
};

// ─── 4. MASTER AI HUB (Point 11: 6-in-1 Brain) ────────────────────
export const aiService = {
  // Mode A, B, C Logic
  askAI: async (prompt, mode, credits) => {
    try {
      const res = await client.graphql({
        query: `mutation AskAI($prompt: String!, $mode: AIMode!) {
          processTriNetraAI(prompt: $prompt, mode: $mode) {
            answer mediaOutput creditsUsed
          }
        }`,
        variables: { prompt, mode }
      });
      return res.data.processTriNetraAI;
    } catch (err) { 
      Sentry.captureException(err); 
      throw new Error("AI Brain Link Failed. Check Credits."); 
    }
  }
};

// ─── 5. AUTO-ESCALATION (Point 4: Chain of Command) ───────────────
export const escalationService = {
  triggerEscalation: async (postId, category) => {
    return await client.graphql({
      query: `mutation Escalate($postId: ID!, $cat: String!) {
        triggerTriNetraEscalation(postId: $postId, category: $cat) {
          currentLevel status nextAuthority
        }
      }`,
      variables: { postId, cat: category }
    });
  }
};

export default { authService, feedService, economyService, aiService, escalationService };
