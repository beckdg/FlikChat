import { z } from 'zod';

const questionTypes = ['general', 'discussion', 'help', 'idea', 'poll'] as const;

export const createQuestionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  type: z.enum(questionTypes).default('general'),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
});

export const updateQuestionSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(10).optional(),
  type: z.enum(questionTypes).optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
});

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>;
