import { Request, Response } from 'express';
import { sendError } from '../../utils/response';

export const getQuestions = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const getQuestionById = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const createQuestion = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const updateQuestion = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const deleteQuestion = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};
