import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as path from 'path';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('Coșul este gol.');
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            city: true,
            county: true,
            address: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrdersByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async updateStatus(id: number, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async deleteOrder(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.prisma.shipment.deleteMany({
      where: { orderId: id },
    });

    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    return this.prisma.order.delete({
      where: { id },
    });
  }

  // ⭐ GENERARE NUMĂR FACTURĂ
  private async generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const count = await this.prisma.order.count({
      where: { invoiceNumber: { startsWith: `INV-${year}-${month}` } },
    });

    const next = String(count + 1).padStart(4, '0');

    return `INV-${year}-${month}-${next}`;
  }

  // ⭐ FACTURA PREMIUM — RETURN BUFFER
  private async generatePdf(order: any, invoiceNumber: string): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // FONT UTF-8
      const fontPath = path.resolve(process.cwd(), 'fonts', 'DejaVuSans.ttf');
      doc.font(fontPath);

      // LOGO
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      doc.image(logoPath, 50, 40, { width: 120, opacity: 1 });

      // ANTET
      doc
        .fontSize(20)
        .text('FACTURĂ FISCALĂ', 0, 50, { align: 'right' });

      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Număr factură: ${invoiceNumber}`, { align: 'right' });
      doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, { align: 'right' });

      doc.moveDown(2);

      // DATE FIRMĂ
      doc.fontSize(12).text('Emitent:', { underline: true });
      doc.text('ElectroHub SRL');
      doc.text('CUI: 12345678');
      doc.text('Nr. Reg. Com.: J22/123/2024');
      doc.text('Iași, România');

      doc.moveDown();

      // DATE CLIENT
      doc.fontSize(12).text('Client:', { underline: true });
      doc.text(order.user.name);
      doc.text(order.user.address || '');
      doc.text(`${order.user.city || ''}, ${order.user.county || ''}`);
      doc.text(order.user.phone || '');

      doc.moveDown(2);

      // LINIE SEPARARE
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown();

      // TABEL PRODUSE
      doc.fontSize(12).text('Produse:', { underline: true });
      doc.moveDown(0.5);

      // HEADERS
      doc.fontSize(12).text('Produs', 50, doc.y);
      doc.text('Cant.', 300, doc.y);
      doc.text('Preț', 350, doc.y);
      doc.text('Total', 450, doc.y);

      doc.moveDown(0.5);

      // LINIE
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown(0.5);

      // ITEMS
      order.items.forEach((item) => {
        const totalItem = item.quantity * item.price;

        doc.text(item.product.name, 50, doc.y);
        doc.text(String(item.quantity), 300, doc.y);
        doc.text(`${item.price} lei`, 350, doc.y);
        doc.text(`${totalItem} lei`, 450, doc.y);

        doc.moveDown(0.5);
      });

      doc.moveDown(1);

      // TOTAL BOX
      doc.rect(350, doc.y, 200, 40).stroke();
      doc.fontSize(14).text(`TOTAL: ${order.total} lei`, 360, doc.y + 10);

      doc.moveDown(3);

      // FOOTER
      doc.fontSize(10).text(
        'Vă mulțumim pentru achiziție!',
        0,
        780,
        { align: 'center' }
      );

      doc.end();
    });
  }

  // ⭐ GENERARE + SALVARE FACTURĂ
  async generateInvoice(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: { include: { product: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.invoicePdf) {
      return {
        invoiceNumber: order.invoiceNumber,
        invoicePath: order.invoicePath,
      };
    }

    const invoiceNumber = await this.generateInvoiceNumber();
    const pdfBuffer = await this.generatePdf(order, invoiceNumber);

    const invoicePath = `/orders/${orderId}/invoice`;

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        invoiceNumber,
        invoicePdf: pdfBuffer,
        invoicePath,
      },
    });

    return { invoiceNumber, invoicePath };
  }

  // ⭐ DESCĂRCARE PDF
  async getInvoicePdf(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || !order.invoicePdf) {
      await this.generateInvoice(orderId);

      const updated = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      return updated!.invoicePdf;
    }

    return order.invoicePdf;
  }
}
