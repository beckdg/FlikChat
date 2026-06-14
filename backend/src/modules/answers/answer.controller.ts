import { Request, Response, NextFunction } from 'express';
import { answerService } from './answer.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const getAnswersByQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string | undefined;
    const result = await answerService.getByQuestionId(req.params.questionId as string, userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getAnswerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await answerService.getById(req.params.id as string);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const createAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await answerService.create(userId, req.body);
    sendSuccess(res, result, 'Answer created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await answerService.update(req.params.id as string, userId, req.body);
    sendSuccess(res, result, 'Answer updated');
  } catch (error) {
    next(error);
  }
};

export const deleteAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    await answerService.delete(req.params.id as string, userId);
    sendSuccess(res, undefined, 'Answer deleted');
  } catch (error) {
    next(error);
  }
};
