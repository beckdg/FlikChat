import { Request, Response, NextFunction } from 'express';
import { notificationService } from './notification.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const result = await notificationService.getByUser(userId, page, limit);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await notificationService.markAsRead(req.params.id as string, userId);
    if (!result) return sendSuccess(res, undefined, 'Notification not found');
    sendSuccess(res, result, 'Marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    await notificationService.markAllAsRead(userId);
    sendSuccess(res, undefined, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
