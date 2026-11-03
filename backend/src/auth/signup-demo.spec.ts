import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

describe('signup without email verification', () => {
  it('creates a session without sending email when explicitly disabled', async () => {
    const user = {
      id: 'user-1',
      email: 'demo@example.com',
      emailVerifiedAt: null,
    };
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(user),
        delete: jest.fn(),
      },
      refreshToken: { create: jest.fn().mockResolvedValue({}) },
      emailVerificationToken: { create: jest.fn().mockResolvedValue({}) },
    };
    const email = { sendVerificationEmail: jest.fn() };
    const config = {
      get: jest.fn((key: string, fallback?: string) =>
        key === 'EMAIL_VERIFICATION_ENABLED' ? 'false' : fallback,
      ),
    };
    const service = new AuthService(
      prisma as unknown as PrismaService,
      { sign: () => 'access-token' } as unknown as JwtService,
      config as unknown as ConfigService,
      email as unknown as EmailService,
    );

    const result = await service.signup({
      email: user.email,
      password: 'password123',
    });
    expect(result.user).toEqual({
      id: user.id,
      email: user.email,
      emailVerified: false,
    });
    expect(result.accessToken).toBe('access-token');
    expect(email.sendVerificationEmail).not.toHaveBeenCalled();
  });
});
