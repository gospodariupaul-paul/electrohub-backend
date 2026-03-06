import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any, @Res() res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);

    // Setează cookie-ul JWT
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.json({
      message: 'Login successful',
      user,
      refreshToken,
    });
  }

  @Post('refresh')
  refresh(@Body() body: any) {
    return this.authService.refresh(body.refresh_token);
  }
}
