import axios from 'axios';
import { type LoginRequest, type LoginResponse, type RegisterRequest, type RefreshTokenResponse, type CurrentUser } from '../types/Auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 인증이 필요 없는 API용 axios 인스턴스
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인증이 필요한 API용 axios 인스턴스 (토큰 자동 추가)
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: accessToken 자동 추가
authApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const authService = {
  // 공개 API (인증 불필요)
  login: (data: LoginRequest) => publicApi.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => publicApi.post('/auth/register', data),
  
  // 토큰 재발급 (리프레시 토큰만 사용, Authorization 헤더 불필요)
  refresh: async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }
    try {
      const response = await publicApi.post<RefreshTokenResponse>('/auth/refresh', {
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
  
  // 로그아웃 (인증 필요)
  logout: async () => {
    const userId = authService.getStoredUser()?.userId;
    const accessToken = localStorage.getItem('accessToken');
    
    if (userId && accessToken) {
      try {
        await authApi.post(`/auth/logout?userId=${userId}`);
      } catch (error) {
        console.error('Logout API failed:', error);
      }
    }
    authService.clearTokens();
  },
  
  // 현재 로그인한 사용자 정보 조회 (인증 필요)
  getCurrentUser: async (): Promise<CurrentUser | null> => {
    try {
      const response = await authApi.get<CurrentUser>('/users/me');
      return response.data;
    } catch {
      return null;
    }
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
  
  // localStorage에 저장된 기본 사용자 정보 (로그인 응답에서 저장된 정보)
  getStoredUser: () => {
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
