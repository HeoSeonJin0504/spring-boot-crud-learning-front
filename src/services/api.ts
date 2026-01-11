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

// 토큰 재발급 중인지 확인하는 플래그
let isRefreshing = false;
// 토큰 재발급 중 대기하는 요청들
let refreshSubscribers: ((token: string) => void)[] = [];

// 대기 중인 요청들에게 새 토큰 전달
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 토큰 재발급 대기 큐에 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 응답 인터셉터: 401 에러 시 토큰 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 재발급 중인 경우, 대기 큐에 추가
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // 토큰 재발급 시도
        const newAccessToken = await authService.refresh();
        
        if (newAccessToken) {
          // 대기 중인 요청들에게 새 토큰 전달
          onRefreshed(newAccessToken);
          isRefreshing = false;
          
          // 새 토큰으로 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch {
        // 재발급 실패
      }
      
      isRefreshing = false;
      
      // 재발급 실패 시 로그인 페이지로 이동
      authService.clearTokens();
      window.location.href = '/login';
    }
    
    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error('권한이 없습니다.');
    }
    
    // 404 Not Found
    if (error.response?.status === 404) {
      console.error('리소스를 찾을 수 없습니다.');
    }
    
    return Promise.reject(error);
  }
);

export const userService = {
  getAllUsers: () => api.get<UserResponseDto[]>('/users'),
  getUserById: (userIndex: number) => api.get<UserResponseDto>(`/users/${userIndex}`),
  getMyInfo: () => api.get<UserResponseDto>('/users/me'),
  createUser: (user: UserRequestDto) => api.post<UserResponseDto>('/users', user),
  updateUser: (userIndex: number, user: Partial<UserRequestDto>) => 
    api.put<UserResponseDto>(`/users/${userIndex}`, user),
  deleteUser: (userIndex: number) => api.delete(`/users/${userIndex}`),
};
