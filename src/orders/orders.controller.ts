import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // -------------------------
  // CREATE ORDER
  // -------------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, dto);
  }

  // -------------------------
  // GET ALL ORDERS FOR USER
  // -------------------------
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    return this.ordersService.findAll(req.user.userId);
  }

  // -------------------------
  // GET ORDER BY ID
  // -------------------------
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.userId, Number(id));
  }
}
