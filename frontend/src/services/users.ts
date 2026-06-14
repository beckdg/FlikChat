import { api } from './api';
import type { ApiResponse, UserProfile } from '@/types';

export const getMyProfile = () =>
  api.get<ApiResponse<UserProfile>>('/users/profile').then((r) => r.data);

export const getProfileByUsername = (username: string) =>
  api.get<ApiResponse<UserProfile>>(`/users/${username}`).then((r) => r.data);

export const updateProfile = (data: { username?: string; bio?: string }) =>
  api.patch<ApiResponse<UserProfile>>('/users/profile', data).then((r) => r.data);

export const uploadAvatar = (file: File) => {
  const form = new FormData();
  form.append('image', file);
  return api.post<ApiResponse<UserProfile>>('/users/profile/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export const uploadCover = (file: File) => {
  const form = new FormData();
  form.append('image', file);
  return api.post<ApiResponse<UserProfile>>('/users/profile/cover', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};
