import { z } from 'zod';

export const createAnswerSchema = z.object({
  content: z.string().min(10, 'Answer must be at least 10 characters'),
  questionId: z.string().uuid('Invalid question ID'),
});

export const updateAnswerSchema = z.object({
  content: z.string().min(10).optional(),
});

export type CreateAnswerDto = z.infer<typeof createAnswerSchema>;
export type UpdateAnswerDto = z.infer<typeof updateAnswerSchema>;
