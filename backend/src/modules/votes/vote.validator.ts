import { z } from 'zod';

export const createVoteSchema = z.object({
  value: z.number().int().min(-1).max(1),
  answerId: z.string().uuid('Invalid answer ID'),
});

export type CreateVoteDto = z.infer<typeof createVoteSchema>;
