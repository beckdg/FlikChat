// Question business logic will be implemented here

export class QuestionService {
  async getAll(): Promise<void> {
    throw new Error('Not implemented');
  }

  async getById(_id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async create(_authorId: string, _data: unknown): Promise<void> {
    throw new Error('Not implemented');
  }

  async update(_id: string, _authorId: string, _data: unknown): Promise<void> {
    throw new Error('Not implemented');
  }

  async delete(_id: string, _authorId: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const questionService = new QuestionService();
