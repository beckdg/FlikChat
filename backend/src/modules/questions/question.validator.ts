import { z } from 'zod';

export const createQuestionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export const updateQuestionSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(10).optional(),
});

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>;
