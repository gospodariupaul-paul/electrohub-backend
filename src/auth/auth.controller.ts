import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.body);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshTokens(req.user);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.body.userId);
  }

  // 🔥 Endpoint temporar pentru debugging
  @Get('debug')
  debug(@Req() req: Request) {
    return req.headers;
  }
}
