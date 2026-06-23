import { api } from './api';
import type { ApiResponse, User } from '@/types';

export interface AuthResponse {
  user: User;
  tokens: { accessToken: string };
}

export interface LoginVerificationResponse {
  requiresEmailVerification: true;
  email: string;
}

export interface RegisterResponse {
  user: Pick<User, 'id' | 'email' | 'username'>;
  requiresEmailVerification: boolean;
}

export const loginUser = (data: { email: string; password: string }) =>
  api.post<ApiResponse<AuthResponse | LoginVerificationResponse>>('/auth/login', data).then((r) => r.data);

export const registerUser = (data: {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}) => api.post<ApiResponse<RegisterResponse>>('/auth/register', data).then((r) => r.data);

export const verifyEmail = (data: { email: string; otp: string }) =>
  api.post<ApiResponse<AuthResponse>>('/auth/verify-email', data).then((r) => r.data);

export const resendOtp = (data: { email: string }) =>
  api.post<ApiResponse<{ message: string }>>('/auth/resend-otp', data).then((r) => r.data);

export const checkVerificationStatus = (email: string) =>
  api.get<ApiResponse<{ emailVerified: boolean }>>('/auth/verification-status', {
    params: { email },
  }).then((r) => r.data);

export const fetchMe = () =>
  api.get<ApiResponse<{ user: User }>>('/auth/me').then((r) => r.data);
