// src/services/apiService.js
import axios from 'axios';
import config from '../config/config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to get full media URL
export const getMediaUrl = (path) => {
  if (!path) return config.DEFAULT_IMAGES.MOVIE_POSTER;
  if (path.startsWith('http')) return path;
  return `${config.MEDIA_BASE_URL}${path}`;
};

// ==================== AUTH SERVICES ====================
export const authService = {
  login: (username, password) => 
    api.post(config.ENDPOINTS.LOGIN, { username, password }),
  
  //registration now with a payload
  register: (payload) => api.post(config.ENDPOINTS.REGISTER, payload),
  
  verifyOtp: (username, password) => 
    api.post(config.ENDPOINTS.OTP_LOGIN, { username, password }),
  
  resendOtp: (token) => 
    api.post(config.ENDPOINTS.RESEND_OTP, { token }),
  
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },
};

// ==================== USER SERVICES ====================
export const userService = {
  getProfile: () => 
    api.get(config.ENDPOINTS.GET_PROFILE),
  
  getUserProfiles: () => 
    api.get(config.ENDPOINTS.GET_USER_PROFILES),
  
  createProfile: (profileData) => 
    api.post(config.ENDPOINTS.CREATE_PROFILE, profileData),
  
  updateProfile: (profileData) => 
    api.post(config.ENDPOINTS.UPDATE_PROFILE, profileData),
  
  deleteProfile: (id, deletedBy) => 
    api.delete(`${config.ENDPOINTS.DELETE_PROFILE}?id=${id}&deleted_by=${deletedBy}`),
};

// ==================== CONTENT SERVICES ====================
export const contentService = {
  getMovies: () => 
    api.get(config.ENDPOINTS.GET_MOVIES),
  
  getSeries: () => 
    api.get(config.ENDPOINTS.GET_SERIES),
  
  getEpisodes: () => 
    api.get(config.ENDPOINTS.GET_EPISODES),
  
  getGenres: () => 
    api.get(config.ENDPOINTS.GET_GENRES),
  
  uploadFile: (formData) => 
    api.post(config.ENDPOINTS.UPLOAD_FILE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ==================== SUBSCRIPTION SERVICES ====================
export const subscriptionService = {
  getPlans: () => 
    api.get(config.ENDPOINTS.GET_PLANS),
};

// ==================== PAYMENT SERVICES ====================
export const paymentService = {
  initiateMpesa: (phone, amount, planId) => 
    api.post(config.ENDPOINTS.INITIATE_MPESA, { phone, amount, planId }),
  
  checkMpesaStatus: (checkoutRequestID) => 
    api.post(config.ENDPOINTS.CHECK_MPESA_STATUS, { checkoutRequestID }),
};

export default api;