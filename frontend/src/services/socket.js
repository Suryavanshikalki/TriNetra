// ==========================================
// TRINETRA SUPER APP - REAL-TIME MESSENGER (File 35)
// Blueprint Point: 5 (WhatsApp 2.0 Engine) & 12H (Security)
// Status: 100% ASLI (Socket.io & Render Deleted 🗑️)
// ==========================================
import { generateClient } from 'aws-amplify/api';
import * as Sentry from "@sentry/react";

const client = generateClient();

/**
 * 🔥 ASLI REAL-TIME ENGINE (AWS AppSync Subscriptions)
 * No Socket.io, No Render Dummy. 
 * This uses pure AWS WebSockets for 100% stability.
 */

// ─── 1. JOIN CHAT & LISTEN (Point 5: Mutual Connection Only) ──────
export const subscribeToMessages = (userId, friendId, onNewMessage) => {
  // Point 5: Creating a secure Mutual Room ID
  const roomId = [userId, friendId].sort().join('_');

  console.log(`📡 TriNetra Messenger: Connecting to Secure Room ${roomId}...`);

  // 🔥 AWS GraphQL Subscription: Direct WebSocket Link
  const subscription = client.graphql({
    query: `subscription OnNewMessage($roomId: String!) {
      onTriNetraMessage(roomId: $roomId) {
        id
        senderId
        content
        type
        mediaUrl
        timestamp
      }
    }`,
    variables: { roomId }
  }).subscribe({
    next: ({ data }) => {
      const msg = data.onTriNetraMessage;
      // Point 5: Real-time UI update
      onNewMessage(msg);
    },
    error: (err) => {
      Sentry.captureException(err);
      console.error("❌ TriNetra Messenger Link Broken:", err);
    }
  });

  return subscription; // To unsubscribe when chat closes
};

// ─── 2. SEND MESSAGE (Point 5: WhatsApp 2.0 Style) ────────────────
export const sendMessage = async (messageData) => {
  const { senderId, receiverId, content, type, mediaUrl } = messageData;
  
  // Point 5: Rule - Room ID must be consistent
  const roomId = [senderId, receiverId].sort().join('_');

  try {
    // 🔥 AWS AppSync Mutation: Sending message to DynamoDB & Triggering Subscription
    const res = await client.graphql({
      query: `mutation CreateMessage($input: MessageInput!) {
        createTriNetraMessage(input: $input) {
          id status timestamp
        }
      }`,
      variables: {
        input: {
          roomId,
          senderId,
          receiverId,
          content,
          type, // text, photo, video, audio, pdf (Point 5)
          mediaUrl,
          status: 'SENT'
        }
      }
    });
    return res.data.createTriNetraMessage;
  } catch (err) {
    Sentry.captureException(err);
    throw new Error("TriNetra Messenger: Failed to send. Check AWS WAF logs.");
  }
};

// ─── 3. GET CHAT HISTORY (Point 5: Persistence) ───────────────────
export const getChatHistory = async (senderId, receiverId) => {
  const roomId = [senderId, receiverId].sort().join('_');
  
  try {
    const res = await client.graphql({
      query: `query ListMessages($roomId: String!) {
        listTriNetraMessages(roomId: $roomId, limit: 100) {
          items {
            id senderId content type mediaUrl timestamp
          }
        }
      }`,
      variables: { roomId }
    });
    return res.data.listTriNetraMessages.items;
  } catch (err) {
    console.error("❌ History Sync Failed");
    return [];
  }
};

export default { subscribeToMessages, sendMessage, getChatHistory };
