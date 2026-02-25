import { Controller, Post, Body, Get, Param, Delete, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // CREATE PRODUCT
  @Post()
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
    if (!body.userId || isNaN(Number(body.userId))) {
      throw new BadRequestException('Invalid userId');
    }

    return this.productsService.create({
      ...body,
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      stock: Number(body.stock),
      userId: Number(body.userId),
      images: body.images,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // 🔥 MUTAT AICI — TREBUIE SĂ FIE ÎNAINTE DE ":id"
  @Get('user/:id')
  async getProductsByUser(@Param('id') id: string) {
    return this.productsService.getProductsByUser(Number(id));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(Number(id));
  }

  @Post('mark-sold/:id')
  async markAsSold(@Param('id') id: string) {
    return this.productsService.markAsSold(Number(id));
  }
}
