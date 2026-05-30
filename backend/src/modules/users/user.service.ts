// User business logic will be implemented here

export class UserService {
  async getProfile(_userId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async updateProfile(_userId: string, _data: unknown): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const userService = new UserService();
