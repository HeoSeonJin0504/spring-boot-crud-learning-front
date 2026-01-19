import axios from 'axios';
import { type LoginRequest, type LoginResponse, type RegisterRequest, type RefreshTokenResponse } from '../types/Auth';
import { userService } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 인증이 필요 없는 API용 axios 인스턴스
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // 공개 API (인증 불필요)
  login: (data: LoginRequest) => publicApi.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => publicApi.post('/auth/register', data),
  
  // 토큰 재발급 (리프레시 토큰만 사용)
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
  
  // 로그아웃
  logout: async () => {
    const userId = authService.getCurrentUserId();
    if (userId) {
      try {
        await userService.logout(userId);
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
    localStorage.removeItem('userId');
    localStorage.removeItem('userIndex');
  },
  
  saveTokens: (response: LoginResponse) => {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('user', JSON.stringify({
      userId: response.userId,
      name: response.name,
    }));
  },
  
  // 현재 로그인한 userId 조회
  getCurrentUserId: (): string | null => {
    return localStorage.getItem('userId');
  },
  
  // 현재 로그인한 userIndex 저장 (마이페이지에서 /me 호출 후 저장)
  saveUserIndex: (userIndex: number) => {
    localStorage.setItem('userIndex', String(userIndex));
  },
  
  getCurrentUserIndex: (): number | null => {
    const userIndex = localStorage.getItem('userIndex');
    return userIndex ? Number(userIndex) : null;
  },
  
  // 본인 여부 확인 (userId 기준)
  isOwnAccount: (targetUserId: string): boolean => {
    const currentUserId = authService.getCurrentUserId();
    return currentUserId === targetUserId;
  },
  
  // 본인 여부 확인 (userIndex 기준)
  isOwnAccountByIndex: (targetUserIndex: number): boolean => {
    const currentUserIndex = authService.getCurrentUserIndex();
    return currentUserIndex === targetUserIndex;
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
