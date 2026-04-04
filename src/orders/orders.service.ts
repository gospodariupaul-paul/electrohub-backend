import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import QRCode from 'qrcode';

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

  // ⭐ FACTURA PREMIUM COMPLETĂ
  private async generatePdf(order: any, invoiceNumber: string): Promise<Buffer> {
    return new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // FONT UTF-8
      const fontPath = path.resolve(process.cwd(), 'fonts', 'DejaVuSans.ttf');
      doc.font(fontPath);

      // LOGO + FUNDAL
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      doc.rect(50, 40, 140, 70).fill('#FFFFFF');
      doc.image(logoPath, 55, 45, { width: 120 });
      doc.fillColor('#000000');

      // ANTET
      doc
        .fontSize(22)
        .text('FACTURĂ FISCALĂ', 0, 50, { align: 'right' });

      doc.moveDown(2);

      // INFO FACTURĂ
      doc.fontSize(12);
      doc.text(`Număr factură: ${invoiceNumber}`, { align: 'right' });
      doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, { align: 'right' });

      doc.moveDown(2);

      // EMITENT + CLIENT ÎN DOUĂ COLOANE
      const topY = doc.y;

      doc.fontSize(12).text('Emitent:', 50, topY, { underline: true });
      doc.text('ElectroHub SRL', 50);
      doc.text('CUI: 12345678', 50);
      doc.text('Nr. Reg. Com.: J22/123/2024', 50);
      doc.text('Iași, România', 50);

      doc.fontSize(12).text('Client:', 300, topY, { underline: true });
      doc.text(order.user.name, 300);
      doc.text(order.user.address || '', 300);
      doc.text(`${order.user.city || ''}, ${order.user.county || ''}`, 300);
      doc.text(order.user.phone || '', 300);

      doc.moveDown(3);

      // LINIE SEPARARE
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1.5);

      // TABEL PRODUSE CU BORDER COMPLET
      doc.fontSize(14).text('Produse', { underline: true });
      doc.moveDown(1);

      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 250;
      const col3 = 350;
      const col4 = 450;

      // HEADER
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Produs', col1, tableTop);
      doc.text('Cant.', col2, tableTop);
      doc.text('Preț', col3, tableTop);
      doc.text('Total', col4, tableTop);

      let y = tableTop + 20;

      // BORDER EXTERIOR
      doc.rect(45, tableTop - 5, 510, 25 + order.items.length * 25).stroke();

      // LINIE SUB HEADER
      doc.moveTo(45, tableTop + 20).lineTo(555, tableTop + 20).stroke();

      // ITEMS
      doc.font('Helvetica');
      order.items.forEach((item) => {
        const totalItem = item.quantity * item.price;

        doc.text(item.product.name, col1, y);
        doc.text(String(item.quantity), col2, y);
        doc.text(`${item.price} lei`, col3, y);
        doc.text(`${totalItem} lei`, col4, y);

        doc.moveTo(45, y + 20).lineTo(555, y + 20).stroke();

        y += 25;
      });

      doc.moveDown(3);

      // TOTAL BOX
      const totalY = doc.y;
      doc.rect(350, totalY, 200, 40).stroke();
      doc.fontSize(16).font('Helvetica-Bold').text(`TOTAL: ${order.total} lei`, 360, totalY + 10);

      doc.moveDown(4);

      // ȘTAMPILĂ
      doc.circle(120, 720, 50).stroke();
      doc.fontSize(12).text('ELECTROHUB\nOFICIAL', 85, 700, { align: 'center' });

      // SEMNĂTURĂ DIGITALĂ
      doc.moveTo(300, 740).lineTo(500, 740).stroke();
      doc.fontSize(12).text('Semnătură digitală', 330, 745);

      // QR ANAF
      const qrData = `https://anaf.ro/verify?invoice=${invoiceNumber}`;
      const qrImage = await QRCode.toBuffer(qrData);
      doc.image(qrImage, 500, 680, { width: 70 });

      // FOOTER
      doc.fontSize(10).font('Helvetica').text(
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
