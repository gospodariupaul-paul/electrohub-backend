import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, user } = await this.authService.login(dto);

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return { user };
  }

  @Post('refresh')
  async refresh(@Body() body: any) {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Logged out' };
  }
}
