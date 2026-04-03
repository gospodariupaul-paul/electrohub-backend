import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

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

    // întoarcem și produsul, ca să fie util dacă vrei în frontend
    return this.prisma.cartItem.findUnique({
      where: { id: item.id },
      include: {
        product: true,
      },
    });
  }

  async getCartForUser(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }
}
