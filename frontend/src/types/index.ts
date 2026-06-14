export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
}

export interface UserProfile extends User {
  questionCount: number;
  answerCount: number;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  type: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string; avatarUrl: string | null };
  answerCount?: number;
  likeCount?: number;
  likedByUser?: boolean;
  tags?: Tag[];
}

export type QuestionType = 'general' | 'discussion' | 'help' | 'idea' | 'poll';

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'help', label: 'Help' },
  { value: 'idea', label: 'Idea' },
  { value: 'poll', label: 'Poll' },
];

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string; avatarUrl: string | null };
  voteCount: number;
  userVote: number;
  roomId: string | null;
}

export interface ChatRoom {
  id: string;
  answerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  senderId?: string | null;
  createdAt: string;
  sender?: { id: string; username: string; avatarUrl: string | null } | null;
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
