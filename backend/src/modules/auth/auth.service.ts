import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import type { RegisterDto, LoginDto } from './auth.validator';

export class AuthService {
  async register(data: RegisterDto) {
    const { email, username, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      if (existingUser.email === email) {
        throw new AppError(409, 'Email already registered');
      }
      throw new AppError(409, 'Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
      select: { id: true, email: true, username: true, bio: true, avatarUrl: true, coverUrl: true, createdAt: true },
    });

    const accessToken = this.generateToken(user);

    return { user, tokens: { accessToken } };
  }

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const accessToken = this.generateToken(user);

    return {
      user: { id: user.id, email: user.email, username: user.username, bio: user.bio, avatarUrl: user.avatarUrl, coverUrl: user.coverUrl, createdAt: user.createdAt },
      tokens: { accessToken },
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, bio: true, avatarUrl: true, coverUrl: true, createdAt: true },
    });
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return { user };
  }

  private generateToken(user: { id: string; email: string }): string {
    return jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
  }
}

export const authService = new AuthService();
