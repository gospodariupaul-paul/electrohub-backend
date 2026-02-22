import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🔥 ACUM ACCEPTĂ URL-URI, NU FIȘIERE
  @Post('create')
  async create(
    @Body()
    body: {
      name: string;
      price: number;
      description: string;
      categoryId: number;
      stock: number;
      images: string[]; // 🔥 URL-uri Cloudinary
    },
  ) {
    return this.productsService.create({
      ...body,
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      stock: Number(body.stock),
      images: body.images, // 🔥 URL-uri Cloudinary
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(Number(id));
  }
}
