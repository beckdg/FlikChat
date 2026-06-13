import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 'Registration successful', 201);
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendSuccess(res, result, 'Login successful');
};

export const logout = async (_req: Request, res: Response) => {
  sendSuccess(res, undefined, 'Logout successful');
};

export const getMe = async (req: Request, res: Response) => {
  const { userId } = (req as AuthenticatedRequest).user!;
  const result = await authService.getMe(userId);
  sendSuccess(res, result);
};
