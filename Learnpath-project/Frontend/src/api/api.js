import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';


const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.dispatchEvent(new Event('auth-change'));
      if (!window.location.pathname.startsWith('/login') && 
          !window.location.pathname.startsWith('/signup') && 
          !window.location.pathname.startsWith('/verify-email') &&
          !window.location.pathname.startsWith('/oauth2')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Save user profile (year, branch, goal)
export const saveUserProfile = (data) => api.post('/api/user/profile', data);

// Fetch current user with profile fields
export const fetchCurrentUser = () => api.get('/api/user/me');

// Fetch personalized recommendation from Spring Boot proxy
export const fetchRecommendation = () => api.get('/api/recommend');

