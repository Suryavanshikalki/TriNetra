// File: src/services/socket.js
import { io } from 'socket.io-client';

// अपने बैकएंड का URL (बाद में इसे Render/AWS के लिंक से बदलेंगे)
const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
    autoConnect: false // जब यूज़र लॉगिन करेगा, तब कनेक्ट करेंगे
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
