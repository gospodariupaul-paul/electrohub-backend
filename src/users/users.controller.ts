import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Get,
  Put,
  Param,
  Delete,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UsersService } from './users.service';
import type { Request } from "express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    let imageUrl = null;

    if (file) {
      const uploaded: any = await this.usersService.uploadImage(file);
      imageUrl = uploaded.secure_url;
    }

    return this.usersService.create({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      description: body.description,
      imageUrl,
    });
  }

  @Get('online')
  @UseGuards(JwtAuthGuard)
  async getOnlineUsers() {
    return this.usersService.getOnlineUsers();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(Number(id), body);
  }

  // 🔥 ȘTERGERE CONT — CU GUARD (altfel nu ai req.user)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any)?.id;

    if (userId !== Number(id)) {
      return { message: "Forbidden" };
    }

    await this.usersService.deleteUser(Number(id));

    return { message: "User deleted successfully" };
  }
}
