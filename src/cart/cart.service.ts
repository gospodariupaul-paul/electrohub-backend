import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // 🛒 Adaugă în coș (sau crește cantitatea)
  async addToCart(userId: number, productId: number, quantity: number) {
    const item = await this.prisma.cartItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });

    // returnăm item-ul cu produsul inclus
    return this.prisma.cartItem.findUnique({
      where: { id: item.id },
      include: { product: true },
    });
  }

  // 🛒 Obține coșul utilizatorului
  async getCartForUser(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  // 🗑 Șterge un produs din coș
  async removeFromCart(userId: number, productId: number) {
    return this.prisma.cartItem.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }
}
