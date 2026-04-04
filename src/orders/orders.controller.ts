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

  // ⭐ ADMIN schimbă statusul manual
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(Number(id), status);
  }

  // ⭐ ȘTERGE o comandă
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(Number(id));
  }

  // ⭐ FACTURĂ PDF — ADĂUGAT FĂRĂ SĂ ATINGEM ALTCEVA
  @Get(':id/invoice')
  async getInvoice(@Param('id') id: string, @Res() res) {
    const pdf = await this.ordersService.generateInvoicePdf(Number(id));

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=factura-${id}.pdf`,
    });

    pdf.pipe(res);
    pdf.end();
  }
}
