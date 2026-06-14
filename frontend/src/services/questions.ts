import { api } from './api';
import type { ApiResponse, Question, PaginatedResponse, QuestionType } from '@/types';

export const getQuestions = (page = 1, limit = 20) =>
  api.get<ApiResponse<PaginatedResponse<Question>>>('/questions', { params: { page, limit } }).then((r) => r.data);

export const getTrendingQuestions = () =>
  api.get<ApiResponse<Question[]>>('/questions/trending').then((r) => r.data);

export const getQuestionById = (id: string) =>
  api.get<ApiResponse<Question>>(`/questions/${id}`).then((r) => r.data);

export interface CreateQuestionInput {
  title: string;
  content: string;
  type?: QuestionType;
  tags?: string[];
}

export const createQuestion = (data: CreateQuestionInput) =>
  api.post<ApiResponse<Question>>('/questions', data).then((r) => r.data);

export const updateQuestion = (id: string, data: { title?: string; content?: string; type?: QuestionType; tags?: string[] }) =>
  api.patch<ApiResponse<Question>>(`/questions/${id}`, data).then((r) => r.data);

export const deleteQuestion = (id: string) =>
  api.delete<ApiResponse<void>>(`/questions/${id}`).then((r) => r.data);
