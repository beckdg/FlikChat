import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
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
}

export const discussionService = new DiscussionService();
