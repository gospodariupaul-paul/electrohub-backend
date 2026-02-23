import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🔥 CREATE PRODUCT
  @Post('create')
  async create(
    @Body()
    body: {
      name: string;
      price: number;
      description: string;
      categoryId: number;
      stock: number;
      images: string[];
      userId: number;
    },
  ) {
    return this.productsService.create({
      ...body,
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      stock: Number(body.stock),
      userId: Number(body.userId),
      images: body.images,
    });
  }

  // 🔥 GET ALL PRODUCTS
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // 🔥 GET PRODUCT BY ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(Number(id));
  }

  // 🔥 GET PRODUCTS BY USER — RUTA LIPSĂ (REPARĂ 404)
  @Get('user/:id')
  async getProductsByUser(@Param('id') id: string) {
    return this.productsService.getProductsByUser(Number(id));
  }

  // 🔥 DELETE PRODUCT
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(Number(id));
  }
}
