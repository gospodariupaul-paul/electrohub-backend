import {
  Controller,
  Post,
  Body,
  Headers,
  Get
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      return { message: 'Missing Authorization header' };
    }

    const token = authHeader.split(' ')[1];
    return this.authService.refresh(token);
  }

  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      return { message: 'Missing Authorization header' };
    }

    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

  // DEBUG endpoint — verificăm ce ajunge la server
  @Get('debug')
  debug(@Headers() headers: any) {
    return headers;
  }
}
