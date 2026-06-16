import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { sendSuccess } from '../../utils/response';
import type { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { uploadToCloudinary } from '../../services/upload';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await userService.getProfile(userId);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getProfileByUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username as string;
    const result = await userService.getProfileByUsername(username);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    await userService.deleteAccount(userId);
    sendSuccess(res, undefined, 'Account deleted');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const result = await userService.updateProfile(userId, req.body);
    sendSuccess(res, result, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const url = await uploadToCloudinary(req.file.buffer, 'avatars');
    const result = await userService.updateProfile(userId, { avatarUrl: url });
    sendSuccess(res, result, 'Avatar updated');
  } catch (error) {
    next(error);
  }
};

export const uploadCover = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const url = await uploadToCloudinary(req.file.buffer, 'covers');
    const result = await userService.updateProfile(userId, { coverUrl: url });
    sendSuccess(res, result, 'Cover updated');
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username as string;
    const result = await userService.getUserStats(username);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getUserQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username as string;
    const result = await userService.getUserQuestions(username);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getUserAnswers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username as string;
    const result = await userService.getUserAnswers(username);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getUserDiscussions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username as string;
    const result = await userService.getUserDiscussions(username);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
