// Auth business logic will be implemented here

export class AuthService {
  async register(_data: unknown): Promise<void> {
    throw new Error('Not implemented');
  }

  async login(_data: unknown): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const authService = new AuthService();
