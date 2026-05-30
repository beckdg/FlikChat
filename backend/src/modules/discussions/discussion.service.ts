// Discussion/chat room business logic will be implemented here

export class DiscussionService {
  async getRoomByAnswerId(_answerId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async getMessages(_roomId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async sendMessage(_authorId: string, _data: unknown): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const discussionService = new DiscussionService();
