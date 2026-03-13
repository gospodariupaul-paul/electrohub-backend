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
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from '../notification/notification.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly notificationService: NotificationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: any, @Req() req) {
    const product = await this.productsService.create(createProductDto, req.user.id);

    await this.notificationService.createNotification(
      req.user.id,
      `Produsul tău "${createProductDto.name}" a fost adăugat cu succes!`
    );

    return product;
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.productsService.findByUser(Number(id));
  }

  @Get('search')
  search(@Req() req) {
    return this.productsService.search(req.query.q);
  }

  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.productsService.findByCategory(Number(id));
  }

  // 🔥 SINGURA MODIFICARE — protecție pentru ID invalid
  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new NotFoundException('ID invalid');
    }

    return this.productsService.findOne(numericId);
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
