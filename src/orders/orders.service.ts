import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import QRCode from 'qrcode';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number) {
    // 1️⃣ Luăm produsele din coș
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('Coșul este gol.');
    }

    // 2️⃣ Calculăm totalul
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // 3️⃣ Luăm setările de livrare ale utilizatorului
    const settings = await this.prisma.deliverySettings.findUnique({
      where: { userId },
    });

    // 4️⃣ Creăm comanda cu setările incluse
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,

        // ⭐ AICI SE FOLOSESC SETĂRILE DE LIVRARE
        courier: settings?.preferredCourier || "sameday",
        street: settings?.street || "",
        number: settings?.number || "",
        city: settings?.city || "",
        county: settings?.county || "",
        postalCode: settings?.postalCode || "",
        callBefore: settings?.callBefore || false,
        noSaturday: settings?.noSaturday || false,
        cashOnDelivery: settings?.cashOnDelivery || false,
        easyboxId: settings?.easyboxId || "",

        // ⭐ Produsele comenzii
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

    // 5️⃣ Golește coșul
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

  // ⭐ FACTURA PREMIUM — DIACRITICE + LOGO + TVA + BORDER COMPLET
  private async generatePdf(order: any, invoiceNumber: string): Promise<Buffer> {
    return new Promise(async (resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const fontPath = path.resolve(process.cwd(), 'fonts', 'DejaVuSans.ttf');
      doc.font(fontPath);

      const logoPath = path.join(process.cwd(), 'public', 'logo.png');

      doc.rect(40, 20, 200, 140).fill('#1E90FF').stroke('#000000');
      doc.image(logoPath, 55, 30, { width: 160 });
      doc.fillColor('#000000');

      doc
        .fontSize(24)
        .text('FACTURĂ FISCALĂ', 0, 50, { align: 'right' });

      doc.moveDown(2);

      doc.fontSize(12);
      doc.text(`Număr factură: ${invoiceNumber}`, { align: 'right' });
      doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, { align: 'right' });

      doc.moveDown(2);

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

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1.5);

      const totalFaraTVA = order.total / 1.19;
      const tva = order.total - totalFaraTVA;

      doc.fontSize(14).text('Produse', { underline: true });
      doc.moveDown(1);

      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 260;
      const col3 = 330;
      const col4 = 420;

      const rowHeight = 25;
      const tableHeight = rowHeight * (order.items.length + 1);

      doc.rect(45, tableTop - 5, 500, tableHeight + 5).stroke();

      doc.fontSize(12).font(fontPath);
      doc.text('Produs', col1, tableTop);
      doc.text('Cant.', col2, tableTop);
      doc.text('Preț', col3, tableTop);
      doc.text('Total', col4, tableTop);

      doc.moveTo(45, tableTop + rowHeight).lineTo(545, tableTop + rowHeight).stroke();

      doc.moveTo(col2 - 10, tableTop - 5).lineTo(col2 - 10, tableTop + tableHeight).stroke();
      doc.moveTo(col3 - 10, tableTop - 5).lineTo(col3 - 10, tableTop + tableHeight).stroke();
      doc.moveTo(col4 - 10, tableTop - 5).lineTo(col4 - 10, tableTop + tableHeight).stroke();

      let y = tableTop + rowHeight + 5;

      order.items.forEach((item) => {
        const totalItem = item.quantity * item.price;

        doc.text(item.product.name, col1, y);
        doc.text(String(item.quantity), col2, y);
        doc.text(`${item.price} lei`, col3, y);
        doc.text(`${totalItem} lei`, col4, y);

        doc.moveTo(45, y + rowHeight - 5).lineTo(545, y + rowHeight - 5).stroke();

        y += rowHeight;
      });

      doc.moveDown(2);

      doc.fontSize(12).font(fontPath);
      doc.text(`Total fără TVA: ${totalFaraTVA.toFixed(2)} lei`, 350);
      doc.text(`TVA (19%): ${tva.toFixed(2)} lei`, 350);
      doc.fontSize(16).text(`TOTAL DE PLATĂ: ${order.total} lei`, 350);

      doc.moveDown(4);

      doc.circle(120, 720, 50).stroke();
      doc.fontSize(12).font(fontPath).text('ELECTROHUB\nOFICIAL', 85, 700, { align: 'center' });

      doc.moveTo(300, 740).lineTo(500, 740).stroke();
      doc.fontSize(12).font(fontPath).text('Semnătură digitală', 330, 745);

      const qrData = `https://anaf.ro/verify?invoice=${invoiceNumber}`;
      const qrImage = await QRCode.toBuffer(qrData);
      doc.image(qrImage, 500, 680, { width: 70 });

      doc.fontSize(10).font(fontPath).text(
        'Vă mulțumim pentru achiziție!',
        0,
        780,
        { align: 'center' }
      );

      doc.end();
    });
  }

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
