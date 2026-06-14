import { Request, Response, NextFunction } from 'express';
import { discussionService } from './discussion.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { getIO } from '../../sockets';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';

export const getRoomByAnswerId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await discussionService.getRoomByAnswerId(req.params.answerId as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const result = await discussionService.getMessages(req.params.roomId as string, page, limit);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const message = await discussionService.sendMessage(userId, req.body);

    const io = getIO();
    io.to(req.body.roomId).emit('new_message', message);

    sendSuccess(res, message, 'Message sent', 201);
  } catch (error) {
    next(error);
  }
};

export const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const { content } = req.body;
    const message = await discussionService.updateMessage(req.params.messageId as string, userId, content);

    const io = getIO();
    io.to(message.roomId).emit('message_updated', message);

    sendSuccess(res, message, 'Message updated');
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const messageId = req.params.messageId as string;

    const msg = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: { roomId: true, authorId: true },
    });
    if (!msg) throw new AppError(404, 'Message not found');
    if (msg.authorId !== userId) throw new AppError(403, 'Not authorized');

    await discussionService.deleteMessage(messageId, userId);

    const io = getIO();
    io.to(msg.roomId).emit('message_deleted', { id: messageId });

    sendSuccess(res, undefined, 'Message deleted');
  } catch (error) {
    next(error);
  }
};

export const getMyActiveDiscussions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await discussionService.getMyActiveDiscussions(userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
