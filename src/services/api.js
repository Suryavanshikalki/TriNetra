// File: src/services/api.js
import axios from 'axios';

// यहाँ हम अपने बैकएंड सर्वर का URL डालेंगे
const API_URL = 'http://localhost:3000/api'; 

export const loginUser = async (authId, provider) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { authId, provider });
        return response.data;
    } catch (error) {
        console.error("Login API Error:", error);
        return { success: false, error: "Network Error" };
    }
};

export const escalateComplaint = async (postId, category) => {
    try {
        const response = await axios.post(`${API_URL}/complaint/escalate`, { postId, category });
        return response.data;
    } catch (error) {
        console.error("Escalation API Error:", error);
        return { success: false, error: "Network Error" };
    }
};

export const purchaseSubscription = async (type, months, userId) => {
    try {
        const response = await axios.post(`${API_URL}/payment/recharge`, { type, months, userId });
        return response.data;
    } catch (error) {
        console.error("Payment API Error:", error);
        return { success: false, error: "Payment Failed" };
    }
};
