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

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'User not found');

    await prisma.user.delete({ where: { id: userId } });
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

  async getUserStats(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new AppError(404, 'User not found');

    const [totalQuestions, totalAnswers, upvoteCount, discussionRooms] = await Promise.all([
      prisma.question.count({ where: { authorId: user.id } }),
      prisma.answer.count({ where: { authorId: user.id } }),
      prisma.vote.count({
        where: { answer: { authorId: user.id }, value: { gt: 0 } },
      }),
      prisma.chatMessage.findMany({
        where: { authorId: user.id },
        distinct: ['roomId'],
        select: { roomId: true },
      }),
    ]);

    return {
      totalQuestions,
      totalAnswers,
      totalUpvotes: upvoteCount,
      totalDiscussions: discussionRooms.length,
    };
  }

  async getUserQuestions(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new AppError(404, 'User not found');

    const questions = await prisma.question.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { answers: true } },
        tags: { include: { tag: true } },
      },
    });

    return questions.map((q) => ({
      id: q.id,
      title: q.title,
      createdAt: q.createdAt,
      answerCount: q._count.answers,
      tags: q.tags.map((t) => ({ id: t.tag.id, name: t.tag.name })),
    }));
  }

  async getUserAnswers(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new AppError(404, 'User not found');

    const answers = await prisma.answer.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        question: { select: { id: true, title: true } },
        _count: { select: { votes: true } },
      },
    });

    return answers.map((a) => ({
      id: a.id,
      content: a.content,
      questionId: a.question.id,
      questionTitle: a.question.title,
      createdAt: a.createdAt,
      voteCount: a._count.votes,
    }));
  }

  async getUserDiscussions(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new AppError(404, 'User not found');

    const roomIds = await prisma.chatMessage.findMany({
      where: { authorId: user.id },
      distinct: ['roomId'],
      select: { roomId: true },
    });

    if (roomIds.length === 0) return [];

    const rooms = await prisma.chatRoom.findMany({
      where: { id: { in: roomIds.map((r) => r.roomId) } },
      include: {
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true },
        },
        answer: {
          select: {
            id: true,
            content: true,
            question: { select: { id: true, title: true } },
          },
        },
      },
    });

    return rooms.map((room) => ({
      roomId: room.id,
      questionId: room.answer.question.id,
      questionTitle: room.answer.question.title,
      answerSnippet: room.answer.content.slice(0, 150),
      lastMessage: room.messages[0]?.content ?? null,
      lastActivity: room.messages[0]?.createdAt ?? null,
      totalMessages: room._count.messages,
    }));
  }
}

export const userService = new UserService();
