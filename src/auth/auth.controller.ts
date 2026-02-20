import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any) {
    const { accessToken, user } = await this.authService.login(dto);

    return {
      message: 'Login successful',
      accessToken,
      user,
    };
  }

  @Post('refresh')
  refresh(@Body() body: any) {
    return this.authService.refresh(body.refresh_token);
  }
}
