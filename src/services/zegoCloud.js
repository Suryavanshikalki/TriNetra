// File: src/services/zegoCloud.js
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Aapne text me jo keys di thi, wo yaha secure tarike se add hain
const APP_ID = 1218908374;
const SERVER_SECRET = "7308cd0113c93801130957698f292c8d";

export const generateZegoToken = (roomId, userId, userName) => {
    return ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID, 
        SERVER_SECRET, 
        roomId, 
        userId, 
        userName
    );
};

export const startZegoCall = (element, token, isVideoCall) => {
    const zp = ZegoUIKitPrebuilt.create(token);
    zp.joinRoom({
        container: element,
        turnOnCameraWhenJoining: isVideoCall,
        showPreJoinView: false,
    });
    return zp;
};
