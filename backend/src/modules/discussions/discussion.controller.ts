import { Request, Response } from 'express';
import { sendError } from '../../utils/response';

export const getRoomByAnswerId = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const getMessages = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};

export const sendMessage = (_req: Request, res: Response): Response => {
  return sendError(res, 'Not implemented', 501);
};
