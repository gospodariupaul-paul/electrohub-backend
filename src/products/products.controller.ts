import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: any, @Req() req) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.productsService.findByUser(Number(id));
  }

  // 🔥 RUTA NOUĂ — SINGURA MODIFICARE NECESARĂ
  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.productsService.findByCategory(Number(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    return this.productsService.update(Number(id), dto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.productsService.remove(Number(id), req.user.id, req.user.role);
  }
}
