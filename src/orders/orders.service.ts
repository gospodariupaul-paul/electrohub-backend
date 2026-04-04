import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
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

  // ⭐ GENERARE PDF — RETURN BUFFER
  private async generatePdf(order: any, invoiceNumber: string): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // LOGO
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      doc.image(logoPath, 50, 40, { width: 120 });

      // FONT UTF‑8
      const fontPath = path.resolve(process.cwd(), 'fonts', 'DejaVuSans.ttf');
      doc.font(fontPath);

      doc.fontSize(20).text('Factura fiscală', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Număr factură: ${invoiceNumber}`);
      doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`);
      doc.moveDown();

      doc.text('Client:');
      doc.text(order.user.name);
      doc.text(order.user.address || '');
      doc.text(`${order.user.city || ''}, ${order.user.county || ''}`);
      doc.text(order.user.phone || '');
      doc.moveDown();

      doc.text('Produse:', { underline: true });
      order.items.forEach((item) => {
        doc.text(`${item.product.name} — ${item.quantity} x ${item.price} lei`);
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total: ${order.total} lei`, { align: 'right' });

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

    // Dacă există deja → returnăm direct
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
      // dacă nu există → generăm acum
      await this.generateInvoice(orderId);

      const updated = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      return updated.invoicePdf;
    }

    return order.invoicePdf;
  }
}
