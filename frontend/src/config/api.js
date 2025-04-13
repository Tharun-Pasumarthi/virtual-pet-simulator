import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Response Error:', {
      url: error.config.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  register: '/api/auth/register',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  
  // Pets
  myPets: '/api/pets/my-pets',
  createPet: '/api/pets/create',
  petAction: (petId, action) => `/api/pets/${petId}/${action}`,
  
  // Shop
  shopItems: '/api/shop/items',
  purchase: '/api/shop/purchase',
  
  // Daily Tasks
  dailyTasks: '/api/daily-tasks/today',
  updateTaskProgress: (taskId) => `/api/daily-tasks/${taskId}/progress`,
  claimStreakBonus: '/api/daily-tasks/claim-streak',
  
  // Mini-games
  games: '/api/minigames',
  gameProgress: '/api/minigames/progress',
  startGame: '/api/minigames/start',
  finishGame: '/api/minigames/finish'
};

export default api;
