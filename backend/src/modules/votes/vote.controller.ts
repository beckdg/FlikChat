import { Request, Response } from 'express';
import { sendError } from '../../utils/response';

export const vote = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const removeVote = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const getVoteSummary = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};
