import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: any) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: any) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  logout(@Body() dto: any) {
    return this.authService.logout(dto.refreshToken);
  }
}
