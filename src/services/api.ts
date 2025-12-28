import axios from 'axios';
import { UserRequestDto, UserResponseDto } from '../types/User';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getAllUsers: () => api.get<UserResponseDto[]>('/users'),
  getUserById: (id: number) => api.get<UserResponseDto>(`/users/${id}`),
  createUser: (user: UserRequestDto) => api.post<UserResponseDto>('/users', user),
  updateUser: (id: number, user: Partial<UserRequestDto>) => 
    api.put<UserResponseDto>(`/users/${id}`, user),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};
