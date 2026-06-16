import { Request, Response, NextFunction } from 'express';
import { questionService } from './question.service';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string) || undefined;
    const type = (req.query.type as string) || undefined;
    const sortBy = (req.query.sortBy as string) || 'newest';
    const sortOrder = (req.query.sortOrder as string) || 'desc';
    const userId = req.query.userId as string | undefined;
    const result = await questionService.getAll(page, limit, { search, type, sortBy, sortOrder }, userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getTrendingQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string | undefined;
    const result = await questionService.getTrending(5, userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string | undefined;
    const result = await questionService.getById(req.params.id as string, userId);
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

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tab = (req.query.tab as string) || 'recent';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const userId = req.query.userId as string | undefined;
    const result = await questionService.getFeed(tab, limit, page, userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getPopularTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 10));
    const result = await questionService.getPopularTags(limit);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const likeQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await questionService.toggleLike(req.params.id as string, userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
