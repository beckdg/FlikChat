import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const healthCheck = (_req: Request, res: Response): Response => {
  return sendSuccess(res, undefined, 'FlikChat API is running');
};
