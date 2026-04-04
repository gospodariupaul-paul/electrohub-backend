import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

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

  // ⭐ ADMIN + WEBHOOK schimbă statusul
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

  // ⭐ ȘTERGE comanda + itemele + shipment-urile
  async deleteOrder(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // 🔥 Ștergem shipment-urile
    await this.prisma.shipment.deleteMany({
      where: { orderId: id },
    });

    // 🔥 Ștergem item-urile comenzii
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // 🔥 Ștergem comanda
    return this.prisma.order.delete({
      where: { id },
    });
  }

  // ⭐ FACTURĂ PDF — ADĂUGAT FĂRĂ SĂ ATINGEM ALTCEVA
  async generateInvoicePdf(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const doc = new PDFDocument();

    // TITLU
    doc.fontSize(20).text("Factura fiscală", { align: "center" });
    doc.moveDown();

    // DATE FIRMĂ
    doc.fontSize(12).text("Emitent:");
    doc.text("ElectroHub SRL");
    doc.text("CUI: 12345678");
    doc.text("Nr. Reg. Com.: J22/123/2024");
    doc.text("Iași, România");
    doc.moveDown();

    // DATE CLIENT
    doc.text("Client:");
    doc.text(order.user.name);
    doc.text(order.user.address || "");
    doc.text(`${order.user.city || ""}, ${order.user.county || ""}`);
    doc.text(order.user.phone || "");
    doc.moveDown();

    // PRODUSE
    doc.text("Produse:", { underline: true });
    order.items.forEach(item => {
      doc.text(`${item.product.name} — ${item.quantity} x ${item.price} lei`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: ${order.total} lei`, { align: "right" });

    return doc;
  }
}
