import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  roomId: z.string().uuid('Invalid room ID'),
});

export type SendMessageDto = z.infer<typeof sendMessageSchema>;
