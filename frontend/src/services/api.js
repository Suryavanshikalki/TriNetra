// ==========================================
// TRINETRA SUPER APP - MASTER API CONFIG (File 34)
// Point 2, 4, 6, 11 - REAL BACKEND CONNECTION
// ==========================================
import axios from 'axios';

// 100% REAL: Render ki live URL yahan lock hai
const API_BASE_URL = 'https://trinetra-umys.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for Auth (Point 2: Gateway Security)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trn_token'); // Strict Security
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Real Service Functions (A to Z Functional)
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getProfile: (id) => api.get(`/user/profile/${id}`),
};

export const postAPI = {
  getFeed: () => api.get('/posts/feed'),
  createPost: (formData) => api.post('/posts/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // For Point 4 Media
  }),
};

export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data), // Mode A, B, C
  getCredits: (id) => api.get(`/ai/credits?userId=${id}`),
};
