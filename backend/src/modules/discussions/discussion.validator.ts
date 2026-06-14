import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  roomId: z.string().uuid('Invalid room ID'),
});

export const updateMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
});

export type SendMessageDto = z.infer<typeof sendMessageSchema>;
export type UpdateMessageDto = z.infer<typeof updateMessageSchema>;
