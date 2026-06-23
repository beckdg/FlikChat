export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  emailVerified?: boolean;
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
  discussionCount?: number;
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

export interface ActiveDiscussion {
  roomId: string;
  answerId: string;
  answerSnippet: string;
  questionId: string;
  questionTitle: string;
  totalMessages: number;
  newMessages: number;
  lastActivity: string | null;
}

export interface TrendingDiscussion {
  roomId: string;
  questionId: string;
  questionTitle: string;
  answerSnippet: string;
  messageCount: number;
  lastActivity: string | null;
}

export interface PopularTag {
  id: string;
  name: string;
  count: number;
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

export interface UserStats {
  totalQuestions: number;
  totalAnswers: number;
  totalUpvotes: number;
  totalDiscussions: number;
}

export interface UserQuestionItem {
  id: string;
  title: string;
  createdAt: string;
  answerCount: number;
  tags?: Tag[];
}

export interface UserAnswerItem {
  id: string;
  content: string;
  questionId: string;
  questionTitle: string;
  createdAt: string;
  voteCount: number;
}

export interface UserDiscussionItem {
  roomId: string;
  questionId: string;
  questionTitle: string;
  answerSnippet: string;
  lastMessage: string | null;
  lastActivity: string | null;
  totalMessages: number;
}
