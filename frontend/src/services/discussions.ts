import { api } from './api';
import type { ApiResponse, ChatRoom, ChatMessage, PaginatedResponse, ActiveDiscussion } from '@/types';

export const getMyActiveDiscussions = () =>
  api.get<ApiResponse<ActiveDiscussion[]>>('/discussions/my-active').then((r) => r.data);

export const getRoomByAnswerId = (answerId: string) =>
  api.get<ApiResponse<ChatRoom>>(`/discussions/answer/${answerId}`).then((r) => r.data);

export const getMessages = (roomId: string, page = 1, limit = 50) =>
  api.get<ApiResponse<PaginatedResponse<ChatMessage>>>(`/discussions/${roomId}/messages`, {
    params: { page, limit },
  }).then((r) => r.data);

export const sendMessage = (data: { content: string; roomId: string }) =>
  api.post<ApiResponse<ChatMessage>>('/discussions/messages', data).then((r) => r.data);

export const updateMessage = (messageId: string, data: { content: string }) =>
  api.patch<ApiResponse<ChatMessage>>(`/discussions/messages/${messageId}`, data).then((r) => r.data);

export const deleteMessage = (messageId: string) =>
  api.delete<ApiResponse<void>>(`/discussions/messages/${messageId}`).then((r) => r.data);
