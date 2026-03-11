import { Controller, Post, Body, Res, Req, UseGuards, Get } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);

    // JWT COOKIE
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    // REFRESH TOKEN COOKIE
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('refresh')
  async refresh(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(body.refresh_token);

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Token refreshed' };
  }

  // 🔥 RUTA CARE LIPSEA — FIXUL PROBLEMEI
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }

  // 🔥 LOGOUT CORECT — ia userul din JWT, nu din body
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;

    await this.authService.logout(user.sub);

    res.clearCookie('jwt', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    return { message: 'Logged out successfully' };
  }
}
