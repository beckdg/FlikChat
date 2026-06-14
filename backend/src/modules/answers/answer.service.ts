import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import type { CreateAnswerDto, UpdateAnswerDto } from './answer.validator';

export class AnswerService {
  async getByQuestionId(questionId: string, userId?: string) {
    const include: any = {
      author: { select: { id: true, username: true, avatarUrl: true } },
      chatRoom: { select: { id: true } },
      _count: { select: { votes: true } },
    };

    if (userId) {
      include.votes = { where: { userId }, select: { value: true } };
    }

    const answers = await prisma.answer.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      include,
    });

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true },
    });
    if (!question) throw new AppError(404, 'Question not found');

    return answers.map((a: any) => {
      const { _count, chatRoom, votes, ...rest } = a;
      return {
        ...rest,
        voteCount: _count.votes,
        roomId: chatRoom?.id ?? null,
        userVote: userId ? (votes?.[0]?.value ?? 0) : 0,
      };
    });
  }

  async getById(id: string) {
    const answer = await prisma.answer.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        chatRoom: { select: { id: true } },
        _count: { select: { votes: true } },
      },
    });

    if (!answer) throw new AppError(404, 'Answer not found');

    const { _count, chatRoom, ...rest } = answer;
    return { ...rest, voteCount: _count.votes, roomId: chatRoom?.id ?? null, userVote: 0 };
  }

  async create(authorId: string, data: CreateAnswerDto) {
    const question = await prisma.question.findUnique({
      where: { id: data.questionId },
    });
    if (!question) throw new AppError(404, 'Question not found');

    const answer = await prisma.answer.create({
      data: {
        content: data.content,
        questionId: data.questionId,
        authorId,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    const chatRoom = await prisma.chatRoom.create({
      data: { answerId: answer.id },
    });

    return { ...answer, roomId: chatRoom.id, voteCount: 0, userVote: 0 };
  }

  async update(id: string, authorId: string, data: UpdateAnswerDto) {
    const existing = await prisma.answer.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'Answer not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    const answer = await prisma.answer.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        chatRoom: { select: { id: true } },
        _count: { select: { votes: true } },
      },
    });

    const { _count, chatRoom, ...rest } = answer;
    return { ...rest, voteCount: _count.votes, roomId: chatRoom?.id ?? null };
  }

  async delete(id: string, authorId: string) {
    const existing = await prisma.answer.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'Answer not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    await prisma.answer.delete({ where: { id } });
  }
}

export const answerService = new AnswerService();
