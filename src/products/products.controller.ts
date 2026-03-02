import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  BadRequestException,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private detectCategory(name: string): string {
    const n = name.toLowerCase();

    if (n.includes("lapt")) return "Laptopuri";
    if (n.includes("tel") || n.includes("samsung") || n.includes("iphone")) return "Telefoane";
    if (n.includes("dron")) return "Drones";
    if (n.includes("tv") || n.includes("televizor")) return "Audio-Video";
    if (n.includes("casetofon")) return "Audio-Video";

    return "Componente PC";
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body()
    body: {
      name: string;
      price: number;
      description: string;
      stock: number;
      images: string[];
    },
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const category = this.detectCategory(body.name);

    return this.productsService.create({
      ...body,
      price: Number(body.price),
      stock: Number(body.stock),
      userId: Number(userId),
      images: body.images,
      category,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('category/:slug')
  async findByCategory(@Param('slug') slug: string) {
    return this.productsService.findByCategory(slug);
  }

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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      price?: number;
      description?: string;
      images?: string[];
    },
  ) {
    return this.productsService.update(Number(id), body);
  }
}
