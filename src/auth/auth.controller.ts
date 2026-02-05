import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
  console.log('BODY RECEIVED:', loginDto);
  return this.authService.login(loginDto.email, loginDto.password);
}
    return this.authService.login(body.email, body.password);
  }
}
