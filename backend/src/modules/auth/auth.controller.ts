import { Request, Response } from 'express';
import { sendError } from '../../utils/response';

export const register = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const login = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const logout = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const getMe = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};
