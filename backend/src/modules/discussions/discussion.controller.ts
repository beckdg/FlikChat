import { Request, Response, NextFunction } from 'express';
import { discussionService } from './discussion.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { getIO } from '../../sockets';

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
