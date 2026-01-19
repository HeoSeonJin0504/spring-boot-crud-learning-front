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

// 응답 인터셉터: HTTP 상태 코드별 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    
    // 400 Bad Request - Validation 실패 또는 중복 리소스
    if (status === 400) {
      const responseData = error.response?.data;
      
      // Validation 에러가 있는 경우
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        error.validationErrors = responseData.errors.reduce((acc: any, err: any) => {
          acc[err.field] = err.message;
          return acc;
        }, {});
        error.friendlyMessage = '입력 정보를 확인해주세요.';
      } else {
        // 일반 400 에러 (중복 등)
        error.friendlyMessage = responseData?.message || '잘못된 요청입니다.';
      }
    }
    
    // 401 Unauthorized - 인증 실패
    if (status === 401 && !originalRequest._retry) {
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
      } catch (refreshError) {
        // 재발급 실패
        isRefreshing = false;
        authService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
      
      isRefreshing = false;
      
      // 재발급 실패 시 로그인 페이지로 이동
      authService.clearTokens();
      window.location.href = '/login';
      error.friendlyMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
    }
    
    // 403 Forbidden - 권한 없음 (본인이 아님)
    if (status === 403) {
      error.friendlyMessage = '권한이 없습니다. 본인의 정보만 수정/삭제할 수 있습니다.';
    }
    
    // 404 Not Found - 리소스 없음
    if (status === 404) {
      error.friendlyMessage = '요청한 리소스를 찾을 수 없습니다.';
    }
    
    // 500 Internal Server Error - 서버 오류
    if (status === 500) {
      error.friendlyMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
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
  logout: (userId: string) => api.post(`/auth/logout?userId=${userId}`),
};
