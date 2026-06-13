import { api } from './api';
import type { ApiResponse, User } from '@/types';

export interface AuthResponse {
  user: User;
  tokens: { accessToken: string };
}

export const loginUser = (data: { email: string; password: string }) =>
  api.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data);

export const registerUser = (data: { email: string; username: string; password: string }) =>
  api.post<ApiResponse<AuthResponse>>('/auth/register', data).then((r) => r.data);

export const fetchMe = () =>
  api.get<ApiResponse<{ user: User }>>('/auth/me').then((r) => r.data);
