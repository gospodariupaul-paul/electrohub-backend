import { Controller, Post, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req) {
    const { email, password } = req.body;
    return this.authService.login(email, password);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Get('debug')
  async debug(@Req() req) {
    console.log('🔥 DEBUG USER:', req.user);
    console.log('🔥 DEBUG HEADERS:', req.headers);
    return {
      user: req.user,
      headers: req.headers,
    };
  }
}
