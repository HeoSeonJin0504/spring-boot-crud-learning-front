import axios from 'axios';
import { LoginRequest, LoginResponse, RegisterRequest, RefreshTokenResponse } from '../types/Auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  
  refresh: async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }
    try {
      const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch {
      authService.clearTokens();
      return null;
    }
  },
  
  logout: async () => {
    const userId = authService.getCurrentUser()?.userId;
    if (userId) {
      try {
        await api.post(`/auth/logout?userId=${userId}`);
      } catch (error) {
        console.error('Logout API failed:', error);
      }
    }
    authService.clearTokens();
  },
  
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  saveTokens: (response: LoginResponse) => {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      userId: response.userId,
      name: response.name,
    }));
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
  
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
  
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },
};
