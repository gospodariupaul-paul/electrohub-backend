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

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    let imageUrl = null;

    // Upload imagine dacă există
    if (file) {
      const uploaded: any = await this.productsService.uploadImage(file);
      imageUrl = uploaded.secure_url;
    }

    // Creare produs cu toate câmpurile necesare
    return this.productsService.create({
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      description: body.description,
      imageUrl,
      categoryId: Number(body.categoryId), // FIX ESENȚIAL
    });
  }
}
