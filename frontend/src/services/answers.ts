import { api } from './api';
import type { ApiResponse, Answer } from '@/types';

export const getAnswersByQuestion = (questionId: string, userId?: string) =>
  api.get<ApiResponse<Answer[]>>(`/answers/question/${questionId}`, { params: { ...(userId ? { userId } : {}) } }).then((r) => r.data);

export const getAnswerById = (id: string) =>
  api.get<ApiResponse<Answer>>(`/answers/${id}`).then((r) => r.data);

export const createAnswer = (data: { content: string; questionId: string }) =>
  api.post<ApiResponse<Answer>>('/answers', data).then((r) => r.data);

export const updateAnswer = (id: string, data: { content?: string }) =>
  api.patch<ApiResponse<Answer>>(`/answers/${id}`, data).then((r) => r.data);

export const deleteAnswer = (id: string) =>
  api.delete<ApiResponse<void>>(`/answers/${id}`).then((r) => r.data);

export const voteAnswer = (answerId: string, value: number) =>
  api.post<ApiResponse<{ voted: boolean; value?: number }>>('/votes', { answerId, value }).then((r) => r.data);
