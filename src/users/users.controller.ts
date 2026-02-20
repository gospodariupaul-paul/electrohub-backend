import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UsersService } from './users.service';

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
}
