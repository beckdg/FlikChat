import { api } from './api';
import type { ApiResponse, Notification } from '@/types';

export interface NotificationsResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getNotifications = (page = 1, limit = 50) =>
  api.get<ApiResponse<NotificationsResponse>>('/notifications', { params: { page, limit } }).then((r) => r.data);

export const markAsRead = (id: string) =>
  api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`).then((r) => r.data);

export const markAllAsRead = () =>
  api.patch<ApiResponse<void>>('/notifications/read-all').then((r) => r.data);
