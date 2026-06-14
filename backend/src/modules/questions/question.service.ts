import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import type { CreateQuestionDto, UpdateQuestionDto } from './question.validator';

export class QuestionService {
  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.question.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { answers: true } },
        },
      }),
      prisma.question.count(),
    ]);

    return {
      items: items.map(({ _count, ...q }) => ({
        ...q,
        answerCount: _count.answers,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTrending(limit = 5) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const items = await prisma.question.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { answers: true } },
      },
    });

    const sorted = items
      .map(({ _count, ...q }) => ({
        ...q,
        answerCount: _count.answers,
      }))
      .sort((a, b) => b.answerCount - a.answerCount);

    return sorted;
  }

  async getById(id: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { answers: true } },
      },
    });

    if (!question) throw new AppError(404, 'Question not found');

    const { _count, ...rest } = question;
    return { ...rest, answerCount: _count.answers };
  }

  async create(authorId: string, data: CreateQuestionDto) {
    const question = await prisma.question.create({
      data: { ...data, authorId },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    return question;
  }

  async update(id: string, authorId: string, data: UpdateQuestionDto) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'Question not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    const question = await prisma.question.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    return question;
  }

  async delete(id: string, authorId: string) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'Question not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    await prisma.question.delete({ where: { id } });
  }
}

export const questionService = new QuestionService();
