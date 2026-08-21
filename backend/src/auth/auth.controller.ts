import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.withRefreshCookie(await this.authService.signup(dto), response);
  }

  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.withRefreshCookie(await this.authService.login(dto), response);
  }

  private withRefreshCookie(
    authResponse: Awaited<ReturnType<AuthService['login']>>,
    response: Response,
  ) {
    response.cookie('refresh_token', authResponse.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: authResponse.refreshTokenExpiresAt.getTime() - Date.now(),
      path: '/auth',
    });

    return {
      accessToken: authResponse.accessToken,
      user: authResponse.user,
    };
  }
}
