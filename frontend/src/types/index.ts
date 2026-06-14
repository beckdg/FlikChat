export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string; avatarUrl: string | null };
  answerCount?: number;
}

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string; avatarUrl: string | null };
  voteCount: number;
  roomId: string | null;
}

export interface ChatRoom {
  id: string;
  answerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  authorId: string;
  createdAt: string;
  author: { id: string; username: string; avatarUrl: string | null };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
