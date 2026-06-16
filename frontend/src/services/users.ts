import { api } from './api';
import type { ApiResponse, UserProfile, UserStats, UserQuestionItem, UserAnswerItem, UserDiscussionItem } from '@/types';

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

export const deleteAccount = () =>
  api.delete<ApiResponse<void>>('/users/profile').then((r) => r.data);

export const uploadCover = (file: File) => {
  const form = new FormData();
  form.append('image', file);
  return api.post<ApiResponse<UserProfile>>('/users/profile/cover', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export const getUserStats = (username: string) =>
  api.get<ApiResponse<UserStats>>(`/users/${username}/stats`).then((r) => r.data);

export const getUserQuestions = (username: string) =>
  api.get<ApiResponse<UserQuestionItem[]>>(`/users/${username}/questions`).then((r) => r.data);

export const getUserAnswers = (username: string) =>
  api.get<ApiResponse<UserAnswerItem[]>>(`/users/${username}/answers`).then((r) => r.data);

export const getUserDiscussions = (username: string) =>
  api.get<ApiResponse<UserDiscussionItem[]>>(`/users/${username}/discussions`).then((r) => r.data);
