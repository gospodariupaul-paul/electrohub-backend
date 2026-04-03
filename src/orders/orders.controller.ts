import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🔥 Creează comanda din coș (fără body)
  @Post()
  create(@Req() req) {
    return this.ordersService.createOrder(req.user.sub);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @Get('user/:id')
  getOrdersByUser(@Param('id') id: string) {
    return this.ordersService.getOrdersByUser(Number(id));
  }
}
