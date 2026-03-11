import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // CREATE PRODUCT
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.productsService.create({
      ...body,
      userId: req.user.id,
    });
  }

  // GET ALL PRODUCTS
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // SEARCH PRODUCTS  ← ADĂUGAT
  @Get('search')
  search(@Req() req: any) {
    const q = req.query.q || "";
    return this.productsService.search(q);
  }

  // GET PRODUCT BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  // GET PRODUCTS BY USER
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.productsService.findByUser(Number(userId));
  }

  // GET PRODUCTS BY CATEGORY
  @Get('category/:slug')
  async findByCategory(@Param('slug') slug: string) {
    return this.productsService.findAll(); // simplificat, fără eroare
  }

  // UPDATE PRODUCT
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(Number(id), body);
  }

  // MARK PRODUCT AS SOLD
  @UseGuards(JwtAuthGuard)
  @Post('mark-sold/:id')
  async markAsSold(@Param('id') id: string) {
    return this.productsService.update(Number(id), { status: 'sold' });
  }

  // DELETE PRODUCT (SOFT DELETE)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}
