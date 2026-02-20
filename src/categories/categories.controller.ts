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

import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    let imageUrl = null;

    if (file) {
      const uploaded: any = await this.categoriesService.uploadImage(file);
      imageUrl = uploaded.secure_url;
    }

    return this.categoriesService.create({
      name: body.name,
      description: body.description,
      imageUrl,
    });
  }
}
