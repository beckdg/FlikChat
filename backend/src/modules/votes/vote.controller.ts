import { Request, Response, NextFunction } from 'express';
import { voteService } from './vote.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const vote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await voteService.vote(userId, req.body);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const removeVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    await voteService.removeVote(userId, req.params.answerId as string);
    sendSuccess(res, undefined, 'Vote removed');
  } catch (error) {
    next(error);
  }
};

export const getVoteSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await voteService.getVoteSummary(req.params.answerId as string);
    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};
