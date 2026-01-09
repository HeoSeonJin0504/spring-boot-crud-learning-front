import axios from 'axios';
import { type UserRequestDto, type UserResponseDto } from '../types/User';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 시 로그인 페이지로 리다이렉트
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
