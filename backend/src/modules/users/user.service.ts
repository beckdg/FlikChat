import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import type { UpdateUserDto } from './user.validator';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
    });

    if (!user) throw new AppError(404, 'User not found');

    const { _count, ...rest } = user;
    return {
      ...rest,
      questionCount: _count.questions,
      answerCount: _count.answers,
    };
  }

  async getProfileByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
    });

    if (!user) throw new AppError(404, 'User not found');

    const { _count, ...rest } = user;
    return {
      ...rest,
      questionCount: _count.questions,
      answerCount: _count.answers,
    };
  }

  async updateProfile(userId: string, data: UpdateUserDto) {
    if (data.username) {
      const existing = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existing && existing.id !== userId) {
        throw new AppError(409, 'Username already taken');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.username !== undefined && { username: data.username }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
    });

    const { _count, ...rest } = user;
    return {
      ...rest,
      questionCount: _count.questions,
      answerCount: _count.answers,
    };
  }
}

export const userService = new UserService();
