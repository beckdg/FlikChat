import { Request, Response, NextFunction } from 'express';
import { questionService } from './question.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const result = await questionService.getAll(page, limit);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getTrendingQuestions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await questionService.getTrending();
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await questionService.getById(req.params.id as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await questionService.create(userId, req.body);
    sendSuccess(res, result, 'Question created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await questionService.update(req.params.id as string, userId, req.body);
    sendSuccess(res, result, 'Question updated');
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    await questionService.delete(req.params.id as string, userId);
    sendSuccess(res, undefined, 'Question deleted');
  } catch (error) {
    next(error);
  }
};
