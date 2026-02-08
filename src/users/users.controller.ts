import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    console.log("🔥 req.user =", req.user);
    console.log("🔥 typeof req.user.sub =", typeof req.user.sub);
    return this.usersService.findById(Number(req.user.sub));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(Number(req.user.sub), dto);
  }
}
