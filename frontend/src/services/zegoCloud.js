// ==========================================
// TRINETRA SUPER APP - VOICE & VIDEO ENGINE (File 36)
// Blueprint Point: 5 (WhatsApp 2.0 Calling) & 12H (Security)
// Status: 100% ASLI (ForTest Method Deleted 🗑️)
// ==========================================
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { generateClient } from 'aws-amplify/api';
import * as Sentry from "@sentry/react";

const client = generateClient();

/**
 * 🔥 ASLI PRODUCTION LOGIC
 * We NO LONGER generate tokens on frontend.
 * We fetch a secure token from AWS Lambda to keep ServerSecret hidden.
 */

// ─── 1. FETCH SECURE TOKEN FROM AWS (Point 2 & 12H) ───────────────
export const getSecureZegoToken = async (roomID, trinetraId) => {
  try {
    // 🔥 AWS AppSync Query: Requesting a signed token from Backend
    const res = await client.graphql({
      query: `query GetZegoToken($roomID: String!, $userID: ID!) {
        getTriNetraZegoToken(roomID: $roomID, userID: $userID) {
          token
          appID
        }
      }`,
      variables: { roomID, userID: trinetraId }
    });
    
    return res.data.getTriNetraZegoToken;
  } catch (err) {
    Sentry.captureException(err);
    console.error("❌ TriNetra Calling: Secure Token Fetch Failed.");
    return null;
  }
};

// ─── 2. START ASLI CALL (Point 5: WhatsApp 2.0 Style) ─────────────
export const startTriNetraCall = async (container, roomID, user, isVideo) => {
  const secureData = await getSecureZegoToken(roomID, user.trinetraId);
  
  if (!secureData) {
    alert("Satellite Link Failed. Check AWS WAF Status.");
    return;
  }

  // Use the ASLI token from Backend
  const zp = ZegoUIKitPrebuilt.create(secureData.token);
  
  zp.joinRoom({
    container: container,
    branding: {
        logoURL: 'https://cdn.trinetra.com/assets/logo_fixed.svg', // Point 1: Universal Logo
    },
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall, // WhatsApp 2.0 Engine
    },
    showPreJoinView: false,
    showLeavingView: false,
    turnOnMicrophoneWhenJoining: true,
    turnOnCameraWhenJoining: isVideo,
    
    // 🛡️ Point 12H: Real-time UI Control
    showScreenSharingButton: true,
    showUserList: false, // Privacy Lock
    maxUsers: 2, // 1-on-1 Strict Entry
    
    onLeaveRoom: () => {
        console.log("📡 Call Disconnected. AWS Logged.");
    }
  });

  return zp;
};

export default { startTriNetraCall };
