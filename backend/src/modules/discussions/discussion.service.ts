import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { notificationService } from '../notifications/notification.service';
import type { SendMessageDto } from './discussion.validator';

export class DiscussionService {
  async getRoomByAnswerId(answerId: string) {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { id: true },
    });
    if (!answer) throw new AppError(404, 'Answer not found');

    let room = await prisma.chatRoom.findUnique({
      where: { answerId },
    });

    if (!room) {
      room = await prisma.chatRoom.create({ data: { answerId } });
    }

    return room;
  }

  async getRoomById(roomId: string) {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        answer: {
          select: {
            id: true,
            content: true,
            authorId: true,
            createdAt: true,
            author: { select: { id: true, username: true, avatarUrl: true } },
            question: { select: { id: true, title: true, content: true, authorId: true } },
          },
        },
        _count: { select: { messages: true } },
      },
    });
    if (!room) throw new AppError(404, 'Chat room not found');
    return room;
  }

  async getMessages(roomId: string, page = 1, limit = 50) {
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError(404, 'Chat room not found');

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { roomId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
        },
      }),
      prisma.chatMessage.count({ where: { roomId } }),
    ]);

    return {
      items: items.reverse(),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async sendMessage(authorId: string, data: SendMessageDto) {
    const room = await prisma.chatRoom.findUnique({
      where: { id: data.roomId },
    });
    if (!room) throw new AppError(404, 'Chat room not found');

    const message = await prisma.chatMessage.create({
      data: {
        content: data.content,
        roomId: data.roomId,
        authorId,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    const previousAuthors = await prisma.chatMessage.findMany({
      where: { roomId: data.roomId, authorId: { not: authorId } },
      distinct: ['authorId'],
      select: { authorId: true },
    });

    const answer = await prisma.answer.findUnique({
      where: { id: room.answerId },
      select: { questionId: true },
    });

    for (const { authorId: targetId } of previousAuthors) {
      notificationService.create({
        userId: targetId,
        type: 'message_reply',
        title: 'New Reply',
        message: `${message.author.username} replied in a discussion you're part of`,
        link: answer ? `/questions/${answer.questionId}` : undefined,
        senderId: authorId,
      });
    }

    return message;
  }

  async updateMessage(messageId: string, authorId: string, content: string) {
    const existing = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!existing) throw new AppError(404, 'Message not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    const message = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { content },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    return message;
  }

  async deleteMessage(messageId: string, authorId: string) {
    const existing = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!existing) throw new AppError(404, 'Message not found');
    if (existing.authorId !== authorId) throw new AppError(403, 'Not authorized');

    await prisma.chatMessage.delete({ where: { id: messageId } });
  }

  async getMyActiveDiscussions(userId: string) {
    const roomIds = await prisma.chatMessage.findMany({
      where: { authorId: userId },
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
          select: { createdAt: true, content: true },
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

    const userLastMessageTimes = await prisma.chatMessage.groupBy({
      by: ['roomId'],
      where: { authorId: userId, roomId: { in: roomIds.map((r) => r.roomId) } },
      _max: { createdAt: true },
    });

    const lastMessageMap = new Map(userLastMessageTimes.map((r) => [r.roomId, r._max.createdAt]));

    const newMessageCounts = await Promise.all(
      rooms.map(async (room) => {
        const lastUserMsgAt = lastMessageMap.get(room.id);
        if (!lastUserMsgAt) return { roomId: room.id, count: 0 };
        const count = await prisma.chatMessage.count({
          where: {
            roomId: room.id,
            authorId: { not: userId },
            createdAt: { gt: lastUserMsgAt },
          },
        });
        return { roomId: room.id, count };
      })
    );

    const countMap = new Map(newMessageCounts.map((r) => [r.roomId, r.count]));

    return rooms.map((room) => ({
      roomId: room.id,
      answerId: room.answer.id,
      answerSnippet: room.answer.content.slice(0, 150),
      questionId: room.answer.question.id,
      questionTitle: room.answer.question.title,
      totalMessages: room._count.messages,
      newMessages: countMap.get(room.id) ?? 0,
      lastActivity: room.messages[0]?.createdAt ?? null,
    }));
  }
}

export const discussionService = new DiscussionService();
