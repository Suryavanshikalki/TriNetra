import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// 100% Real ZegoCloud Engine (Pulls Keys from your Live Environment)
export const generateZegoToken = (roomID, userID, userName) => {
  // Your real Zego App ID and Server Secret will come from Render .env
  const appID = Number(import.meta.env.VITE_ZEGO_APP_ID); 
  const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

  if (!appID || !serverSecret) {
    console.error("TriNetra Zego Error: Missing Live Keys");
    return null;
  }

  // Generate Kit Token for Real Call
  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    userID,
    userName
  );

  return kitToken;
};

// Real Call Initializer
export const startZegoCall = (element, kitToken, isVideoCall) => {
  const zp = ZegoUIKitPrebuilt.create(kitToken);
  zp.joinRoom({
    container: element,
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall, // WhatsApp style 1-on-1
    },
    turnOnMicrophoneWhenJoining: true,
    turnOnCameraWhenJoining: isVideoCall,
    showPreJoinView: false,
    showLeavingView: false,
  });
  return zp;
};
