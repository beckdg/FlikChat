import { Request, Response } from 'express';
import { sendError } from '../../utils/response';

export const getAnswersByQuestion = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const getAnswerById = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const createAnswer = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const updateAnswer = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const deleteAnswer = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};
