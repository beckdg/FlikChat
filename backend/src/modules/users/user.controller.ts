import { Request, Response } from 'express';
import { sendError } from '../../utils/response';

export const getProfile = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const updateProfile = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const getUserById = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};
