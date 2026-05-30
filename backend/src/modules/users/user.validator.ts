import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
