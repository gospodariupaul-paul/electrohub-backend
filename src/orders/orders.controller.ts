import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  Patch,
  Body,
  Delete,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(Number(id), status);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(Number(id));
  }

  // ⭐ DESCĂRCARE FACTURĂ — FINAL, CORECT
  @Get(':id/invoice')
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.ordersService.getInvoicePdf(Number(id));

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="factura-${id}.pdf"`,
    });

    res.send(pdfBuffer);
  }
}
