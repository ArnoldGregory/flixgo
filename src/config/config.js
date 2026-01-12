// src/config/config.js
const isDev = import.meta.env.DEV;

const config = {
  // API Configuration
  API_BASE_URL: isDev 
    ? 'https://localhost:7145' 
    : import.meta.env.VITE_API_URL || 'https://api.flixgo.com',
  
  // App Configuration
  APP_NAME: 'FlixGo',
  APP_VERSION: '1.0.0',
  
  // Media URLs
  MEDIA_BASE_URL: isDev
    ? 'https://localhost:7145'
    : import.meta.env.VITE_MEDIA_URL || 'https://cdn.flixgo.com',
  
  // Local Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'token',
    EMAIL: 'email',
    CURRENT_PROFILE_ID: 'current_profile_id',
    CURRENT_PLAN_ID: 'currentPlanId',
  },
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/User/ClientLogin',
    REGISTER: '/api/User/ClientRegister',
    OTP_LOGIN: '/api/User/OTPClientLogin',
    RESEND_OTP: '/api/Home/ResendOtp',
    
    // User
    GET_PROFILE: '/api/User/GetMyProfile',
    GET_USER_PROFILES: '/api/User/GetUserProfiles',
    CREATE_PROFILE: '/api/User/CreateUserProfile',
    UPDATE_PROFILE: '/api/User/UpdateUserProfile',
    DELETE_PROFILE: '/api/User/DeleteUserProfile',
    
    // Content
    GET_MOVIES: '/api/Content/GetMovies',
    GET_SERIES: '/api/Content/GetSeries',
    GET_EPISODES: '/api/Content/GetEpisodes',
    GET_GENRES: '/api/Content/GetGenres',
    UPLOAD_FILE: '/api/Content/UploadFile',
    
    // Subscription
    GET_PLANS: '/api/Subscription/GetSubscriptionPlans',
    
    // Payment
    INITIATE_MPESA: '/api/Payment/InitiateMpesaSTK',
    CHECK_MPESA_STATUS: '/api/Payment/CheckMpesaStatus',
  },
  
  // Default Images
  DEFAULT_IMAGES: {
    USER_AVATAR: '/assets/img/user.svg',
    MOVIE_POSTER: '/assets/img/covers/cover.jpg',
    BACKGROUND: '/assets/img/home/home__bg.jpg',
  },
  
  // Payment Config
  PAYMENT: {
    POLLING_INTERVAL: 5000, // 5 seconds
    MAX_POLLING_ATTEMPTS: 36, // 3 minutes total
  },
  
  // OTP Config
  OTP: {
    LENGTH: 4,
    RESEND_TIMER: 60, // seconds
  },
};

export default config;