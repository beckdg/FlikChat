import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { notificationService } from '../notifications/notification.service';
import type { CreateVoteDto } from './vote.validator';
import type { VoteSummary } from './vote.types';

export class VoteService {
  async vote(userId: string, data: CreateVoteDto) {
    const { answerId, value } = data;

    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) throw new AppError(404, 'Answer not found');

    const existing = await prisma.vote.findUnique({
      where: { answerId_userId: { answerId, userId } },
    });

    if (existing) {
      if (existing.value === value) {
        await prisma.vote.delete({ where: { id: existing.id } });
        return { voted: false };
      }
      await prisma.vote.update({
        where: { id: existing.id },
        data: { value },
      });
      return { voted: true, value };
    }

    await prisma.vote.create({
      data: { answerId, userId, value },
    });

    if (value === 1 && answer.authorId !== userId) {
      const sender = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } });
      notificationService.create({
        userId: answer.authorId,
        type: 'answer_liked',
        title: 'Answer Liked',
        message: `${sender?.username ?? 'Someone'} liked your answer on "${(await prisma.question.findUnique({ where: { id: answer.questionId }, select: { title: true } }))?.title?.slice(0, 80) ?? 'a question'}"`,
        link: `/questions/${answer.questionId}`,
        senderId: userId,
      });
    }

    return { voted: true, value };
  }

  async removeVote(userId: string, answerId: string) {
    const existing = await prisma.vote.findUnique({
      where: { answerId_userId: { answerId, userId } },
    });
    if (!existing) throw new AppError(404, 'Vote not found');

    await prisma.vote.delete({ where: { id: existing.id } });
  }

  async getVoteSummary(answerId: string): Promise<VoteSummary> {
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) throw new AppError(404, 'Answer not found');

    const [upvotes, downvotes] = await Promise.all([
      prisma.vote.count({ where: { answerId, value: 1 } }),
      prisma.vote.count({ where: { answerId, value: -1 } }),
    ]);

    return { answerId, upvotes, downvotes, score: upvotes - downvotes };
  }
}

export const voteService = new VoteService();
