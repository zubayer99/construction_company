import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG, ENV, isProduction } from '../config/env';

const API_URL = API_CONFIG.BASE_URL;

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken') || Cookies.get('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            token: refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('token', accessToken);
          Cookies.set('token', accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {          // Refresh failed, logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          if (!isProduction) {
            console.log('Token refresh failed, redirecting to login');
          }
          window.location.href = '/auth';
        }
      } else {        // No refresh token, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/auth';
      }
    }

    // Log errors in development
    if (!isProduction) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

// API retry wrapper function
export const apiWithRetry = async <T>(
  apiCall: () => Promise<T>,
  attempts: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    if (attempts > 1 && (!error.response || error.response.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return apiWithRetry(apiCall, attempts - 1);
    }
    throw error;
  }
};

export default api;
