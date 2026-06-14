import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import type { CreateQuestionDto, UpdateQuestionDto } from './question.validator';

const questionInclude = {
  author: { select: { id: true, username: true, avatarUrl: true } },
  tags: { include: { tag: true } },
  _count: { select: { answers: true } },
};

function formatQuestion(q: { _count: { answers: number }; tags: { tag: { id: string; name: string } }[] } & Record<string, unknown>) {
  const { _count, tags, ...rest } = q as any;
  return {
    ...rest,
    answerCount: _count.answers,
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
  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.question.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: questionInclude,
      }),
      prisma.question.count(),
    ]);

    return {
      items: items.map(formatQuestion),
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
      include: questionInclude,
    });

    return items
      .map(formatQuestion)
      .sort((a, b) => b.answerCount - a.answerCount);
  }

  async getById(id: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: questionInclude,
    });

    if (!question) throw new AppError(404, 'Question not found');

    return formatQuestion(question as any);
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
}

export const questionService = new QuestionService();
