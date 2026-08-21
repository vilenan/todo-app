import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly refreshCookieName = 'refresh_token';

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

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = this.getRefreshToken(request);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token отсутствует');
    }

    const authResponse = await this.authService.refresh(refreshToken);
    return this.withRefreshCookie(authResponse, response);
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(this.getRefreshToken(request));
    response.clearCookie(this.refreshCookieName, { path: '/auth' });
    return { success: true };
  }

  private withRefreshCookie(
    authResponse: Awaited<ReturnType<AuthService['login']>>,
    response: Response,
  ) {
    response.cookie(this.refreshCookieName, authResponse.refreshToken, {
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

  private getRefreshToken(request: Request) {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;

    const cookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${this.refreshCookieName}=`));

    return cookie?.slice(this.refreshCookieName.length + 1);
  }
}
