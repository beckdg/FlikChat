import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { notificationService } from '../notifications/notification.service';
import type { CreateQuestionDto, UpdateQuestionDto } from './question.validator';

const questionInclude = {
  author: { select: { id: true, username: true, avatarUrl: true } },
  tags: { include: { tag: true } },
  _count: { select: { answers: true, votes: true } },
};

function formatQuestion(q: any) {
  const { _count, tags, ...rest } = q;
  return {
    ...rest,
    answerCount: _count.answers,
    likeCount: _count.votes,
    tags: tags.map((t: { tag: { id: string; name: string } }) => t.tag),
  };
}

async function upsertTags(tagNames: string[]) {
  return Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      }),
    ),
  );
}

export class QuestionService {
  async getAll(
    page = 1,
    limit = 20,
    filters?: { search?: string; type?: string; sortBy?: string; sortOrder?: string },
    _userId?: string,
  ) {
    const skip = (page - 1) * limit;
    const { search, type, sortBy = 'newest', sortOrder = 'desc' } = filters ?? {};

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'answers') {
      orderBy = { answers: { _count: sortOrder } };
    }

    const [items, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: questionInclude,
      }),
      prisma.question.count({ where }),
    ]);

    return {
      items: items.map(formatQuestion),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTrending(limit = 5, _userId?: string) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const items = await prisma.question.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: questionInclude,
    });

    return items
      .map(formatQuestion)
      .sort((a, b) => b.answerCount - a.answerCount);
  }

  async getById(id: string, userId?: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: questionInclude,
    });

    if (!question) throw new AppError(404, 'Question not found');

    const formatted = formatQuestion(question) as any;

    if (userId) {
      const vote = await prisma.questionVote.findUnique({
        where: { questionId_userId: { questionId: id, userId } },
      });
      formatted.likedByUser = !!vote;
    }

    return formatted;
  }

  async create(authorId: string, data: CreateQuestionDto) {
    const { tags, ...fields } = data;

    const tagRecords = tags?.length ? await upsertTags(tags) : [];

    const question = await prisma.question.create({
      data: {
        ...fields,
        authorId,
        tags: tagRecords.length
          ? { create: tagRecords.map((t) => ({ tagId: t.id })) }
          : undefined,
      },
      include: questionInclude,
    });

    return formatQuestion(question as any);
  }

  async update(id: string, authorId: string, data: UpdateQuestionDto) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'Question not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    const { tags, ...fields } = data;

    if (tags) {
      const tagRecords = tags.length ? await upsertTags(tags) : [];

      await prisma.questionTag.deleteMany({ where: { questionId: id } });

      if (tagRecords.length) {
        await prisma.questionTag.createMany({
          data: tagRecords.map((t) => ({ questionId: id, tagId: t.id })),
        });
      }
    }

    const question = await prisma.question.update({
      where: { id },
      data: fields,
      include: questionInclude,
    });

    return formatQuestion(question as any);
  }

  async delete(id: string, authorId: string) {
    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'Question not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    await prisma.question.delete({ where: { id } });
  }

  async toggleLike(questionId: string, userId: string) {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new AppError(404, 'Question not found');

    const existing = await prisma.questionVote.findUnique({
      where: { questionId_userId: { questionId, userId } },
    });

    if (existing) {
      await prisma.questionVote.delete({ where: { id: existing.id } });
      const count = await prisma.questionVote.count({ where: { questionId } });
      return { liked: false, likeCount: count };
    }

    await prisma.questionVote.create({ data: { questionId, userId } });
    const count = await prisma.questionVote.count({ where: { questionId } });

    if (question.authorId !== userId) {
      const sender = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } });
      notificationService.create({
        userId: question.authorId,
        type: 'question_liked',
        title: 'Question Liked',
        message: `${sender?.username ?? 'Someone'} liked your question "${question.title.slice(0, 80)}"`,
        link: `/questions/${questionId}`,
        senderId: userId,
      });
    }

    return { liked: true, likeCount: count };
  }
}

export const questionService = new QuestionService();
