import axios from 'axios';
import { type UserRequestDto, type UserResponseDto } from '../types/User';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: accessToken 자동 추가
api.interceptors.request.use((config) => {
  const accessToken = authService.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 시 토큰 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 토큰 재발급 시도
      const newAccessToken = await authService.refresh();
      
      if (newAccessToken) {
        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
      
      // 재발급 실패 시 로그인 페이지로 이동
      authService.clearTokens();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const userService = {
  getAllUsers: () => api.get<UserResponseDto[]>('/users'),
  getUserById: (userIndex: number) => api.get<UserResponseDto>(`/users/${userIndex}`),
  createUser: (user: UserRequestDto) => api.post<UserResponseDto>('/users', user),
  updateUser: (userIndex: number, user: Partial<UserRequestDto>) => 
    api.put<UserResponseDto>(`/users/${userIndex}`, user),
  deleteUser: (userIndex: number) => api.delete(`/users/${userIndex}`),
};
