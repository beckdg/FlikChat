import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import { sendEmail, generateOtp, createOtpEmailHtml } from '../../services/email';
import type { RegisterDto, LoginDto, VerifyEmailDto, ResendOtpDto } from './auth.validator';

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

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
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    const otpExpires = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);
    const otpSentAt = new Date();

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        emailVerified: false,
        otp: hashedOtp,
        otpExpires,
        otpSentAt,
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        createdAt: true,
      },
    });

    try {
      await sendEmail({
        to: { email: user.email, name: user.username },
        subject: 'Welcome to FlikChat — Verify Your Email',
        htmlContent: createOtpEmailHtml(otp, user.username),
      });
    } catch {
      await prisma.user.delete({ where: { id: user.id } });
      throw new AppError(500, 'Failed to send verification email. Please try again.');
    }

    return {
      user: { id: user.id, email: user.email, username: user.username },
      requiresEmailVerification: true,
    };
  }

  async verifyEmail(data: VerifyEmailDto) {
    const { email, otp } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.emailVerified) {
      throw new AppError(400, 'Email already verified');
    }

    if (!user.otp || !user.otpExpires) {
      throw new AppError(400, 'No verification code found. Request a new one.');
    }

    if (new Date() > user.otpExpires) {
      throw new AppError(400, 'Verification code has expired. Request a new one.');
    }

    const isValid = crypto.timingSafeEqual(
      Buffer.from(user.otp),
      Buffer.from(hashOtp(otp)),
    );

    if (!isValid) {
      throw new AppError(400, 'Invalid verification code');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otp: null,
        otpExpires: null,
        otpSentAt: null,
      },
    });

    const accessToken = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        createdAt: user.createdAt,
      },
      tokens: { accessToken },
    };
  }

  async resendOtp(data: ResendOtpDto) {
    const { email } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (user.emailVerified) {
      throw new AppError(400, 'Email already verified');
    }

    if (user.otpSentAt) {
      const cooldown = 60 * 1000;
      const elapsed = Date.now() - user.otpSentAt.getTime();
      if (elapsed < cooldown) {
        const remaining = Math.ceil((cooldown - elapsed) / 1000);
        throw new AppError(429, `Please wait ${remaining} seconds before requesting a new code`);
      }
    }

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    const otpExpires = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);
    const otpSentAt = new Date();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: hashedOtp,
        otpExpires,
        otpSentAt,
      },
    });

    await sendEmail({
      to: { email: user.email, name: user.username },
      subject: 'FlikChat — New Verification Code',
      htmlContent: createOtpEmailHtml(otp, user.username),
    });

    return { message: 'Verification code sent' };
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

    if (!user.emailVerified) {
      const otp = generateOtp();
      const hashedOtp = hashOtp(otp);
      const otpExpires = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);
      const otpSentAt = new Date();

      await prisma.user.update({
        where: { id: user.id },
        data: { otp: hashedOtp, otpExpires, otpSentAt },
      });

      await sendEmail({
        to: { email: user.email, name: user.username },
        subject: 'FlikChat — Verify Your Email',
        htmlContent: createOtpEmailHtml(otp, user.username),
      });

      return { requiresEmailVerification: true, email: user.email };
    }

    const accessToken = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        createdAt: user.createdAt,
      },
      tokens: { accessToken },
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return { user };
  }

  async checkEmailVerificationStatus(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return { emailVerified: user.emailVerified };
  }

  private generateToken(user: { id: string; email: string }): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: '7d' },
    );
  }
}

export const authService = new AuthService();
